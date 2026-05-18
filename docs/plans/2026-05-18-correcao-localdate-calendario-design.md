# Design: Correção de deslocamento de data no calendário mensal

Data: 2026-05-18
Status: Aprovado

## Contexto
Ao adicionar uma atividade com prazo em um dia específico (ex.: dia 2), o calendário mensal exibe no dia anterior (ex.: dia 1). O problema ocorre apenas no calendário mensal.

O backend usa `LocalDate` para `prazo` e envia string no formato `YYYY-MM-DD`.

## Causa raiz
No frontend, existem usos de `new Date(atividade.prazo)` para valores `YYYY-MM-DD`.

Em JavaScript, esse parse tende a ser interpretado em UTC; ao converter para fuso local (ex.: UTC-3), pode ocorrer deslocamento para o dia anterior.

## Objetivo
Padronizar o tratamento de datas `LocalDate` no frontend para eliminar deslocamentos por timezone e evitar regressões futuras.

## Abordagens consideradas
1. Correção pontual no calendário
- Prós: rápida.
- Contras: mantém risco em outras telas.

2. Padronização de `LocalDate` no frontend (recomendada)
- Prós: solução robusta e reutilizável.
- Contras: toca mais arquivos.

3. Alteração de contrato da API para datetime com timezone
- Prós: explicita timezone na origem.
- Contras: impacto maior em contrato e clientes.

## Decisão
Adotar abordagem 2: criar utilitário central para `LocalDate` e substituir parses diretos em componentes do frontend.

## Arquitetura proposta
Criar `frontend/src/lib/localDate.ts` com helpers:
- `parseLocalDate(dateStr: string): Date | null`
- `localDateKey(dateStr: string): string | null`
- `formatLocalDatePtBr(dateStr: string): string`

Regras:
- Não usar `new Date("YYYY-MM-DD")` para campos de `LocalDate`.
- Comparações de dia devem usar `localDateKey`.
- Formatação de `prazo` deve usar helper dedicado.

## Componentes e escopo
1. Calendário mensal
- Atualizar filtros/comparações em componentes como `CalendarGrid`, `DayTooltip`, `DayDetailModal` para remover parse UTC implícito.

2. Listagens de atividades
- Atualizar formatação de data em `Atividades`, `AdminAtividades`, `AdminProvas` para usar helper de `LocalDate`.

3. Formulários de criação
- Manter envio em string `YYYY-MM-DD` (já compatível com backend).

## Fluxo de dados
1. Usuário seleciona data no `input[type=date]`.
2. Frontend envia `prazo` como `YYYY-MM-DD`.
3. Backend persiste `LocalDate` e retorna string `YYYY-MM-DD`.
4. Frontend compara/formata somente via utilitários `LocalDate` (sem parse UTC implícito).

## Tratamento de erros
- Se data vier inválida, helpers retornam fallback seguro (`null`/string original) sem quebrar renderização.
- No calendário, itens com data inválida não entram na célula por dia.
- `console.warn` apenas em ambiente de desenvolvimento para diagnóstico.

## Testes e critérios de sucesso
1. Criar atividade com prazo no dia 2 e validar presença no dia 2 do calendário mensal.
2. Validar listagens (`Atividades`, `AdminAtividades`, `AdminProvas`) exibindo a data correta.
3. Navegar entre meses e confirmar ausência de deslocamentos.
4. Garantir ausência de uso de `new Date(<LocalDate>)` para `prazo`.

## Fora de escopo
- Mudança de contrato da API.
- Refatorações amplas de datas não relacionadas a campos `LocalDate`.
