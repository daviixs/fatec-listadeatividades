# Design: Centralizacao da Sala com Site Web e Votacao de Cancelamento

**Data:** 2026-03-09  
**Status:** Aprovado

## 1. Objetivo

Construir um site web para centralizar as informacoes da turma (materias e atividades) e permitir votacao de cancelamento de atividade pelos alunos.

Meta principal: ajudar os alunos a acompanhar tudo em um unico lugar.

## 2. Escopo do MVP

- Site web com duas areas: `Aluno` e `Lider`.
- Lider cadastra alunos da sala (`RM + nome`) e gerencia atividades.
- Aluno entra com `codigo da sala + RM + nome`.
- Aluno so pode votar apos aprovacao manual do lider.
- Participantes aprovados podem votar se atividade deve ser cancelada.
- Regra de cancelamento: atividade e cancelada quando votos `SIM` atingirem `80%` do total de alunos cadastrados na sala.
- Janela de votacao: `12 horas`.

## 3. Abordagem Escolhida

### Opcao escolhida: MVP focado em centralizacao

Razao: menor complexidade para entregar valor rapido e com menor risco, aproveitando o backend Spring Boot ja existente.

## 4. Arquitetura

### Frontend

- Area do Aluno:
  - entrada na sala;
  - consulta de materias e atividades;
  - votacao quando liberado.
- Painel do Lider:
  - cadastro de alunos;
  - aprovacao de entradas;
  - gestao de atividades;
  - abertura de votacao.

### Backend (Spring Boot)

- Reaproveitar entidades e APIs existentes de `Sala`, `Materia` e `Atividade`.
- Adicionar fluxos de aprovacao de entrada e votacao de cancelamento.

### Banco de dados (novas estruturas)

- `Aluno`: `id`, `sala_id`, `rm`, `nome`.
- `EntradaSala`: `id`, `sala_id`, `aluno_id`, `status (PENDENTE|APROVADO|REJEITADO)`, `criado_em`, `atualizado_em`.
- `VotacaoCancelamento`: `id`, `atividade_id`, `iniciada_em`, `encerra_em`, `status (ABERTA|ENCERRADA)`.
- `Voto`: `id`, `votacao_id`, `aluno_id`, `opcao (SIM|NAO)`, `votado_em`.

Restricao importante:
- Unicidade de voto por aluno em cada votacao (`UNIQUE(votacao_id, aluno_id)`).

## 5. Componentes e Fluxo

### 5.1 Fluxo do aluno

1. Aluno informa `codigo`, `RM` e `nome`.
2. Sistema valida se o aluno esta na lista cadastrada do lider.
3. Sistema cria/atualiza entrada como `PENDENTE`.
4. Aluno aguarda aprovacao do lider.
5. Com status `APROVADO`, aluno pode votar.

### 5.2 Fluxo do lider

1. Lider cadastra alunos (`RM + nome`) da sala.
2. Lider aprova/rejeita entradas pendentes.
3. Lider cria/edita atividades.
4. Lider abre votacao de cancelamento por atividade.

### 5.3 Fluxo da votacao

1. Ao abrir, sistema define `encerra_em = iniciada_em + 12h`.
2. Apenas aluno aprovado vota.
3. Cada aluno vota uma vez.
4. A cada voto `SIM`, sistema recalcula condicao de cancelamento.
5. Se condicao atingir a meta, atividade muda para `CANCELADA` imediatamente.
6. Se encerrar prazo sem meta, atividade permanece ativa e votacao encerra.

## 6. Regra de Negocio Principal

Cancelamento e calculado sobre o total de alunos cadastrados na sala, nao sobre o total de votantes.

- `meta_cancelamento = ceil(0.8 * total_alunos_sala)`
- Se `votos_sim >= meta_cancelamento`, atividade recebe status `CANCELADA`.

## 7. Fluxo de Dados

### Entrada na sala

- Request: `codigo + RM + nome`
- Validacoes:
  - sala existe;
  - aluno existe na lista cadastrada pelo lider.
- Resultado:
  - `EntradaSala` criada/atualizada como `PENDENTE`.

### Aprovacao

- Lider consulta pendentes por sala.
- Acao:
  - aprovar -> libera voto;
  - rejeitar -> bloqueia voto.

### Voto

- Requisitos:
  - aluno aprovado;
  - votacao aberta;
  - voto unico por aluno.
- Apos gravar voto:
  - recalcular votos `SIM`;
  - aplicar regra de cancelamento.

## 8. Tratamento de Erros

- Codigo de sala inexistente -> `404`.
- `RM + nome` nao cadastrados -> `403`.
- Aluno nao aprovado tentando votar -> `403`.
- Votacao encerrada -> `409`.
- Voto duplicado -> `409`.
- Votacao em atividade ja cancelada -> `400`.
- Aprovar aluno fora da sala -> `400`.
- Abrir votacao quando ja existe votacao aberta para atividade -> `409`.

Padrao de erro sugerido:
- `timestamp`, `status`, `codigo`, `mensagem`, `detalhes`.

## 9. Testes

### Backend

- Regra de cancelamento com base em `80%` do total de alunos da sala.
- Cancelamento imediato ao atingir meta.
- Encerramento sem cancelamento quando meta nao for atingida em 12h.
- Bloqueio para aluno nao aprovado.
- Bloqueio para aluno fora da lista.
- Bloqueio de voto duplicado.

### API

- Contrato de status HTTP e payload de erro.
- Transicoes de estado:
  - `PENDENTE -> APROVADO`
  - `ATIVA -> CANCELADA`

### Frontend

- Fluxo de entrada pendente/aprovado/rejeitado.
- Fluxo de voto liberado apos aprovacao.
- Exibicao de status de atividade e votacao.

### Teste manual de aceitacao

1. Criar sala, cadastrar alunos e atividade.
2. Simular entradas pendentes.
3. Aprovar alunos.
4. Abrir votacao.
5. Registrar votos ate atingir 80%.
6. Confirmar atividade cancelada automaticamente.

