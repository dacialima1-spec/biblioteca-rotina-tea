import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const contentRoot = path.resolve("content");
const outputRoot = path.resolve("output");
const payload = JSON.parse(await readFile(path.join(contentRoot, "recursos-piloto.json"), "utf8"));

const required = [
  "id", "titulo", "subtitulo", "categoria", "tags", "faixaEtaria", "arquivoVisual",
  "arquivoImpressao", "produtoOrigem", "descricaoAprovada", "situacoesDeUso",
  "instrucoesDeUso", "camposParaObservar", "informacoesParaCompartilhar", "aviso",
  "fonteDoConteudo", "fontesPorCampo"
];
const sourcedTextFields = [
  "titulo", "subtitulo", "descricaoAprovada", "situacoesDeUso", "instrucoesDeUso",
  "camposParaObservar", "informacoesParaCompartilhar", "aviso"
];
const allowedCategories = new Set([
  "Rotinas", "Escola", "Comunicação Visual", "Emoções e Autorregulação",
  "Missões e Recompensas", "Primeiro e Depois", "Rotinas por Ambiente",
  "Calendário Visual", "Guia dos Pais", "Acompanhamento"
]);
const prohibitedKeys = new Set([
  "diagnostico", "diagnóstico", "evolucaoClinica", "evoluçãoClínica", "eficacia",
  "eficácia", "gravidade", "prognostico", "prognóstico", "tratamento", "sintomas",
  "recomendacaoAutomatica", "recomendaçãoAutomática", "conclusaoAutomatica", "conclusãoAutomática"
]);

function hasContent(value) {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === "string" && value.trim().length > 0;
}

const errors = [];
for (const resource of payload.recursos) {
  for (const field of required) {
    if (!(field in resource)) errors.push(`${resource.id ?? "sem-id"}: campo obrigatório ausente: ${field}`);
  }
  for (const key of Object.keys(resource)) {
    if (prohibitedKeys.has(key)) errors.push(`${resource.id}: campo clínico proibido: ${key}`);
  }
  if (!resource.fonteDoConteudo?.trim()) errors.push(`${resource.id}: fonteDoConteudo vazia`);
  for (const category of resource.categoria ?? []) {
    if (!allowedCategories.has(category)) errors.push(`${resource.id}: categoria não permitida: ${category}`);
  }
  for (const field of sourcedTextFields) {
    if (hasContent(resource[field]) && !resource.fontesPorCampo?.[field]?.trim()) {
      errors.push(`${resource.id}: ${field} possui conteúdo sem fonte por campo`);
    }
  }
  for (const fileField of ["arquivoVisual", "arquivoImpressao"]) {
    try {
      await access(path.resolve(contentRoot, resource[fileField]));
    } catch {
      errors.push(`${resource.id}: arquivo não encontrado em ${fileField}: ${resource[fileField]}`);
    }
  }
}

const report = {
  projeto: "Biblioteca Rotina TEA",
  executadoEm: "2026-07-16",
  recursosValidados: payload.recursos.length,
  regras: [
    "campos obrigatórios presentes",
    "categorias dentro da lista aprovada",
    "todo texto preenchido possui fonte por campo",
    "campos clínicos e conclusões automáticas ausentes",
    "arquivos visuais e imprimíveis existentes"
  ],
  status: errors.length === 0 ? "aprovado tecnicamente" : "reprovado",
  erros: errors
};

await mkdir(outputRoot, { recursive: true });
await writeFile(path.join(outputRoot, "validacao-primeira-entrega.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report));
if (errors.length) process.exitCode = 1;
