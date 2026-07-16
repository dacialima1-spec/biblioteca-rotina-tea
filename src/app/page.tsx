"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, Heart, MessageCircle, Route, Sparkles } from "lucide-react";
import { SearchBox } from "@/components/search-box";
import { ResourceGrid } from "@/components/resource-grid";
import { usePreferences } from "@/hooks/use-preferences";
import { resources } from "@/lib/resources";
import { categories } from "@/types/resource";

const categoryMeta: Record<string, { icon: typeof Route; color: string }> = {
  "Rotinas": { icon: Route, color: "orange" },
  "Escola": { icon: BookOpen, color: "blue" },
  "Comunicação Visual": { icon: MessageCircle, color: "purple" },
  "Emoções e Autorregulação": { icon: Heart, color: "pink" },
  "Missões e Recompensas": { icon: Sparkles, color: "yellow" },
  "Primeiro e Depois": { icon: ArrowRight, color: "green" },
  "Rotinas por Ambiente": { icon: Route, color: "turquoise" },
  "Calendário Visual": { icon: CalendarDays, color: "blue" },
  "Guia dos Pais": { icon: BookOpen, color: "orange" },
  "Acompanhamento": { icon: Sparkles, color: "purple" }
};

export default function HomePage() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { favorites, recents } = usePreferences();
  const favoriteResources = favorites.map((id) => resources.find((item) => item.id === id)).filter(Boolean).slice(0, 3) as typeof resources;
  const recentResources = recents.map((id) => resources.find((item) => item.id === id)).filter(Boolean).slice(0, 3) as typeof resources;

  const submitSearch = () => router.push(`/biblioteca?q=${encodeURIComponent(query)}`);

  return (
    <div className="page-shell home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">★ Sua rotina visual em um só lugar</span>
          <h1><span>Biblioteca</span> Rotina TEA</h1>
          <p>Tudo o que você precisa para organizar, apoiar e acompanhar.</p>
          <h2>O que você precisa organizar hoje?</h2>
          <SearchBox value={query} onChange={setQuery} onSubmit={submitSearch} />
          <div className="hero-actions">
            <Link className="primary-button" href="/biblioteca">Ver toda a biblioteca <ArrowRight size={19} /></Link>
            <Link className="secondary-button" href="/registros">Meus registros</Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-preview"><Image src={resources[0].arquivoVisual} alt="" fill priority sizes="360px" /></div>
          <Image className="hero-mascot" src="/personagens/nino.svg" width={210} height={245} alt="" />
          <span className="float-star star-one">★</span><span className="float-star star-two">★</span>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span>Explore</span><h2>Categorias</h2></div><Link href="/biblioteca">Ver todas <ArrowRight size={17} /></Link></div>
        <div className="category-grid">
          {categories.map((category) => {
            const meta = categoryMeta[category];
            const Icon = meta.icon;
            const count = resources.filter((resource) => resource.categoria.includes(category)).length;
            return (
              <Link key={category} href={`/biblioteca?categoria=${encodeURIComponent(category)}`} className={`category-card ${meta.color}`}>
                <span className="category-icon"><Icon aria-hidden="true" /></span>
                <strong>{category}</strong><small>{count} {count === 1 ? "recurso" : "recursos"}</small>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span>Para começar</span><h2>Recursos em destaque</h2></div></div>
        <ResourceGrid resources={resources.slice(0, 3)} />
      </section>

      <section className="section-block two-sections">
        <div><div className="section-heading compact"><div><span>Volte rápido</span><h2>Recentes</h2></div></div><ResourceGrid resources={recentResources} empty="Seus recursos abertos recentemente aparecerão aqui." /></div>
        <div><div className="section-heading compact"><div><span>Guarde os preferidos</span><h2>Favoritos</h2></div></div><ResourceGrid resources={favoriteResources} empty="Toque no coração de um recurso para encontrá-lo aqui." /></div>
      </section>

      <section className="start-steps">
        <div><span>1</span><strong>Encontre</strong><p>Busque por título, categoria ou situação cadastrada.</p></div>
        <div><span>2</span><strong>Use</strong><p>Visualize as instruções aprovadas e o material imprimível.</p></div>
        <div><span>3</span><strong>Registre</strong><p>Salve informações factuais no seu dispositivo.</p></div>
      </section>
    </div>
  );
}
