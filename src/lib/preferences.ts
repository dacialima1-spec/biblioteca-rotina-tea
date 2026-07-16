"use client";

const FAVORITES_KEY = "rotina-tea:favorites";
const RECENTS_KEY = "rotina-tea:recents";
const EVENT_NAME = "rotina-tea:preferences";

function read(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function write(key: string, value: string[]) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(EVENT_NAME));
}

export const preferences = {
  eventName: EVENT_NAME,
  favorites: () => read(FAVORITES_KEY),
  recents: () => read(RECENTS_KEY),
  toggleFavorite(id: string) {
    const current = read(FAVORITES_KEY);
    write(FAVORITES_KEY, current.includes(id) ? current.filter((item) => item !== id) : [id, ...current]);
  },
  addRecent(id: string) {
    write(RECENTS_KEY, [id, ...read(RECENTS_KEY).filter((item) => item !== id)].slice(0, 8));
  }
};
