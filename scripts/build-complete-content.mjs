import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const contentRoot = path.resolve("content");
const inventory = JSON.parse(await readFile(path.join(contentRoot, "inventario-materiais.json"), "utf8"));
const pilotPayload = JSON.parse(await readFile(path.join(contentRoot, "recursos-piloto.json"), "utf8"));
const outputDirectory = path.join(contentRoot, "recursos");

const pilotBySource = new Map(pilotPayload.recursos.map((resource) => [resource.fonteDoConteudo, resource]));

function slug(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function sourcePath(source) {
  return source.replace(/^imagem-final:/, "");
}

function publicVisual(source) {
  return `/recursos/${sourcePath(source)}`;
}

function publicPdf(value) {
  return `/imprimiveis/${path.basename(value)}`;
}

const resources = inventory.recursos.map((item) => {
  const pilot = pilotBySource.get(item.fonteDoConteudo);
  if (pilot) {
    return {
      ...pilot,
      arquivoVisual: publicVisual(pilot.fonteDoConteudo),
      arquivoImpressao: publicPdf(pilot.arquivoImpressao),
      fontesPorCampo: {
        ...pilot.fontesPorCampo,
        categoria: pilot.fonteDoConteudo,
        tags: pilot.fonteDoConteudo,
        produtoOrigem: pilot.fonteDoConteudo
      }
    };
  }

  const id = slug(`${item.produtoOuBonus}-${item.nomeArquivo.replace(/\.png$/, "")}`);
  return {
    id,
    titulo: item.tituloRecurso,
    subtitulo: null,
    categoria: item.categorias,
    tags: [],
    faixaEtaria: null,
    arquivoVisual: publicVisual(item.fonteDoConteudo),
    arquivoImpressao: publicPdf(item.arquivoImpressaoAssociado),
    produtoOrigem: item.produtoOuBonus,
    descricaoAprovada: null,
    situacoesDeUso: [],
    instrucoesDeUso: [],
    camposParaObservar: [],
    informacoesParaCompartilhar: [],
    aviso: null,
    fonteDoConteudo: item.fonteDoConteudo,
    fontesPorCampo: {
      titulo: item.fonteDoConteudo,
      categoria: item.fonteDoConteudo,
      produtoOrigem: item.fonteDoConteudo
    }
  };
});

const ids = new Set();
for (const resource of resources) {
  if (ids.has(resource.id)) throw new Error(`ID duplicado: ${resource.id}`);
  ids.add(resource.id);
}

const payload = {
  projeto: "Biblioteca Rotina TEA",
  regra: "Acervo completo baseado no inventário aprovado. Campos não comprovados permanecem nulos ou vazios.",
  fallbackDeInterface: "Informação não cadastrada.",
  total: resources.length,
  recursos: resources
};

await mkdir(outputDirectory, { recursive: true });
await writeFile(path.join(contentRoot, "recursos-completos.json"), `${JSON.stringify(payload, null, 2)}\n`);
for (const resource of resources) {
  await writeFile(path.join(outputDirectory, `${resource.id}.json`), `${JSON.stringify(resource, null, 2)}\n`);
}

console.log(JSON.stringify({ recursos: resources.length, pilotosCompletos: pilotBySource.size, camposAusentesPreservados: resources.length - pilotBySource.size }));
