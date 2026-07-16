import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Biblioteca Rotina TEA",
    short_name: "Rotina TEA",
    description: "Recursos visuais organizados para consultar, imprimir e registrar utilizações.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf0",
    theme_color: "#ff5a1f",
    lang: "pt-BR",
    icons: [{ src: "/personagens/nino.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }]
  };
}
