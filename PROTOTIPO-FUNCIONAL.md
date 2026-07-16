# Biblioteca Rotina TEA — Protótipo funcional

## Escopo implementado

- Home com busca, categorias, destaques, recentes e favoritos.
- Biblioteca com busca local e filtros permitidos.
- Cinco páginas individuais de recursos aprovados.
- Visualização, download, abertura para impressão e favoritos.
- Formulário completo de registro de utilização.
- Registros persistidos em IndexedDB no dispositivo.
- Painel com contagens e distribuição descritiva.
- Histórico com exclusão mediante confirmação.
- PDF “Resumo de Rotina e Observações”, sem conclusões automáticas.
- Navegação responsiva para computador e celular.
- Manifesto e service worker para PWA.

## Conteúdo incluído

1. Antes de Começar.
2. Como Usar os Cartões.
3. Como Usar Quadro Primeiro → Depois.
4. Rotina de Passeio.
5. Como Usar o Calendário Visual.

Campos sem conteúdo aprovado exibem “Informação não cadastrada.” Os outros 62 recursos permanecem apenas inventariados.

## Validação

- Schema e fontes: aprovados.
- ESLint: aprovado.
- TypeScript: aprovado.
- Testes anti-invenção: 3 aprovados.
- Build Next.js: aprovado.
- Smoke test: páginas, imagens e PDFs aprovados.

## Executar

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.
