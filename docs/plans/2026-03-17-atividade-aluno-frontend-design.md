# Design: criação de atividade por aluno no frontend

Data: 2026-03-17  
Status: Aprovado

## 1. Contexto

Na rota pública de atividades (`/:courseId/:periodId/:semesterId/:subjectId/atividades`), o frontend atual usa dados estáticos de `courses.ts` e não integra com os endpoints reais de atividades.

Impacto observado:
- Aluno não consegue criar atividade no endpoint de atividades.
- A lista exibida não reflete dados reais da sala/matéria no backend.

## 2. Objetivo

Corrigir o frontend para:
- permitir que aluno crie atividade via API;
- garantir que a criação ocorra **na sala ativa correta** (a sala daquela navegação);
- manter toda a experiência de criação no mesmo estilo visual da área principal do site.

## 3. Regras de negócio acordadas

1. A atividade deve ser criada na sala em que foi aberta/navegada.
2. A matéria deve ser resolvida dentro dessa sala antes do POST.
3. Fluxo do aluno cria atividade com `tipo = ATIVIDADE`.

## 4. Abordagens consideradas

### A) Recomendado (escolhido)
Resolver sala pela rota (`curso + período + semestre`), resolver matéria dessa sala e então integrar listagem/criação com API.

Prós:
- preserva rotas atuais;
- evita criação em sala errada;
- menor impacto estrutural.

Contras:
- requer normalização/mapeamento de nomes entre catálogo local e backend.

### B) Incluir `salaId` nas rotas públicas
Mais explícito no URL, sem inferência.

Prós:
- mapeamento direto.

Contras:
- quebra de navegação e refatoração maior de páginas/links.

### C) Criar por nome de matéria global
Buscar matéria pelo nome sem restringir sala.

Prós:
- implementação rápida.

Contras:
- alto risco de criar em sala incorreta.

## 5. Arquitetura funcional

### 5.1 Resolução de contexto (sala/matéria)
1. Ler parâmetros da rota: `courseId`, `periodId`, `semesterId`, `subjectId`.
2. Converter para padrão de sala esperado no backend:
   - curso: `ads|dsm|gpi|grh` -> `ADS|DSM|GPI|GRH`;
   - semestre: `4` -> `4°` para comparação robusta;
   - período: `diurno|noturno` -> `Manhã|Noite`.
3. Buscar salas (`GET /api/salas`) e encontrar a sala correspondente.
4. Buscar matérias da sala (`GET /api/salas/{salaId}/materias`).
5. Mapear `subjectId` para nome da matéria usando `courses.ts` e localizar `materiaId` real dentro da sala.

### 5.2 Listagem de atividades
- Com `materiaId` resolvido, buscar `GET /api/materias/{materiaId}/atividades`.
- Exibir dados reais na página, mantendo estrutura visual existente.

### 5.3 Criação de atividade
- Exibir modal/form de criação na própria tela de atividades.
- Submeter `POST /api/atividades` com payload:
  - `titulo`
  - `descricao`
  - `tipoEntrega` (`ENTREGA_MANUAL` ou `LINK_EXTERNO`)
  - `linkEntrega` (condicional)
  - `regras`
  - `prazo` (YYYY-MM-DD)
  - `materiaId` (resolvido pela sala ativa)
  - `tipo` = `ATIVIDADE`
- Ao sucesso: toast, fechar modal, recarregar listagem.

## 6. UX e estilo visual

Diretriz: manter identidade da área principal do site.

Aplicação:
- componentes UI existentes (`Input`, `Textarea`, `Select`, `Button`, `Dialog`);
- mesma linguagem de cores e tipografia da página pública;
- animações leves já utilizadas (`animate-in-fade`, transições curtas);
- CTA coerente entre estado vazio e estado com lista.

## 7. Validação e erros

Validação frontend:
- obrigatórios: `titulo`, `descricao`, `tipoEntrega`, `regras`, `prazo`;
- `linkEntrega` obrigatório quando `tipoEntrega = LINK_EXTERNO`.

Erros de contexto:
- se não encontrar sala da rota: estado amigável e orientação de retorno;
- se não encontrar matéria da sala: estado amigável e bloqueio de criação.

Erros de API:
- manter dados preenchidos no modal;
- exibir feedback claro sem quebrar a página.

## 8. Plano de testes manuais

1. Acessar `http://localhost:5173/ads/diurno/4/es3/atividades` com dados de sala/matéria existentes.
2. Validar carregamento de atividades reais da matéria.
3. Criar atividade com `ENTREGA_MANUAL` e confirmar atualização da lista.
4. Criar atividade com `LINK_EXTERNO` sem link e validar bloqueio.
5. Simular rota sem mapeamento e validar mensagem de erro amigável.

## 9. Riscos e mitigação

Risco:
- diferenças de nomenclatura entre catálogo local e dados de matéria do backend.

Mitigação:
- comparação normalizada (case, acento, espaços e pontuação);
- fallback de mensagem com instrução quando não houver correspondência.

## 10. Resultado esperado

Ao final, aluno conseguirá criar atividade pela rota pública de atividades, no endpoint correto e na sala correta, com interface consistente com a parte principal do site.
