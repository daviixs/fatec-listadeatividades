# Design: Contrato da API do Calendario em Producao

**Data:** 2026-04-22
**Status:** Aprovado
**Autor:** Assistente AI

## Resumo

O frontend do calendario quebra com `TypeError: e.filter is not a function` porque espera arrays em respostas como `GET /api/salas` e `GET /api/salas/{id}/calendario`, mas em producao foi observado retorno invalido para esse contrato.

## Sintoma

- O frontend chama `studentApi.getSalas()` e depois executa `salas.filter(...)`.
- Em producao, a chamada para `/api/salas` nao retorna um array valido.
- O erro final aparece no bundle minificado como falha em `filter`.

## Hipoteses Consideradas

### 1. Contrato HTTP invalido no backend

O endpoint responde com payload vazio ou estrutura inesperada. Essa e a causa imediata do erro no frontend.

### 2. Cache Redis em producao

Os endpoints publicos de salas e calendario usam `@Cacheable`. Como a aplicacao estava configurada para Redis por padrao, o ambiente de producao pode servir payload cacheado, inconsistente ou serializado de forma inesperada.

### 3. Falta de validacao no frontend

O cliente assume que qualquer `200 OK` contem o shape esperado. Isso transforma um problema de contrato em um crash de runtime.

## Abordagens

### Abordagem A: Corrigir apenas o frontend

Adicionar `Array.isArray(...)` e validacao de shape no cliente.

**Vantagens**
- Remove o crash.
- Facil de aplicar.

**Desvantagens**
- Nao corrige a origem do contrato invalido.

### Abordagem B: Corrigir apenas o backend

Blindar cache/serializacao e adicionar testes HTTP de contrato.

**Vantagens**
- Corrige a origem do problema.
- Garante payload consistente.

**Desvantagens**
- Se o problema reaparecer por infra ou cache antigo, o frontend continua fragil.

### Abordagem C: Corrigir backend e frontend

Validar o contrato no cliente, adicionar testes HTTP no backend e tornar Redis opt-in em vez de padrao.

**Vantagens**
- Corrige a causa mais provavel.
- Evita crash no cliente em caso de regressao.
- Aumenta confiabilidade do deploy.

**Desvantagens**
- Pequena perda de cache distribuido quando Redis nao estiver explicitamente habilitado.

## Recomendacao

Seguir a **Abordagem C**.

## Design da Correcao

### Backend

- Tornar Redis explicito, nao implicito.
- Manter cache simples como fallback seguro.
- Adicionar testes HTTP para:
  - `GET /api/salas` responder com array JSON.
  - `GET /api/salas/{id}/calendario` responder com objeto contendo `materias` e `atividades` como arrays JSON.

### Frontend

- Validar o shape das respostas em `studentApi`.
- Lancar erro explicito quando a API devolver payload invalido.
- Exibir mensagem amigavel em vez de deixar o React quebrar ao chamar `.filter`.

## Sucesso Esperado

- O calendario nao deve mais quebrar com `filter is not a function`.
- O frontend deve mostrar erro claro quando o backend responder contrato invalido.
- O backend deve ter cobertura automatica para esse contrato.
