export const categories = [
  "Rotinas",
  "Escola",
  "Comunicação Visual",
  "Emoções e Autorregulação",
  "Missões e Recompensas",
  "Primeiro e Depois",
  "Rotinas por Ambiente",
  "Calendário Visual",
  "Guia dos Pais",
  "Acompanhamento"
] as const;

export type Category = (typeof categories)[number];

export type Resource = {
  id: string;
  titulo: string;
  subtitulo: string | null;
  categoria: Category[];
  tags: string[];
  faixaEtaria: string | null;
  arquivoVisual: string;
  arquivoImpressao: string;
  produtoOrigem: string;
  descricaoAprovada: string | null;
  situacoesDeUso: string[];
  instrucoesDeUso: string[];
  camposParaObservar: string[];
  informacoesParaCompartilhar: string[];
  aviso: string | null;
  fonteDoConteudo: string;
  fontesPorCampo: Record<string, string>;
};

export type UsageStatus = "sozinho" | "com-ajuda" | "nao-concluiu";

export type UsageRecord = {
  id: string;
  createdAt: string;
  data: string;
  horario: string;
  local: string;
  recursoId: string;
  recursoTitulo: string;
  atividadeProposta: string;
  status: UsageStatus;
  tipoAjuda: string;
  duracaoAproximada: string;
  mudancasRotina: string;
  observacaoResponsaveis: string;
  emocaoInformada: string;
  proximaTentativa: string;
  duvidasProfissional: string;
};
