import type { Resource } from "@/types/resource";
import { ResourceCard } from "./resource-card";

export function ResourceGrid({ resources, empty = "Nenhum recurso encontrado." }: { resources: Resource[]; empty?: string }) {
  if (!resources.length) return <div className="empty-state"><span>☆</span><p>{empty}</p></div>;
  return <div className="resource-grid">{resources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}</div>;
}
