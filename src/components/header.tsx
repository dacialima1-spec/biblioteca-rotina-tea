"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Heart, Home, NotebookTabs } from "lucide-react";

const links = [
  { href: "/", label: "Início", icon: Home },
  { href: "/biblioteca", label: "Biblioteca", icon: BookOpen },
  { href: "/favoritos", label: "Favoritos", icon: Heart },
  { href: "/registros", label: "Meus registros", icon: NotebookTabs }
];

export function Header() {
  const pathname = usePathname();
  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Biblioteca Rotina TEA — início">
          <span className="brand-star">★</span>
          <span><b>Biblioteca</b><small>Rotina TEA</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={pathname === href ? "active" : ""}>
              <Icon size={18} aria-hidden="true" />{label}
            </Link>
          ))}
        </nav>
      </header>
      <nav className="mobile-nav" aria-label="Navegação principal para celular">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={pathname === href ? "active" : ""}>
            <Icon size={21} aria-hidden="true" /><span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
