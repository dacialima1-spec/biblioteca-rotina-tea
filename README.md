# Biblioteca Rotina TEA

Aplicação web responsiva para organizar, consultar e registrar a utilização dos recursos aprovados do Kit Planner Rotina TEA.

## Acervo concluído

Esta versão reúne os 67 recursos visuais inventariados e os 7 PDFs finais. Cinco recursos possuem conteúdo detalhado aprovado:

1. Antes de Começar.
2. Como Usar os Cartões.
3. Como Usar Quadro Primeiro → Depois.
4. Rotina de Passeio.
5. Como Usar o Calendário Visual.

Os outros 62 recursos estão disponíveis para busca, visualização, download, impressão, favoritos e registros. Seus campos editoriais não comprovados permanecem nulos e a interface exibe “Informação não cadastrada.”

## Executar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Verificar

```bash
npm run validate:content
npm run typecheck
npm test
npm run build
```

## Armazenamento

- Conteúdo aprovado: JSON estático em `content/`.
- Favoritos e recentes: `localStorage`.
- Registros de utilização: IndexedDB no dispositivo.
- Resumo para profissional: PDF gerado no navegador.
- Sem login e sem sincronização externa nesta versão.

## Migração futura para Supabase

Criar tabelas `resources`, `resource_sources`, `profiles`, `favorites` e `usage_records`, preservando os IDs atuais, a versão do schema e a origem de cada texto. A migração deve ser opt-in e não pode promover conteúdo sem fonte.

## Regra de conteúdo

Nenhum texto clínico, interpretação, diagnóstico, sugestão de tratamento ou conclusão automática é gerado. Campos sem conteúdo aprovado exibem “Informação não cadastrada.”
