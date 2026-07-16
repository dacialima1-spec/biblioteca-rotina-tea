import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Resource } from "@/types/resource";
import { fallbackText } from "@/lib/resources";
import { FavoriteButton } from "./favorite-button";

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="resource-card">
      <div className="resource-thumbnail">
        <Image src={resource.arquivoVisual} alt={`Miniatura do recurso ${resource.titulo}`} fill sizes="(max-width: 700px) 88vw, 320px" />
        <FavoriteButton id={resource.id} compact />
      </div>
      <div className="resource-card-body">
        <div className="chip-row">
          {resource.categoria.slice(0, 2).map((category) => <span className="chip" key={category}>{category}</span>)}
        </div>
        <h3>{resource.titulo}</h3>
        <p>{resource.descricaoAprovada ?? fallbackText}</p>
        <div className="tag-row" aria-label="Tags">
          {resource.tags.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}
        </div>
        <Link href={`/recurso/${resource.id}`} className="card-link">
          Abrir recurso <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
