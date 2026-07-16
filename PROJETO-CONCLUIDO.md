# Biblioteca Rotina TEA — Projeto concluído

## Acervo

- 67 recursos visuais disponíveis.
- 7 PDFs imprimíveis associados.
- 10 categorias aprovadas.
- 5 recursos com descrição e instruções detalhadas aprovadas.
- 62 recursos com campos ausentes preservados, sem conteúdo inventado.

## Funcionalidades

- Home com busca, categorias, favoritos e recentes.
- Biblioteca completa em cards.
- Filtros por categoria, situação, origem, favoritos e recentes.
- Página individual para cada um dos 67 recursos.
- Visualização da arte, download e impressão do PDF associado.
- Favoritos e histórico recente salvos no navegador.
- Registro factual de utilização em IndexedDB.
- Painel com contagens descritivas.
- Histórico por data.
- PDF “Resumo de Rotina e Observações”.
- Layout responsivo e suporte a PWA.

## Proteções de conteúdo

- Todo recurso possui fonte principal.
- Todo texto preenchido possui fonte por campo.
- Campos ausentes permanecem `null` ou `[]`.
- A interface não resume, completa ou interpreta o conteúdo.
- Busca utiliza somente título, tags, categoria, situações e descrição aprovados.
- Registros não geram pontuação, diagnóstico ou recomendação.
- O resumo em PDF não apresenta conclusão automática.

## Execução local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.
