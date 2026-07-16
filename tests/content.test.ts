import { describe, expect, it } from "vitest";
import payload from "../content/recursos-completos.json";

const contentFields = ["titulo", "subtitulo", "descricaoAprovada", "situacoesDeUso", "instrucoesDeUso", "camposParaObservar", "informacoesParaCompartilhar", "aviso"] as const;
const prohibited = ["diagnóstico", "evolução clínica", "eficácia", "gravidade", "prognóstico", "tratamento", "nível de sintomas"];

function hasContent(value: unknown) {
  return Array.isArray(value) ? value.length > 0 : typeof value === "string" && value.trim().length > 0;
}

describe("conteúdo aprovado", () => {
  it("contém os 67 recursos inventariados sem duplicação", () => {
    expect(payload.recursos).toHaveLength(67);
    expect(new Set(payload.recursos.map((resource) => resource.id)).size).toBe(67);
  });

  it("mantém cinco pilotos com instruções completas", () => {
    expect(payload.recursos.filter((resource) => resource.instrucoesDeUso.length > 0)).toHaveLength(5);
  });

  it("exige fonte para cada campo textual preenchido", () => {
    for (const resource of payload.recursos) {
      expect(resource.fonteDoConteudo.length).toBeGreaterThan(0);
      const sources = resource.fontesPorCampo as Record<string, string | undefined>;
      for (const field of contentFields) {
        if (hasContent(resource[field])) expect(sources[field]).toBeTruthy();
      }
    }
  });

  it("não contém campos clínicos proibidos", () => {
    const serialized = JSON.stringify(payload).toLocaleLowerCase("pt-BR");
    for (const term of prohibited) expect(serialized).not.toContain(`\"${term}\":`);
  });

  it("preserva lacunas sem preenchimento automático", () => {
    const pending = payload.recursos.filter((resource) => resource.instrucoesDeUso.length === 0);
    expect(pending).toHaveLength(62);
    expect(pending.every((resource) => resource.descricaoAprovada === null)).toBe(true);
  });
});
