"use client";

import { Heart } from "lucide-react";
import { ResourceGrid } from "@/components/resource-grid";
import { usePreferences } from "@/hooks/use-preferences";
import { resources } from "@/lib/resources";

export default function FavoritesPage() {
  const { favorites } = usePreferences();
  const selected = favorites.map((id) => resources.find((resource) => resource.id === id)).filter(Boolean) as typeof resources;
  return (
    <div className="page-shell subpage">
      <div className="page-title pink"><span><Heart /></span><div><p>Seus materiais preferidos</p><h1>Favoritos</h1></div></div>
      <ResourceGrid resources={selected} empty="Você ainda não adicionou recursos aos favoritos." />
    </div>
  );
}
