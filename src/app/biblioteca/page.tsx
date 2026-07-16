"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Filter, LibraryBig, RotateCcw } from "lucide-react";
import { ResourceGrid } from "@/components/resource-grid";
import { SearchBox } from "@/components/search-box";
import { usePreferences } from "@/hooks/use-preferences";
import { resources, searchResources } from "@/lib/resources";
import { categories } from "@/types/resource";

function LibraryContent() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("categoria") ?? "");
  const [situation, setSituation] = useState("");
  const [origin, setOrigin] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [onlyRecent, setOnlyRecent] = useState(false);
  const { favorites, recents } = usePreferences();

  const situations = [...new Set(resources.flatMap((resource) => resource.situacoesDeUso))].sort();
  const origins = [...new Set(resources.map((resource) => resource.produtoOrigem))].sort();
  const filtered = searchResources(query).filter((resource) =>
    (!category || resource.categoria.includes(category as never)) &&
    (!situation || resource.situacoesDeUso.includes(situation)) &&
    (!origin || resource.produtoOrigem === origin) &&
    (!onlyFavorites || favorites.includes(resource.id)) &&
    (!onlyRecent || recents.includes(resource.id))
  );

  const clear = () => { setQuery(""); setCategory(""); setSituation(""); setOrigin(""); setOnlyFavorites(false); setOnlyRecent(false); };

  return (
    <div className="page-shell library-page">
      <div className="page-title"><span><LibraryBig /></span><div><p>Encontre o material certo</p><h1>Biblioteca de recursos</h1></div></div>
      <SearchBox value={query} onChange={setQuery} />
      <div className="library-layout">
        <aside className="filter-panel">
          <h2><Filter size={19} /> Filtros</h2>
          <label>Categoria<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Todas</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Situação<select value={situation} onChange={(event) => setSituation(event.target.value)}><option value="">Todas</option>{situations.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Faixa etária<select disabled><option>Informação não cadastrada.</option></select></label>
          <label>Produto ou bônus<select value={origin} onChange={(event) => setOrigin(event.target.value)}><option value="">Todos</option>{origins.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="check-label"><input type="checkbox" checked={onlyFavorites} onChange={(event) => setOnlyFavorites(event.target.checked)} /> Somente favoritos</label>
          <label className="check-label"><input type="checkbox" checked={onlyRecent} onChange={(event) => setOnlyRecent(event.target.checked)} /> Usados recentemente</label>
          <button className="clear-button" onClick={clear}><RotateCcw size={16} /> Limpar filtros</button>
        </aside>
        <section className="library-results"><div className="results-heading"><h2>{filtered.length} {filtered.length === 1 ? "recurso encontrado" : "recursos encontrados"}</h2><span>Conteúdo piloto aprovado</span></div><ResourceGrid resources={filtered} /></section>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  return <Suspense fallback={<div className="page-shell"><p>Carregando biblioteca…</p></div>}><LibraryContent /></Suspense>;
}
