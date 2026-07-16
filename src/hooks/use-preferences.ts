"use client";

import { useCallback, useEffect, useState } from "react";
import { preferences } from "@/lib/preferences";

export function usePreferences() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);

  const refresh = useCallback(() => {
    setFavorites(preferences.favorites());
    setRecents(preferences.recents());
  }, []);

  useEffect(() => {
    const hydration = window.setTimeout(refresh, 0);
    window.addEventListener(preferences.eventName, refresh);
    return () => {
      window.clearTimeout(hydration);
      window.removeEventListener(preferences.eventName, refresh);
    };
  }, [refresh]);

  return {
    favorites,
    recents,
    toggleFavorite: preferences.toggleFavorite,
    addRecent: preferences.addRecent
  };
}
