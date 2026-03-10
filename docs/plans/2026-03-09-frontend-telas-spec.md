# Especificação de Telas Frontend

**Data:** 2026-03-09
**Projeto:** TodoList FATEC - Centralização da Sala com Votação de Cancelamento

---

## 1. Visão Geral

O frontend deve ter duas áreas principais:
- **Área do Aluno** — Para entrada na sala, consulta de matérias/atividades e votação
- **Área do Líder** — Para gerenciar alunos, aprovar entradas, gerenciar atividades e abrir votações

---

## 2. Tela de Login/Entrada na Sala

**Rota:** `/` (raiz)

### Componentes
| Componente | Descrição | Tipo |
|---|---|---|
| Campo "Código da Sala" | Input de texto para digitar o código de convite da sala | Campo de formulário |
| Campo "RM" | Input de texto para digitar o RM (Registro Acadêmico) | Campo de formulário |
| Campo "Nome" | Input de texto para digitar o nome completo | Campo de formulário |
| Botão "Entrar" | Botão principal para solicitar entrada na sala | Botão primário |
| Mensagem de Erro | Exibe mensagens de erro (código inválido, RM não cadastrado) | Alerta |

### Estados da Tela
| Estado | Descrição |
|---|---|
| **Inicial** | Formulário vazio, pronto para preenchimento |
| **Enviando** | Botão desabilitado, exibindo indicador de carregamento |
| **Sucesso - Entrada Pendente** | Redireciona para "Tela de Aguardando Aprovação" |
| **Erro** | Exibe mensagem de erro no topo da tela |

### Integração com a API
- **POST** `/api/salas/acessar` — Valida código da sala
- **POST** `/api/salas/{salaId}/entradas` — Solicita entrada com `{codigo, rm, nome}`

---

## 3. Tela de Aguardando Aprovação

**Rota:** `/aguardando` (acessível após solicitar entrada)

### Componentes
| Componente | Descrição | Tipo |
|---|---|---|
| Card de Status | Exibe "Solicitação de entrada enviada com sucesso!" | Card informativo |
| Mensagem de Status | Exibe "Aguarde a aprovação do líder para acessar a sala" | Texto |
| Botão "Atualizar" | Botão para recarregar o status da entrada (polling) | Botão secundário |

### Estados da Tela
| Estado | Descrição |
|---|---|
| **Pendente** | Exibe mensagem "Aguardando aprovação..." + botão "Atualizar" |
| **Aprovado** | Exibe mensagem "Aprovação concedida! Redirecionando..." + redireciona automaticamente para "Tela do Aluno" |
| **Rejeitado** | Exibe mensagem "Sua solicitação foi rejeitada pelo líder." + botão "Voltar" (volta para Tela de Login) |

### Integração com a API
- **GET** `/api/salas/{salaId}/entradas/{id}` — Busca status da entrada (usar o `id` da entrada retornado na resposta de solicitação)
- Implementar polling automático a cada 10-15 segundos via botão "Atualizar" ou automaticamente

---

## 4. Tela do Aluno (Dashboard)

**Rota:** `/aluno` (principal após aprovação)

### Layout
- Sidebar/Menu lateral com navegação
- Área principal com conteúdo dinâmico

### Menu Lateral
| Opção | Descrição |
|---|---|
| **Matérias** | Lista todas as matérias da sala |
| **Atividades** | Lista todas as atividades (por matéria ou todas) |
| **Votações** | Lista votações abertas (com status de votação) |

### Componentes de Conteúdo
| Componente | Descrição |
|---|---|
| Lista de Matérias | Cards com nome da matéria e professor |
| Lista de Atividades | Cards com título, descrição, prazo, tipo de entrega, status (ATIVA/CANCELADA) |
| Card de Atividade | Título, descrição resumida, prazo, tipo de entrega, botão "Ver Detalhes" |
| Card de Votação | Título da atividade, período de votação, contadores de votos (SIM/NÃO), barra de progresso da meta |

### Integração com a API
- **GET** `/api/materias/sala/{salaId}` — Lista matérias da sala
- **GET** `/api/atividades` — Lista todas as atividades (filtrar por matéria no frontend)
- **GET** `/api/atividades/{id}` — Detalhes de uma atividade específica
- **GET** `/api/atividades/{atividadeId}/votacao` — Detalhes de uma votação específica

---

## 5. Tela de Detalhes da Atividade

**Rota:** `/atividades/{id}`

### Componentes
| Componente | Descrição |
|---|---|
| Título | Nome da atividade (h2) |
| Matéria | Nome da matéria e professor |
| Descrição Completa | Texto completo da descrição |
| Tipo de Entrega | Enum (LINK_EXTERNO / ENTREGA_MANUAL) |
| Link de Entrega | Link clicável (se tipo = LINK_EXTERNO) |
| Regras de Entrega | Texto com regras acadêmicas |
| Prazo | Data de prazo de entrega (formato brasileiro) |
| Status | Badge com status (ATIVA = verde, CANCELADA = vermelho) |
| Card de Votação (se aplicável) | Exibe se há votação aberta com botão "Votar" |

### Integração com a API
- **GET** `/api/atividades/{id}` — Detalhes completos da atividade
- **GET** `/api/atividades/{id}/votacao` — Verifica se há votação aberta

---

## 6. Tela de Votação

**Rota:** `/atividades/{atividadeId}/votar`

### Componentes
| Componente | Descrição |
|---|---|
| Título da Atividade | Nome da atividade em votação |
| Período | "Votação aberta de {iniciadaEm} até {encerraEm}" |
| Meta de Cancelamento | "Atividade será cancelada se {votosSim} >= {meta} de {totalAlunos} alunos" |
| Barra de Progresso | Visualização da meta (ex: 8/10 alunos = 80%) |
| Contador de Votos | "Votos SIM: X | Votos NÃO: Y" |
| Botões de Votação | Botões grandes "VOTAR SIM" (verde) e "VOTAR NÃO" (cinza) |
| Status Final | Exibe "ATIVIDADE CANCELADA!" ou "Votação encerrada sem cancelamento" |

### Estados da Tela
| Estado | Descrição |
|---|---|
| **Antes de Votar** | Exibe botões de votação + contadores atuais |
| **Votando** | Desabilita botões após clique, exibe "Registrando voto..." |
| **Após Votar** | Exibe "Voto registrado com sucesso!" + atualiza contadores |
| **Atividade Cancelada** | Exibe "Esta atividade foi CANCELADA!" + desabilita tudo |
| **Votação Encerrada** | Exibe "Votação encerrada" + resultado final |

### Integração com a API
- **GET** `/api/atividades/{atividadeId}/votacao` — Busca dados da votação (votos, meta, total alunos)
- **POST** `/api/atividades/{atividadeId}/votacao/votos?alunoId={id}` — Registra voto com `{opcao: "SIM" | "NAO"}`
- Implementar polling a cada 5-10 segundos para atualizar contadores automaticamente

### Regras de Votação
- Apenas aluno aprovado pode votar
- Cada aluno vota uma única vez por votação
- A meta de cancelamento: 80% do total de alunos da sala
- Atividade é cancelada automaticamente quando a meta é atingida
- Janela de votação: 12 horas

---

## 7. Tela do Líder (Dashboard)

**Rota:** `/lider`

### Layout
- Menu lateral com seções
- Área principal com tabs/abas

### Menu Lateral
| Opção | Descrição |
|---|---|
| **Gerenciar Sala** | Edição dos dados da sala (nome, semestre) |
| **Gerenciar Alunos** | CRUD de alunos (cadastrar, listar, excluir) |
| **Aprovar Entradas** | Lista de solicitações pendentes com botões de aprovação/rejeição |
| **Gerenciar Matérias** | CRUD de matérias |
| **Gerenciar Atividades** | CRUD de atividades |
| **Abrir Votação** | Lista de atividades ATIVAS com botão "Abrir Votação" |

---

## 8. Tela de Gerenciar Alunos

**Rota:** `/lider/alunos`

### Componentes
| Componente | Descrição |
|---|---|
| Formulário de Cadastro | Campos "RM" e "Nome" + botão "Cadastrar Aluno" |
| Lista de Alunos | Tabela com colunas: RM, Nome, Ações (Excluir) |
| Contador | "Total de alunos: X" (para cálculo da meta de cancelamento) |

### Integração com a API
- **GET** `/api/salas/{salaId}/alunos` — Lista alunos da sala
- **POST** `/api/salas/{salaId}/alunos` — Cadastra novo aluno com `{rm, nome}`
- **DELETE** `/api/salas/{salaId}/alunos/{id}` — Exclui aluno (se implementado futuramente)

---

## 9. Tela de Aprovar Entradas

**Rota:** `/lider/entradas`

### Componentes
| Componente | Descrição |
|---|---|
| Aba de Filtro | Tabs: "Pendentes" (padrão), "Aprovados", "Rejeitados" |
| Lista de Solicitações | Cards com: Nome do aluno, RM, Data da solicitação, Status |
| Botão de Ação | "Aprovar" (verde) e "Rejeitar" (vermelho) |
| Contador | "X solicitações pendentes" |

### Estados do Card
| Estado | Descrição |
|---|---|
| **Pendente** | Card com borda amarela + botões de ação visíveis |
| **Aprovado** | Card com borda verde + botões desabilitados |
| **Rejeitado** | Card com borda vermelha + botões desabilitados |

### Integração com a API
- **GET** `/api/salas/{salaId}/entradas?status=PENDENTE` — Lista entradas pendentes
- **PATCH** `/api/salas/{salaId}/entradas/{id}/aprovar` — Aprova com `{aprovado: true}`
- **PATCH** `/api/salas/{salaId}/entradas/{id}/aprovar` — Rejeita com `{aprovado: false}`

---

## 10. Tela de Gerenciar Atividades

**Rota:** `/lider/atividades`

### Componentes
| Componente | Descrição |
|---|---|
| Formulário de Criação | Campos completos (título, descrição, tipo, link, regras, prazo, matéria) + botão "Criar" |
| Lista de Atividades | Cards/linhas com: Título, Prazo, Status, Matéria, Ações (Editar/Excluir) |
| Filtros | Por matéria, por status (ATIVA/CANCELADA) |
| Botão "Abrir Votação" | Exibido apenas para atividades ATIVAS sem votação aberta |

### Integração com a API
- **GET** `/api/atividades` — Lista todas as atividades
- **POST** `/api/atividades` — Criar nova atividade
- **PUT** `/api/atividades/{id}` — Atualizar atividade existente
- **DELETE** `/api/atividades/{id}` — Excluir atividade

---

## 11. Modal de Abertura de Votação

**Rota:** Modal (acessível da Tela de Gerenciar Atividades)

### Componentes
| Componente | Descrição |
|---|---|
| Título | "Abrir Votação de Cancelamento" |
| Info da Atividade | Título + Prazo |
| Janela de Votação | "Período: 12 horas a partir de agora" |
| Botão "Abrir Votação" | Botão primário para confirmar |
| Botão "Cancelar" | Botão secundário para fechar modal |
| Alerta de Aviso | "Esta ação iniciará uma votação de 12 horas para esta atividade" |

### Integração com a API
- **POST** `/api/atividades/{atividadeId}/votacao` — Abre votação
- Validações: atividade deve estar ATIVA, não pode haver votação aberta existente

---

## 12. Componentes Compartilhados

### Componentes UI (design system)
| Componente | Descrição |
|---|---|
| **Navbar** | Logo + nome da sala + informações do usuário logado (Nome/Perfil) |
| **Card** | Container com borda, sombra, espaçamento interno |
| **Badge** | Label pequena com cor (verde/vermelho/azul/amarela) |
| **Alerta** | Mensagem de erro/sucesso com ícone |
| **Spinner/Loader** | Indicador de carregamento |
| **Toast** | Notificação flutuante (erro/sucesso) |

### Paleta de Cores
| Elemento | Cor |
|---|---|
| Primária (Botões principais) | Azul (#3B82F6) |
| Sucesso (Aprovação/SIM) | Verde (#10B981) |
| Erro (Rejeição/NÃO/CANCELADA) | Vermelho (#EF4444) |
| Aviso (Pendente) | Amarelo (#F59E0B) |
| Fundo | Cinza claro (#F3F4F6) |
| Texto | Cinza escuro (#1F2937) |

---

## 13. Fluxos de Usuário Principais

### Fluxo 1: Aluno entrando na sala pela primeira vez
1. **Tela de Login** → Preenche {código, rm, nome} → Clica "Entrar"
2. **API** → POST `/api/salas/{salaId}/entradas` → Retorna `EntradaSalaResponse` com `id` da entrada
3. **Tela de Aguardando** → Exibe "Solicitação enviada, aguarde aprovação..."
4. **Polling** → GET `/api/salas/{salaId}/entradas/{id}` a cada 10s
5. **Líder aprova** → PATCH `/api/salas/{salaId}/entradas/{id}/aprovar` com `{aprovado: true}`
6. **Aluno vê Aprovado** → Polling detecta `status: APROVADO` → Redireciona para "Tela do Aluno"

### Fluxo 2: Votação e Cancelamento
1. **Líder abre votação** → POST `/api/atividades/{atividadeId}/votacao`
2. **Aluno vê atividade** → Card exibe "Votação em andamento"
3. **Aluno acessa votação** → Botão "Votar" → `/atividades/{id}/votar`
4. **Aluno vota SIM** → POST `/api/atividades/{atividadeId}/votacao/votos` com `{opcao: "SIM"}`
5. **API recalcula** → Se `votosSim >= meta_cancelamento`, atividade status → `CANCELADA`
6. **Todos veem cancelamento** → Polling detecta `atividadeStatus: CANCELADA` → Exibe "ATIVIDADE CANCELADA!"

---

## 14. Estados de Loading e Erro

### Loading States
| Situação | Componente |
|---|---|
| Carregando página | Spinner centralizado |
| Carregando lista | Skeleton loader / shimmer |
| Enviando formulário | Botão com spinner interno |

### Error States
| Situação | Mensagem |
|---|---|
| 404 Não encontrado | "Recurso não encontrado. Tente novamente." |
| 403 Proibido | "Você não tem permissão para esta ação." |
| 500 Erro de servidor | "Ocorreu um erro inesperado. Tente novamente mais tarde." |
| Erro de conexão | "Não foi possível conectar ao servidor. Verifique sua conexão." |

---

## 15. Responsividade (Mobile-First)

### Breakpoints
| Dispositivo | Layout |
|---|---|
| Desktop (>= 1024px) | Menu lateral fixo + área de conteúdo |
| Tablet (768px - 1023px) | Menu lateral colapsável (hambúrguer) + área de conteúdo |
| Mobile (< 768px) | Menu lateral oculto (drawer/swipe) + área de conteúdo em tela cheia |

### Componentes Responsivos
| Componente | Desktop | Mobile |
|---|---|---|
| Tabela de alunos | Todas as colunas | Colunas principais + ação "Ver mais" |
| Cards de atividades | Grid 3 colunas | Lista de 1 coluna |
| Modal | Centralizado na tela | Fullscreen (bottom sheet) |

---

## 16. Considerações Técnicas

### Framework Recomendado
- React.js com TypeScript
- React Router para navegação entre telas
- Axios ou Fetch API para chamadas HTTP
- Context API ou Redux para estado global (dados da sala, usuário logado)

### Armazenamento Local
- **localStorage** para:
  - Código da sala atual
  - Dados do aluno logado (id, nome, rm)
  - Token de autenticação (se implementado futuramente)

### Performance
- Implementar lazy loading para listas longas (alunos, atividades)
- Cache de respostas por 1-2 minutos (para listas que mudam pouco)
- Debounce para campo de busca (se implementado filtro de busca)

---

## 17. Checklist de Implementação

- [ ] Tela de Login/Entrada na Sala
- [ ] Tela de Aguardando Aprovação
- [ ] Tela do Aluno (Dashboard)
- [ ] Tela de Detalhes da Atividade
- [ ] Tela de Votação
- [ ] Tela do Líder (Dashboard)
- [ ] Tela de Gerenciar Alunos
- [ ] Tela de Aprovar Entradas
- [ ] Tela de Gerenciar Atividades
- [ ] Modal de Abertura de Votação
- [ ] Componentes compartilhados (Navbar, Card, Badge, Alerta, Spinner, Toast)
- [ ] Sistema de design (paleta de cores, tipografia)
- [ ] Responsividade (mobile-first)
- [ ] Integração com todos os endpoints da API
- [ ] Tratamento de erros (loading states, error states)
- [ ] Polling para atualização em tempo real (status de entrada, contadores de votação)

---

## 18. Mockups Sugeridos

### Tela de Login/Entrada
```
+-------------------------------------+
|  Entrada na Sala           |
|                             |
|  Código da Sala [_________] |
|                             |
|  RM           [_________] |
|                             |
|  Nome         [_________] |
|                             |
|      [  ENTRAR  ]          |
+-------------------------------------+
```

### Tela de Votação
```
+-------------------------------------+
|  Trabalho Final - Programação |
|                             |
|  Votação encerra às 23:59   |
|                             |
|  Meta: 8/10 alunos (80%)    |
|  [==========] 80%             |
|                             |
|  VOTOS:                     |
|  [✓] SIM: 8               |
|  [ ] NÃO: 2              |
|                             |
|      [ VOTAR SIM ] [VOTAR NÃO] |
+-------------------------------------+
```

### Tela do Líder - Aprovar Entradas
```
+-------------------------------------+
|  Entradas Pendentes: 3         |
|                             |
|  +-------------------------+       |
|  | João Silva       RM: 1234 | |
|  | Solicitado em: 09/03    | |
|  |                  [ APROVAR ] | |
|  +-------------------------+       |
|                             |
|  +-------------------------+       |
|  | Maria Santos     RM: 5678 | |
|  | Solicitado em: 09/03    | |
|  |                  [ APROVAR ] | |
|  +-------------------------+       |
+-------------------------------------+
```

---

**Fim da Especificação**
