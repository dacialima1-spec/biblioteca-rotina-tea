import raw from "../../content/recursos-completos.json";
import type { Category, Resource } from "@/types/resource";

export const resources: Resource[] = raw.recursos.map((resource) => ({
  ...resource,
  categoria: resource.categoria as Category[],
  fontesPorCampo: resource.fontesPorCampo as unknown as Record<string, string>
}));

export const fallbackText = raw.fallbackDeInterface;

export function getResource(id: string) {
  return resources.find((resource) => resource.id === id);
}

export function searchResources(query: string, source = resources) {
  const term = query.trim().toLocaleLowerCase("pt-BR");
  if (!term) return source;
  return source.filter((resource) => {
    const approvedSearchFields = [
      resource.titulo,
      resource.descricaoAprovada ?? "",
      ...resource.tags,
      ...resource.categoria,
      ...resource.situacoesDeUso
    ];
    return approvedSearchFields.some((value) => value.toLocaleLowerCase("pt-BR").includes(term));
  });
}
