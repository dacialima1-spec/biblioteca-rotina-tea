"use client";

import { Heart } from "lucide-react";
import { usePreferences } from "@/hooks/use-preferences";

export function FavoriteButton({ id, compact = false }: { id: string; compact?: boolean }) {
  const { favorites, toggleFavorite } = usePreferences();
  const active = favorites.includes(id);
  return (
    <button
      type="button"
      className={`favorite-button ${active ? "active" : ""} ${compact ? "compact" : ""}`}
      aria-pressed={active}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      onClick={(event) => { event.preventDefault(); toggleFavorite(id); }}
    >
      <Heart fill={active ? "currentColor" : "none"} aria-hidden="true" />
      {!compact && (active ? "Favoritado" : "Favoritar")}
    </button>
  );
}
