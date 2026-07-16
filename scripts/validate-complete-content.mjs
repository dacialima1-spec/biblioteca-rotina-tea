import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(".");
const contentRoot = path.join(root, "content");
const sourceRoot = path.resolve("../kit-planner-rotina-tea/finais");
const sourceRootAvailable = await access(sourceRoot).then(() => true).catch(() => false);
const payload = JSON.parse(await readFile(path.join(contentRoot, "recursos-completos.json"), "utf8"));
const schema = JSON.parse(await readFile(path.join(contentRoot, "recurso.schema.json"), "utf8"));

const required = schema.required;
const allowedCategories = new Set(schema.properties.categoria.items.enum);
const sourceRequiredFields = [
  "titulo", "subtitulo", "categoria", "tags", "faixaEtaria", "produtoOrigem",
  "descricaoAprovada", "situacoesDeUso", "instrucoesDeUso", "camposParaObservar",
  "informacoesParaCompartilhar", "aviso"
];
const prohibitedKeys = new Set([
  "diagnostico", "diagnóstico", "evolucaoClinica", "evoluçãoClínica", "eficacia",
  "eficácia", "gravidade", "prognostico", "prognóstico", "tratamento", "sintomas",
  "nivelDeSintomas", "nívelDeSintomas", "recomendacaoAutomatica", "recomendaçãoAutomática",
  "conclusaoAutomatica", "conclusãoAutomática"
]);

function hasContent(value) {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === "string" && value.trim().length > 0;
}

const errors = [];
const ids = new Set();
for (const resource of payload.recursos) {
  if (ids.has(resource.id)) errors.push(`${resource.id}: ID duplicado`);
  ids.add(resource.id);
  for (const field of required) if (!(field in resource)) errors.push(`${resource.id}: campo obrigatório ausente: ${field}`);
  for (const key of Object.keys(resource)) if (prohibitedKeys.has(key)) errors.push(`${resource.id}: campo proibido: ${key}`);
  if (!resource.fonteDoConteudo?.trim()) errors.push(`${resource.id}: fonte principal vazia`);
  for (const category of resource.categoria ?? []) if (!allowedCategories.has(category)) errors.push(`${resource.id}: categoria não permitida: ${category}`);
  for (const field of sourceRequiredFields) {
    if (hasContent(resource[field]) && !resource.fontesPorCampo?.[field]?.trim()) errors.push(`${resource.id}: ${field} preenchido sem fonte`);
  }
  const sourceRelative = resource.fonteDoConteudo.replace(/^imagem-final:/, "");
  const files = [
    ["imagem pública", path.join(root, "public", resource.arquivoVisual.replace(/^\//, ""))],
    ["PDF público", path.join(root, "public", resource.arquivoImpressao.replace(/^\//, ""))]
  ];
  if (sourceRootAvailable) files.push(["fonte", path.join(sourceRoot, sourceRelative)]);
  for (const [label, file] of files) {
    try { await access(file); } catch { errors.push(`${resource.id}: ${label} não encontrado: ${file}`); }
  }
}

if (payload.recursos.length !== 67) errors.push(`Total incorreto: esperado 67, encontrado ${payload.recursos.length}`);

const report = {
  projeto: "Biblioteca Rotina TEA",
  executadoEm: "2026-07-16",
  recursosValidados: payload.recursos.length,
  imagensValidadas: payload.recursos.length,
  pdfsAssociadosValidados: new Set(payload.recursos.map((item) => item.arquivoImpressao)).size,
  status: errors.length ? "reprovado" : "aprovado tecnicamente",
  erros: errors,
  avisos: sourceRootAvailable ? [] : [`pasta de fontes não encontrada (${sourceRoot}); verificação de fonte original ignorada`]
};

await mkdir(path.join(root, "output"), { recursive: true });
await writeFile(path.join(root, "output", "validacao-acervo-completo.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report));
if (errors.length) process.exitCode = 1;
