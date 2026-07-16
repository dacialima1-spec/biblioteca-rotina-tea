import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const workspace = path.resolve("..");
const sourceRoot = path.join(workspace, "kit-planner-rotina-tea");
const imagesRoot = path.join(sourceRoot, "finais");
const pdfRoot = path.join(sourceRoot, "output", "pdf");
const outputRoot = path.resolve("content");

const titleOverrides = {
  "produto-principal/01-capa.png": "Kit Planner Rotina TEA",
  "produto-principal/02-identificacao.png": "Este Planner é Meu!",
  "produto-principal/03-como-usar.png": "Como Usar o Kit",
  "produto-principal/04-meu-perfil.png": "Tudo Sobre Mim",
  "produto-principal/05-minha-rotina-semanal.png": "Minha Rotina Semanal",
  "produto-principal/06-minha-rotina-de-hoje.png": "Minha Rotina de Hoje",
  "produto-principal/07-rotina-da-manha.png": "Minha Rotina da Manhã",
  "produto-principal/08-depois-da-escola.png": "Depois da Escola",
  "produto-principal/09-rotina-da-noite.png": "Minha Rotina da Noite",
  "produto-principal/10-rotina-escolar.png": "Minha Rotina Escolar",
  "produto-principal/11-horario-escolar.png": "Meu Horário Escolar",
  "produto-principal/12-minha-mochila.png": "Checklist da Mochila",
  "produto-principal/13-minhas-tarefas.png": "Minhas Tarefas",
  "produto-principal/14-dever-de-casa.png": "Meu Dever de Casa",
  "produto-principal/15-planejamento-de-provas.png": "Planejamento de Provas",
  "produto-principal/16-projetos-escolares.png": "Meus Projetos Escolares",
  "produto-principal/17-calendario-mensal.png": "Meu Calendário Mensal",
  "produto-principal/18-mudanca-de-planos.png": "Mudança de Planos",
  "produto-principal/19-quadro-de-escolhas.png": "Meu Quadro de Escolhas",
  "produto-principal/20-conquista-da-semana.png": "Minha Conquista da Semana",
  "produto-principal/21-registro-de-progresso.png": "Registro de Progresso",
  "produto-principal/22-certificado-conquista-da-rotina.png": "Conquista da Rotina",
  "bonus-01-caderno-emocoes/01-capa.png": "Caderno das Emoções TEA",
  "bonus-01-guia-dos-pais/01-capa.png": "Guia dos Pais",
  "bonus-02-cartoes-comunicacao/01-capa.png": "Cartões de Comunicação",
  "bonus-03-primeiro-depois/01-capa.png": "Quadro Primeiro → Depois",
  "bonus-04-rotina-ambientes/01-capa.png": "Rotina por Ambientes",
  "bonus-05-calendario-visual/01-capa.png": "Calendário Visual"
};

const originByFolder = {
  "produto-principal": "Kit Planner Rotina TEA",
  "bonus-01-caderno-emocoes": "Material adicional criado — Caderno das Emoções TEA",
  "bonus-01-guia-dos-pais": "Bônus 1 — Guia dos Pais",
  "bonus-02-cartoes-comunicacao": "Bônus 2 — Cartões de Comunicação",
  "bonus-03-primeiro-depois": "Bônus 3 — Quadro Primeiro → Depois",
  "bonus-04-rotina-ambientes": "Bônus 4 — Rotina por Ambientes",
  "bonus-05-calendario-visual": "Bônus 5 — Calendário Visual"
};

const pdfByFolder = {
  "produto-principal": "Kit-Planner-Rotina-TEA.pdf",
  "bonus-01-caderno-emocoes": "Bonus-01-Caderno-das-Emocoes-TEA.pdf",
  "bonus-01-guia-dos-pais": "Bonus-01-Guia-dos-Pais.pdf",
  "bonus-02-cartoes-comunicacao": "Bonus-02-Cartoes-de-Comunicacao.pdf",
  "bonus-03-primeiro-depois": "Bonus-03-Quadro-Primeiro-Depois.pdf",
  "bonus-04-rotina-ambientes": "Bonus-04-Rotina-por-Ambientes.pdf",
  "bonus-05-calendario-visual": "Bonus-05-Calendario-Visual.pdf"
};

function titleFromFilename(relativePath) {
  if (titleOverrides[relativePath]) return titleOverrides[relativePath];
  return path.basename(relativePath, ".png")
    .replace(/^\d+-/, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace("Emocoes", "Emoções")
    .replace("Manha", "Manhã")
    .replace("Amanha", "Amanhã")
    .replace("Cartoes", "Cartões")
    .replace("Calendario", "Calendário")
    .replace("Comunicacao", "Comunicação")
    .replace("Reforco", "Reforço");
}

function categoriesFor(folder, file) {
  const name = file.toLowerCase();
  const categories = new Set();
  if (folder === "produto-principal") categories.add("Rotinas");
  if (folder.includes("emocoes")) categories.add("Emoções e Autorregulação");
  if (folder.includes("guia-dos-pais")) categories.add("Guia dos Pais");
  if (folder.includes("cartoes-comunicacao")) categories.add("Comunicação Visual");
  if (folder.includes("primeiro-depois")) categories.add("Primeiro e Depois");
  if (folder.includes("rotina-ambientes")) categories.add("Rotinas por Ambiente");
  if (folder.includes("calendario-visual")) categories.add("Calendário Visual");
  if (/escola|escolar|mochila|provas|projetos|dever|tarefas/.test(name)) categories.add("Escola");
  if (/calendario|hoje-amanha|contagem/.test(name)) categories.add("Calendário Visual");
  if (/escolhas|comunicacao|cartoes/.test(name)) categories.add("Comunicação Visual");
  if (/conquista|certificado|reforco|recompensa/.test(name)) categories.add("Missões e Recompensas");
  if (/progresso|registro/.test(name)) categories.add("Acompanhamento");
  if (/mudanca|pausa|calma|emocional|corpo|sentindo|emocoes/.test(name)) categories.add("Emoções e Autorregulação");
  return [...categories];
}

async function listFiles(root, extension) {
  const folders = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const folder of folders.filter((entry) => entry.isDirectory())) {
    const children = await readdir(path.join(root, folder.name));
    for (const child of children.filter((name) => name.endsWith(extension)).sort()) {
      files.push({ folder: folder.name, file: child });
    }
  }
  return files;
}

const imageFiles = await listFiles(imagesRoot, ".png");
const resources = imageFiles.map(({ folder, file }) => {
  const relativePath = `${folder}/${file}`;
  const title = titleFromFilename(relativePath);
  return {
    id: relativePath.replace(/\.png$/, "").replaceAll("/", "--"),
    nomeArquivo: file,
    tituloRecurso: title,
    produtoOuBonus: originByFolder[folder],
    categorias: categoriesFor(folder, file),
    textoEncontradoNestaEtapa: [title],
    imagemAssociada: `../../kit-planner-rotina-tea/finais/${relativePath}`,
    arquivoImpressaoAssociado: `../../kit-planner-rotina-tea/output/pdf/${pdfByFolder[folder]}`,
    camposComConteudoAprovado: [
      "id",
      "titulo",
      "categoria",
      "arquivoVisual",
      "arquivoImpressao",
      "produtoOrigem",
      "fonteDoConteudo"
    ],
    camposSemConteudoAprovadoNestaEtapa: [
      "faixaEtaria",
      "descricaoAprovada",
      "situacoesDeUso",
      "instrucoesDeUso",
      "camposParaObservar",
      "informacoesParaCompartilhar",
      "aviso"
    ],
    fonteDoConteudo: `imagem-final:${relativePath}`,
    status: "inventariado — transcrição detalhada pendente de aprovação dos pilotos"
  };
});

const pdfFiles = (await readdir(pdfRoot)).filter((name) => name.endsWith(".pdf")).sort();
const printFiles = pdfFiles.map((file) => ({
  nomeArquivo: file,
  caminho: `../../kit-planner-rotina-tea/output/pdf/${file}`,
  tipo: "PDF imprimível aprovado",
  fonte: `arquivo-final:${file}`
}));

const inventory = {
  projeto: "Biblioteca Rotina TEA",
  geradoEm: "2026-07-16",
  regra: "Inventário factual. Campos não comprovados permanecem vazios.",
  totais: {
    recursosVisuais: resources.length,
    arquivosPdf: printFiles.length
  },
  recursos: resources,
  arquivosImpressao: printFiles,
  estruturasLegadasNaoAprovadasComoFonte: [
    "../../kit-planner-rotina-tea/content/*.json — coleções vazias ou pilotos anteriores divergentes das artes finais"
  ]
};

const fallback = "Informação não cadastrada.";
const pilots = {
  projeto: "Biblioteca Rotina TEA",
  regra: "Somente cinco recursos piloto. Textos copiados das artes finais; campos não comprovados permanecem nulos ou vazios.",
  fallbackDeInterface: fallback,
  recursos: [
    {
      id: "guia-pais-antes-de-comecar",
      titulo: "Antes de Começar",
      subtitulo: "O objetivo não é uma rotina perfeita. É tornar o dia mais previsível.",
      categoria: ["Guia dos Pais", "Rotinas"],
      tags: ["rotina", "previsível", "imagens", "repetição", "autonomia"],
      faixaEtaria: null,
      arquivoVisual: "../../kit-planner-rotina-tea/finais/bonus-01-guia-dos-pais/02-antes-de-comecar.png",
      arquivoImpressao: "../../kit-planner-rotina-tea/output/pdf/Bonus-01-Guia-dos-Pais.pdf",
      produtoOrigem: "Bônus 1 — Guia dos Pais",
      descricaoAprovada: "O objetivo não é uma rotina perfeita. É tornar o dia mais previsível.",
      situacoesDeUso: [],
      instrucoesDeUso: [
        "Comece pequeno — escolha apenas uma rotina.",
        "Mostre o que vai acontecer — use imagens e poucas palavras.",
        "Dê tempo para aprender — repetição cria segurança.",
        "Celebre cada avanço — autonomia cresce passo a passo."
      ],
      camposParaObservar: [],
      informacoesParaCompartilhar: [],
      aviso: "Importante: adapte o material ao perfil, à idade e às necessidades da criança.",
      fonteDoConteudo: "imagem-final:bonus-01-guia-dos-pais/02-antes-de-comecar.png",
      fontesPorCampo: {
        titulo: "imagem-final:bonus-01-guia-dos-pais/02-antes-de-comecar.png",
        subtitulo: "imagem-final:bonus-01-guia-dos-pais/02-antes-de-comecar.png",
        descricaoAprovada: "imagem-final:bonus-01-guia-dos-pais/02-antes-de-comecar.png",
        instrucoesDeUso: "imagem-final:bonus-01-guia-dos-pais/02-antes-de-comecar.png",
        aviso: "imagem-final:bonus-01-guia-dos-pais/02-antes-de-comecar.png"
      }
    },
    {
      id: "cartoes-comunicacao-como-usar",
      titulo: "Como Usar os Cartões",
      subtitulo: null,
      categoria: ["Comunicação Visual"],
      tags: ["cartões", "comunicação", "casa", "escola", "passeio", "consulta"],
      faixaEtaria: null,
      arquivoVisual: "../../kit-planner-rotina-tea/finais/bonus-02-cartoes-comunicacao/02-como-usar.png",
      arquivoImpressao: "../../kit-planner-rotina-tea/output/pdf/Bonus-02-Cartoes-de-Comunicacao.pdf",
      produtoOrigem: "Bônus 2 — Cartões de Comunicação",
      descricaoAprovada: "Comunicar é participar.",
      situacoesDeUso: ["Casa", "Escola", "Passeio", "Consulta"],
      instrucoesDeUso: [
        "Mostre apenas os cartões necessários.",
        "Deixe-os ao alcance da criança.",
        "Modele: aponte e fale a palavra.",
        "Responda sempre que a criança usar."
      ],
      camposParaObservar: [],
      informacoesParaCompartilhar: [],
      aviso: "Aceite apontar, tocar, entregar ou olhar para o cartão como tentativa de comunicação.",
      fonteDoConteudo: "imagem-final:bonus-02-cartoes-comunicacao/02-como-usar.png",
      fontesPorCampo: {
        titulo: "imagem-final:bonus-02-cartoes-comunicacao/02-como-usar.png",
        descricaoAprovada: "imagem-final:bonus-02-cartoes-comunicacao/02-como-usar.png",
        situacoesDeUso: "imagem-final:bonus-02-cartoes-comunicacao/02-como-usar.png",
        instrucoesDeUso: "imagem-final:bonus-02-cartoes-comunicacao/02-como-usar.png",
        aviso: "imagem-final:bonus-02-cartoes-comunicacao/02-como-usar.png"
      }
    },
    {
      id: "primeiro-depois-como-usar",
      titulo: "Como Usar Quadro Primeiro → Depois",
      subtitulo: null,
      categoria: ["Primeiro e Depois"],
      tags: ["primeiro", "depois", "tarefas", "higiene", "transições", "pausas"],
      faixaEtaria: null,
      arquivoVisual: "../../kit-planner-rotina-tea/finais/bonus-03-primeiro-depois/02-como-usar.png",
      arquivoImpressao: "../../kit-planner-rotina-tea/output/pdf/Bonus-03-Quadro-Primeiro-Depois.pdf",
      produtoOrigem: "Bônus 3 — Quadro Primeiro → Depois",
      descricaoAprovada: "Clareza reduz a incerteza.",
      situacoesDeUso: ["Tarefas", "Higiene", "Transições", "Pausas"],
      instrucoesDeUso: [
        "Escolha uma atividade que precisa acontecer.",
        "Escolha o que acontecerá em seguida.",
        "Coloque um cartão em cada espaço.",
        "Mostre, fale pouco e cumpra a sequência."
      ],
      camposParaObservar: [],
      informacoesParaCompartilhar: [],
      aviso: "O DEPOIS deve ser possível e acontecer logo após o PRIMEIRO.",
      fonteDoConteudo: "imagem-final:bonus-03-primeiro-depois/02-como-usar.png",
      fontesPorCampo: {
        titulo: "imagem-final:bonus-03-primeiro-depois/02-como-usar.png",
        descricaoAprovada: "imagem-final:bonus-03-primeiro-depois/02-como-usar.png",
        situacoesDeUso: "imagem-final:bonus-03-primeiro-depois/02-como-usar.png",
        instrucoesDeUso: "imagem-final:bonus-03-primeiro-depois/02-como-usar.png",
        aviso: "imagem-final:bonus-03-primeiro-depois/02-como-usar.png"
      }
    },
    {
      id: "rotina-ambiente-passeio",
      titulo: "Rotina de Passeio",
      subtitulo: null,
      categoria: ["Rotinas por Ambiente", "Rotinas"],
      tags: ["passeio", "responsável", "pausa", "voltar para casa"],
      faixaEtaria: null,
      arquivoVisual: "../../kit-planner-rotina-tea/finais/bonus-04-rotina-ambientes/05-passeios.png",
      arquivoImpressao: "../../kit-planner-rotina-tea/output/pdf/Bonus-04-Rotina-por-Ambientes.pdf",
      produtoOrigem: "Bônus 4 — Rotina por Ambientes",
      descricaoAprovada: "Passear fica mais fácil quando eu sei a sequência.",
      situacoesDeUso: ["Passeio"],
      instrucoesDeUso: [
        "Preparar o que vou levar",
        "Sair de casa",
        "Chegar ao local",
        "Ficar perto do responsável",
        "Fazer uma pausa se precisar",
        "Voltar para casa"
      ],
      camposParaObservar: [],
      informacoesParaCompartilhar: [],
      aviso: null,
      fonteDoConteudo: "imagem-final:bonus-04-rotina-ambientes/05-passeios.png",
      fontesPorCampo: {
        titulo: "imagem-final:bonus-04-rotina-ambientes/05-passeios.png",
        descricaoAprovada: "imagem-final:bonus-04-rotina-ambientes/05-passeios.png",
        situacoesDeUso: "imagem-final:bonus-04-rotina-ambientes/05-passeios.png",
        instrucoesDeUso: "imagem-final:bonus-04-rotina-ambientes/05-passeios.png"
      }
    },
    {
      id: "calendario-visual-como-usar",
      titulo: "Como Usar o Calendário Visual",
      subtitulo: null,
      categoria: ["Calendário Visual"],
      tags: ["aniversários", "médicos", "passeios", "feriados", "viagens"],
      faixaEtaria: null,
      arquivoVisual: "../../kit-planner-rotina-tea/finais/bonus-05-calendario-visual/02-como-usar.png",
      arquivoImpressao: "../../kit-planner-rotina-tea/output/pdf/Bonus-05-Calendario-Visual.pdf",
      produtoOrigem: "Bônus 5 — Calendário Visual",
      descricaoAprovada: "Ver o tempo ajuda a compreender a espera.",
      situacoesDeUso: ["Aniversários", "Médicos", "Passeios", "Feriados", "Viagens"],
      instrucoesDeUso: [
        "Preencha o mês e as datas.",
        "Escolha os cartões dos eventos.",
        "Coloque cada cartão no dia correto.",
        "Revise o calendário todos os dias."
      ],
      camposParaObservar: [],
      informacoesParaCompartilhar: [],
      aviso: "Risque ou marque os dias que já passaram.",
      fonteDoConteudo: "imagem-final:bonus-05-calendario-visual/02-como-usar.png",
      fontesPorCampo: {
        titulo: "imagem-final:bonus-05-calendario-visual/02-como-usar.png",
        descricaoAprovada: "imagem-final:bonus-05-calendario-visual/02-como-usar.png",
        situacoesDeUso: "imagem-final:bonus-05-calendario-visual/02-como-usar.png",
        instrucoesDeUso: "imagem-final:bonus-05-calendario-visual/02-como-usar.png",
        aviso: "imagem-final:bonus-05-calendario-visual/02-como-usar.png"
      }
    }
  ]
};

await mkdir(outputRoot, { recursive: true });
await writeFile(path.join(outputRoot, "inventario-materiais.json"), `${JSON.stringify(inventory, null, 2)}\n`);
await writeFile(path.join(outputRoot, "recursos-piloto.json"), `${JSON.stringify(pilots, null, 2)}\n`);

console.log(JSON.stringify(inventory.totais));
