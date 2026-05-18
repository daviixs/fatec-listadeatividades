# Design: Correção de exibição da matéria no select de criação de atividade

Data: 2026-05-18
Status: Aprovado

## Contexto
No fluxo de criação de atividade/prova/trabalho, ao selecionar a matéria, o campo fechado do select exibe o ID (ex.: `3`) em vez do nome da matéria. A lista expandida mostra os nomes corretamente.

## Problema
O valor interno do select usa `materiaId` (string do número) para envio de payload, mas o componente de valor selecionado está renderizando o valor bruto ao fechar, não o rótulo esperado.

## Objetivo
Manter o payload correto com `materiaId` e corrigir a exibição para mostrar `materia.nome` no campo fechado após seleção.

## Abordagens consideradas
1. Correção pontual no modal de criação (recomendada)
- Renderizar no `SelectValue` o nome da matéria selecionada (`id -> nome`).
- Prós: baixo risco, rápida, escopo mínimo.
- Contras: não generaliza para outros selects automaticamente.

2. Evolução global do componente base `Select`
- Alterar `frontend/src/components/ui/select.tsx` para mapear valor para label.
- Prós: solução sistêmica.
- Contras: risco de regressão em toda a UI.

3. Trocar valor interno para nome e converter no submit
- Prós: mostra nome nativamente.
- Contras: aumenta complexidade, risco com nomes duplicados.

## Decisão
Aplicar abordagem 1 (YAGNI): corrigir somente o fluxo de criação, preservando contrato atual de API.

## Arquitetura proposta
No modal de criação:
- estado continua guardando `form.materiaId`.
- criar resolução local `selectedMateriaName` via busca de `materias` por `id`.
- `SelectValue` mostra `selectedMateriaName` quando existir, senão placeholder.

## Componentes afetados
- `frontend/src/components/calendario/AddActivityModal.tsx`

Sem alterações em:
- API (`studentApi.criarAtividade`)
- Backend
- Componente base `Select`

## Fluxo de dados
1. Usuário seleciona matéria na lista (item tem value `materia.id.toString()`).
2. Estado salva `form.materiaId` como número.
3. UI resolve `id -> nome` e exibe no campo fechado.
4. Submit envia `materiaId` numérico para backend.

## Tratamento de erros e compatibilidade
- Se `materias` não estiver carregado ou `id` inválido: fallback para placeholder.
- Mantém pré-seleção atual por `materiaSelecionada` quando existir.
- Sem mudança de layout, apenas texto exibido.

## Testes e critérios de sucesso
1. Selecionar matéria no modal e confirmar exibição do nome (não ID).
2. Criar atividade e confirmar envio/salvamento normal.
3. Garantir que o fluxo de atividade/prova/trabalho não mostre ID após seleção.

## Fora de escopo
- Refatoração global do componente `Select`.
- Mudança no contrato da API.
