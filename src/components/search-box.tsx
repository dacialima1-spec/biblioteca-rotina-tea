"use client";

import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
};

export function SearchBox({ value, onChange, onSubmit, placeholder = "Buscar por título, categoria ou situação" }: Props) {
  return (
    <form className="search-box" onSubmit={(event) => { event.preventDefault(); onSubmit?.(); }} role="search">
      <Search aria-hidden="true" />
      <label className="sr-only" htmlFor="global-search">Buscar recursos</label>
      <input
        id="global-search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      <button type="submit">Buscar</button>
    </form>
  );
}
