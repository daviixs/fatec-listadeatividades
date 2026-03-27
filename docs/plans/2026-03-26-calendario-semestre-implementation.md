# Plano de Implementação: Calendario de Atividades por Semestre

**Data:** 2026-03-26  
**Documento Design:** `2026-03-26-calendario-semestre-design.md`  
**Status:** Planejado  
**Autor:** Assistente AI

## Resumo

Este documento detalha o plano de implementação para refatorar a navegação do sistema, substituindo as páginas de Materias e Atividades por uma única tela de calendário mensal que exibe todas as atividades, provas e trabalhos do semestre.

## Visão Geral das Tarefas

### Fase 1: Infraestrutura e Utilitários (Prioridade: ALTA)
- Criar componentes UI básicos ausentes (Checkbox)
- Criar utilitários para manipulação de datas

### Fase 2: Componentes do Calendário (Prioridade: ALTA)
- Criar componentes do calendário em ordem de dependência

### Fase 3: Pagina Principal (Prioridade: ALTA)
- Criar a pagina CalendarioSemestre

### Fase 4: Rotas e Navegação (Prioridade: MEDIA)
- Atualizar rotas e criar redirects

### Fase 5: Testes e Validação (Prioridade: MEDIA)
- Testes funcionais e validação UX

---

## Detalhamento das Tarefas

### FASE 1: Infraestrutura e Utilitários

#### Tarefa 1.1: Criar componente Checkbox
**Prioridade:** ALTA  
**Complexidade:** BAIXA  
**Estimativa:** 30 minutos

**Descrição:**
Criar componente Checkbox utilizando @base-ui/react para ser usado nos filtros por tipo de atividade.

**Arquivos a criar:**
- `frontend/src/components/ui/checkbox.tsx`

**Dependências:**
- Nenhuma

**Especificação:**
```typescript
// Interface
interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}
```

**Critérios de Conclusão:**
- [ ] Componente criado seguindo padrao shadcn/ui
- [ ] Suporta estado controlado e não controlado
- [ ] Estilização consistente com outros componentes UI
- [ ] Exporta Checkbox e CheckboxGroup

---

#### Tarefa 1.2: Criar utilitários de calendário
**Prioridade:** ALTA  
**Complexidade:** MEDIA  
**Estimativa:** 1 hora

**Descrição:**
Criar funções auxiliares para manipulação de datas do calendário.

**Arquivos a criar:**
- `frontend/src/lib/calendarUtils.ts`

**Dependências:**
- Nenhuma

**Especificação:**
```typescript
// Funções necessárias
getDaysInMonth(year: number, month: number): number[]
getFirstDayOfMonth(year: number, month: number): number (0-6)
isSameDay(date1: Date, date2: Date): boolean
formatMonthYear(date: Date): string (ex: "Março 2026")
getStartOfWeek(date: Date): Date
getEndOfWeek(date: Date): Date
isToday(date: Date): boolean
```

**Critérios de Conclusão:**
- [ ] Funções cobrem todos os casos de borda
- [ ] Funções são testadas manualmente com datas reais
- [ ] TypeScript types corretos

---

### FASE 2: Componentes do Calendário

#### Tarefa 2.1: Criar componente CalendarDay
**Prioridade:** ALTA  
**Complexidade:** BAIXA  
**Estimativa:** 1 hora

**Descrição:**
Criar componente que representa uma célula do dia no calendário. Exibe número do dia e indicadores visuais de atividades.

**Arquivos a criar:**
- `frontend/src/components/calendario/CalendarDay.tsx`

**Dependências:**
- Tarefa 1.2 (calendarUtils)

**Especificação:**
```typescript
interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  atividades: Atividade[];
  tiposFiltro: Set<TipoAtividade>;
  onClick: (date: Date) => void;
  onHover: (date: Date | null) => void;
}
```

**Funcionalidades:**
- Exibir número do dia
- Exibir indicadores coloridos para cada tipo de atividade filtrada
- Destacar dia atual
- Suportar dias de outros meses (desabilitados/acinzentados)
- Eventos onClick e onHover

**Cores:**
- Prova: `bg-red-500`
- Atividade: `bg-blue-500`
- Trabalho: `bg-emerald-500`

**Critérios de Conclusão:**
- [ ] Componente exibe dia corretamente
- [ ] Indicadores coloridos aparecem para atividades filtradas
- [ ] Dias de outros meses são estilizados diferentemente
- [ ] Dia atual tem destaque visual
- [ ] Eventos onClick e onHover funcionam

---

#### Tarefa 2.2: Criar componente DayTooltip
**Prioridade:** ALTA  
**Complexidade:** MEDIA  
**Estimativa:** 1.5 horas

**Descrição:**
Criar componente tooltip que aparece ao passar o mouse sobre um dia com atividades, listando até 4 atividades.

**Arquivos a criar:**
- `frontend/src/components/calendario/DayTooltip.tsx`

**Dependências:**
- Tarefa 1.2 (calendarUtils)
- Tarefa 2.1 (CalendarDay)

**Especificação:**
```typescript
interface DayTooltipProps {
  date: Date;
  atividades: Atividade[];
  visible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}
```

**Funcionalidades:**
- Listar até 4 atividades com preview
- Mostrar "Ver mais..." se houver mais de 4
- Desaparecer após 300ms ao tirar o mouse
- Posicionamento absoluto próximo ao dia
- Exibir título, tipo e matéria de cada atividade

**Layout:**
```
┌─────────────────────────────┐
│ 15 de Março de 2026         │
├─────────────────────────────┤
│ ● Lista de Exercícios 03    │
│   Atividade • BD Relacional  │
├─────────────────────────────┤
│ ● Projeto Integrador         │
│   Trabalho • POO            │
├─────────────────────────────┤
│ ● Prova 01                  │
│   Prova • LBD               │
├─────────────────────────────┤
│ Ver mais...                 │
└─────────────────────────────┘
```

**Critérios de Conclusão:**
- [ ] Tooltip aparece no hover
- [ ] Lista até 4 atividades
- [ ] Mostra "Ver mais..." quando necessário
- [ ] Desaparece após 300ms
- [ ] Posicionamento correto
- [ ] Estilização consistente

---

#### Tarefa 2.3: Criar componente CalendarGrid
**Prioridade:** ALTA  
**Complexidade:** MEDIA  
**Estimativa:** 2 horas

**Descrição:**
Criar componente grid do calendário que renderiza os dias do mês em formato de grid 7x5/6.

**Arquivos a criar:**
- `frontend/src/components/calendario/CalendarGrid.tsx`

**Dependências:**
- Tarefa 1.2 (calendarUtils)
- Tarefa 2.1 (CalendarDay)
- Tarefa 2.2 (DayTooltip)

**Especificação:**
```typescript
interface CalendarGridProps {
  mesAtual: Date;
  atividades: Atividade[];
  tiposFiltro: Set<TipoAtividade>;
  onDiaClick: (date: Date) => void;
  onDiaHover: (date: Date | null) => void;
}
```

**Funcionalidades:**
- Exibir cabeçalho com dias da semana (Do, Se, Te, Qu, Qu, Se, Sa)
- Renderizar grid de dias (7 colunas x 5-6 linhas)
- Incluir dias do mês anterior e próximo para completar o grid
- Filtrar atividades por tipo
- Gerenciar estado do tooltip

**Layout:**
```
┌───┬───┬───┬───┬───┬───┬───┐
│Do │Se │Te │Qu │Qu │Se │Sa │
├───┼───┼───┼───┼───┼───┼───┤
│23 │24 │25 │26 │27 │28 │01 │
│02 │03 │04 │05 │06 │07 │08 │
│09 │10 │11 │12 │13 │14 │15 │
│16 │17 │18 │19 │20 │21 │22 │
│23 │24 │25 │26 │27 │28 │29 │
│30 │31 │01 │02 │03 │04 │05 │
└───┴───┴───┴───┴───┴───┴───┘
```

**Critérios de Conclusão:**
- [ ] Grid exibe dias corretamente
- [ ] Dias do mês anterior/próximo são renderizados
- [ ] Cabeçalho com dias da semana
- [ ] Atividades são passadas para CalendarDay
- [ ] Tooltip funciona corretamente
- [ ] Responsivo (se adapta ao container)

---

#### Tarefa 2.4: Criar componente CalendarLegend
**Prioridade:** MEDIA  
**Complexidade:** BAIXA  
**Estimativa:** 30 minutos

**Descrição:**
Criar componente legenda que exibe as cores e significados dos tipos de atividade.

**Arquivos a criar:**
- `frontend/src/components/calendario/CalendarLegend.tsx`

**Dependências:**
- Nenhuma

**Especificação:**
```typescript
interface CalendarLegendProps {
  tiposFiltro: Set<TipoAtividade>;
  onTipoToggle: (tipo: TipoAtividade) => void;
}
```

**Funcionalidades:**
- Exibir legenda com cores e nomes
- Permitir clicar para alternar filtro do tipo

**Layout:**
```
LEGENDA:
● Prova   ● Atividade   ● Trabalho
```

**Critérios de Conclusão:**
- [ ] Legenda exibe cores corretas
- [ ] Clicar alterna filtro
- [ ] Estilização consistente
- [ ] Acessibilidade (aria-labels)

---

#### Tarefa 2.5: Criar componente FilterSidebar
**Prioridade:** ALTA  
**Complexidade:** MEDIA  
**Estimativa:** 1.5 horas

**Descrição:**
Criar componente sidebar com filtros por matéria e tipo de atividade, e botão para adicionar tarefa.

**Arquivos a criar:**
- `frontend/src/components/calendario/FilterSidebar.tsx`

**Dependências:**
- Tarefa 1.1 (Checkbox)
- Tarefa 2.4 (CalendarLegend)

**Especificação:**
```typescript
interface FilterSidebarProps {
  materias: MateriaApiResponse[];
  materiaSelecionada: number | null;
  onMateriaChange: (materiaId: number | null) => void;
  tiposFiltro: Set<TipoAtividade>;
  onTipoToggle: (tipo: TipoAtividade) => void;
  onAdicionarTarefa: () => void;
}
```

**Funcionalidades:**
- Dropdown para selecionar matéria (com opção "Todas as matérias")
- Checkboxes para filtrar por tipo (Atividade, Prova, Trabalho)
- Botão "Adicionar Tarefa"
- Responsivo (colapsável em tablet, drawer em mobile)

**Layout Desktop:**
```
┌─────────────────┐
│ FILTROS         │
├─────────────────┤
│ Matéria:        │
│ [Todas     v]   │
├─────────────────┤
│ Tipo:           │
│ [x] Atividade   │
│ [x] Prova       │
│ [x] Trabalho    │
├─────────────────┤
│ [+ Tarefa]      │
└─────────────────┘
```

**Critérios de Conclusão:**
- [ ] Dropdown de matéria funciona
- [ ] Checkboxes de tipo funcionam
- [ ] Botão adicionar tarefa funciona
- [ ] Responsivo (sidebar colapsável/drawer)
- [ ] Estilização consistente

---

#### Tarefa 2.6: Criar componente DayDetailModal
**Prioridade:** ALTA  
**Complexidade:** MEDIA  
**Estimativa:** 2 horas

**Descrição:**
Criar componente modal que exibe todas as atividades de um dia específico.

**Arquivos a criar:**
- `frontend/src/components/calendario/DayDetailModal.tsx`

**Dependências:**
- Componente Dialog existente
- Tarefa 1.2 (calendarUtils)

**Especificação:**
```typescript
interface DayDetailModalProps {
  date: Date;
  atividades: Atividade[];
  tiposFiltro: Set<TipoAtividade>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

**Funcionalidades:**
- Exibir data no header
- Listar todas as atividades do dia
- Filtro por tipo dentro do modal
- Exibir informações completas: título, matéria, professor, tipo, entrega, status
- Link para entrega externa (se aplicável)
- Status de aprovação

**Layout:**
```
┌───────────────────────────────────┐
│ 15 de Março de 2026         [X]   │
├───────────────────────────────────┤
│ Filtros: [Atividade] [Prova] [T] │
├───────────────────────────────────┤
│ ● Lista de Exercícios 03         │
│   Materia: BD Relacional          │
│   Professor: Prof. Silva          │
│   Prazo: 15/03/2026              │
│   Status: Aprovada                │
│   [Ver Detalhes]                  │
├───────────────────────────────────┤
│ ● Projeto Integrador              │
│   Materia: POO                    │
│   Professor: Prof. Santos         │
│   Prazo: 15/03/2026              │
│   Status: Pendente                │
│   [Ver Detalhes]                  │
└───────────────────────────────────┘
```

**Critérios de Conclusão:**
- [ ] Modal abre com as atividades do dia
- [ ] Filtro por tipo funciona
- [ ] Todas as informações são exibidas
- [ ] Status de aprovação visual
- [ ] Fechamento correto
- [ ] Responsivo

---

#### Tarefa 2.7: Criar componente AddActivityModal
**Prioridade:** MEDIA  
**Complexidade:** BAIXA  
**Estimativa:** 1 hora

**Descrição:**
Criar componente modal para adicionar nova atividade, reutilizando lógica do componente existente em Atividades.tsx.

**Arquivos a criar:**
- `frontend/src/components/calendario/AddActivityModal.tsx`

**Dependências:**
- Componente Dialog existente
- Componentes Input, Textarea, Select, Label existentes
- studentApi.criarAtividade

**Especificação:**
```typescript
interface AddActivityModalProps {
  materias: MateriaApiResponse[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}
```

**Funcionalidades:**
- Formulário com campos: Título, Descrição, Tipo (Atividade/Prova/Trabalho), Matéria, Prazo, Tipo Entrega, Link, Regras
- Validação de campos obrigatórios
- Envio para API via studentApi.criarAtividade
- Feedback de sucesso/erro
- Recarregar atividades ao sucesso

**Campos:**
- Título * (Input)
- Descrição * (Textarea)
- Tipo * (Select: Atividade, Prova, Trabalho)
- Matéria * (Select)
- Prazo * (Input type=date)
- Tipo de Entrega * (Select: Entrega Manual, Link Externo)
- Link * (condicional: apenas se Link Externo)
- Regras * (Textarea)

**Critérios de Conclusão:**
- [ ] Modal abre e fecha corretamente
- [ ] Formulário validado corretamente
- [ ] Criação de atividade funciona
- [ ] Feedback de sucesso/erro
- [ ] Callback onSuccess é chamado
- [ ] Estilização consistente

---

### FASE 3: Pagina Principal

#### Tarefa 3.1: Criar página CalendarioSemestre
**Prioridade:** ALTA  
**Complexidade:** ALTA  
**Estimativa:** 3 horas

**Descrição:**
Criar página principal que integra todos os componentes do calendário.

**Arquivos a criar:**
- `frontend/src/pages/CalendarioSemestre.tsx`

**Dependências:**
- Tarefa 1.2 (calendarUtils)
- Tarefa 2.3 (CalendarGrid)
- Tarefa 2.4 (CalendarLegend)
- Tarefa 2.5 (FilterSidebar)
- Tarefa 2.6 (DayDetailModal)
- Tarefa 2.7 (AddActivityModal)

**Especificação:**
```typescript
interface CalendarioSemestreProps {
  // Props via route
  courseId: string;
  periodId: string;
  semesterId: string;
}
```

**Estado:**
```typescript
interface CalendarioState {
  // Dados
  sala: SalaApiResponse | null;
  materias: MateriaApiResponse[];
  atividades: Atividade[];
  
  // Filtros
  materiaFiltro: number | null;
  tiposFiltro: Set<TipoAtividade>;
  
  // Navegacao
  mesAtual: Date;
  
  // UI
  diaSelecionado: Date | null;
  isAddModalOpen: boolean;
  loading: boolean;
  error: string | null;
}
```

**Funcionalidades:**
- Buscar sala via resolveSalaFromRoute()
- Buscar materias via getMateriasPorSala(salaId)
- Buscar atividades de todas as materias
- Agregar atividades em array único
- Navegação entre meses (anterior/proximo)
- Botão "Hoje" para retornar ao mes atual
- Filtros por matéria e tipo
- Modal de detalhes ao clicar no dia
- Modal de adicionar tarefa
- Tratamento de loading e erro

**Layout:**
```
┌─────────────────────────────────────────────┐
│ Calendario - 3º Semestre                    │
│ ADS - Diurno - Sala XYZ                     │
├───────────────┬─────────────────────────────┤
│  FILTROS      │      CALENDARIO             │
│               │  ┌──┬──┬──┬──┬──┬──┬──┐     │
│ [Materia v]   │  │Do│Se│Te│Qu│Qu│Se│Sa│     │
│               │  ├──┼──┼──┼──┼──┼──┼──┤     │
│ Tipo:         │  │  │  │  │  │  │  │  │     │
│ [ ] Ativ      │  ├──┼──┼──┼──┼──┼──┼──┤     │
│ [ ] Prova     │  │  │  │  │  │  │  │  │     │
│ [ ] Trab      │  ├──┼──┼──┼──┼──┼──┼──┤     │
│               │  │  │  │  │  │  │  │  │     │
│ [+Tarefa]     │  └──┴──┴──┴──┴──┴──┴──┘     │
│               │  < Março 2026 >            │
│               │  LEGENDA: ●P ●A ●T         │
└───────────────┴─────────────────────────────┘
```

**Fluxo de Dados:**
1. Ao carregar:
   - Buscar sala
   - Buscar materias
   - Buscar atividades de cada materia
   - Agregar atividades

2. Ao filtrar:
   - Atualizar estado
   - Re-renderizar

3. Ao adicionar:
   - Abrir modal
   - Ao salvar, recarregar atividades

**Critérios de Conclusão:**
- [ ] Carrega dados corretamente ao montar
- [ ] Calendário exibe mês atual
- [ ] Navegação entre meses funciona
- [ ] Botão "Hoje" funciona
- [ ] Filtros por matéria e tipo funcionam
- [ ] Modal de detalhes abre ao clicar no dia
- [ ] Modal de adicionar tarefa funciona
- [ ] Loading e erro tratados
- [ ] Responsivo em mobile
- [ ] Estilização consistente

---

### FASE 4: Rotas e Navegação

#### Tarefa 4.1: Atualizar rotas em routes/index.tsx
**Prioridade:** MEDIA  
**Complexidade:** BAIXA  
**Estimativa:** 30 minutos

**Descrição:**
Atualizar arquivo de rotas para adicionar nova rota do calendario e remover rotas antigas.

**Arquivos a modificar:**
- `frontend/src/routes/index.tsx`

**Dependências:**
- Tarefa 3.1 (CalendarioSemestre)

**Alterações:**

1. Importar nova página:
```typescript
import { CalendarioSemestre } from '@/pages/CalendarioSemestre';
```

2. Remover rotas antigas:
```typescript
// Remover
<Route path="/:courseId/:periodId/:semesterId/materias" element={<Materias />} />
<Route path="/:courseId/:periodId/:semesterId/:subjectId/atividades" element={<Atividades />} />
```

3. Adicionar nova rota:
```typescript
// Adicionar
<Route path="/:courseId/:periodId/:semesterId" element={<CalendarioSemestre />} />
```

4. Atualizar Semestre.tsx para navegar para nova rota:
```typescript
// Mudar de:
navigate(`/${course.id}/${periodId}/${semester.id}/materias`)

// Para:
navigate(`/${course.id}/${periodId}/${semester.id}`)
```

**Critérios de Conclusão:**
- [ ] Rota nova funciona
- [ ] Rotas antigas são removidas
- [ ] Navegação de Semestre funciona corretamente
- [ ] Teste manual das rotas

---

#### Tarefa 4.2: Criar redirects para rotas antigas
**Prioridade:** BAIXA  
**Complexidade:** BAIXA  
**Estimativa:** 30 minutos

**Descrição:**
Criar redirects para rotas antigas para evitar links quebrados e redirecionar usuários para nova rota.

**Arquivos a modificar:**
- `frontend/src/routes/index.tsx`

**Dependências:**
- Tarefa 4.1

**Alterações:**

Adicionar redirects ANTES da rota do calendario:
```typescript
// Redirects para rotas antigas
<Route
  path="/:courseId/:periodId/:semesterId/materias"
  element={<Navigate to={`/:courseId/:periodId/:semesterId`} replace />}
/>
<Route
  path="/:courseId/:periodId/:semesterId/:subjectId/atividades"
  element={<Navigate to={`/:courseId/:periodId/:semesterId`} replace />}
/>
```

**Critérios de Conclusão:**
- [ ] Redirect de materias funciona
- [ ] Redirect de atividades funciona
- [ ] URL é atualizada
- [ ] Teste manual dos redirects

---

### FASE 5: Testes e Validação

#### Tarefa 5.1: Testes funcionais
**Prioridade:** MEDIA  
**Complexidade:** MEDIA  
**Estimativa:** 2 horas

**Descrição:**
Realizar testes manuais de todas as funcionalidades do calendário.

**Arquivos testados:**
- Todos os componentes criados
- Página CalendarioSemestre

**Casos de Teste:**

**RF01 - Calendario Mensal:**
- [ ] Calendário exibe mês atual corretamente
- [ ] Navegação entre meses funciona (anterior/próximo)
- [ ] Botão "Hoje" retorna ao mês atual
- [ ] Indicadores visuais aparecem nos dias com atividades

**RF02 - Cores por Tipo:**
- [ ] Prova aparece em vermelho (bg-red-500)
- [ ] Atividade aparece em azul (bg-blue-500)
- [ ] Trabalho aparece em verde (bg-emerald-500)
- [ ] Legenda exibe cores corretamente

**RF03 - Tooltip no Hover:**
- [ ] Tooltip aparece ao passar o mouse
- [ ] Lista até 4 atividades
- [ ] Mostra "Ver mais..." se houver mais de 4
- [ ] Desaparece após tirar o mouse

**RF04 - Visualização Detalhada:**
- [ ] Modal abre ao clicar no dia
- [ ] Exibe todas as informações: título, matéria, professor, tipo, entrega, status
- [ ] Filtro por tipo funciona dentro do modal

**RF05 - Filtro por Matéria:**
- [ ] Dropdown lista todas as matérias
- [ ] Opção "Todas as matérias" funciona
- [ ] Filtro atualiza o calendário em tempo real

**RF06 - Filtro por Tipo:**
- [ ] Checkboxes permitem marcar/desmarcar tipos
- [ ] Desmarcar um tipo esconde do calendário
- [ ] Tipos marcados por padrão ao carregar

**RF07 - Adicionar Tarefa:**
- [ ] Botão abre modal
- [ ] Formulário valida campos obrigatórios
- [ ] Criação de atividade funciona
- [ ] Nova atividade aparece no calendário após recarregar

**Testes de Responsividade:**
- [ ] Desktop (>1024px): Sidebar fixa à esquerda
- [ ] Tablet (768-1024px): Sidebar colapsável
- [ ] Mobile (<768px): Filtros em drawer, calendário tela cheia

**Testes de Navegação:**
- [ ] Home -> Periodo -> Semestre -> Calendario funciona
- [ ] Rotas antigas redirecionam corretamente

**Testes de Performance:**
- [ ] Carregamento inicial aceitável
- [ ] Navegação entre meses fluida
- [ ] Filtros não causam lag

**Critérios de Conclusão:**
- [ ] Todos os casos de teste passam
- [ ] Bugs identificados e documentados
- [ ] Feedback de UX obtido

---

#### Tarefa 5.2: Validação de Design System
**Prioridade:** BAIXA  
**Complexidade:** BAIXA  
**Estimativa:** 1 hora

**Descrição:**
Validar que todos os componentes seguem o design system existente (Tailwind CSS).

**Arquivos validados:**
- Todos os componentes criados

**Validações:**
- [ ] Cores seguem paleta do sistema
- [ ] Espaçamentos são consistentes
- [ ] Tipografia é consistente
- [ ] Bordas e sombras seguem padrão
- [ ] Responsividade usa breakpoints corretos
- [ ] Dark mode (se aplicável)

**Critérios de Conclusão:**
- [ ] Todos os componentes validados
- [ ] Inconsistências identificadas e corrigidas

---

#### Tarefa 5.3: Validação de Acessibilidade
**Prioridade:** BAIXA  
**Complexidade:** BAIXA  
**Estimativa:** 1 hora

**Descrição:**
Validar acessibilidade dos componentes e páginas criados.

**Validações:**
- [ ] Elementos interativos têm aria-labels apropriados
- [ ] Cores tem contraste suficiente (WCAG AA)
- [ ] Navegação por teclado funciona
- [ ] Foco visual é claro
- [ ] Screen readers podem ler o conteúdo

**Critérios de Conclusão:**
- [ ] Validação de acessibilidade concluída
- [ ] Problemas identificados e corrigidos

---

## Resumo de Esforço

| Fase | Tarefas | Complexidade | Estimativa |
|------|---------|--------------|------------|
| FASE 1 | 2 tarefas | Media | 1.5h |
| FASE 2 | 7 tarefas | Alta | 9h |
| FASE 3 | 1 tarefa | Alta | 3h |
| FASE 4 | 2 tarefas | Baixa | 1h |
| FASE 5 | 3 tarefas | Media | 4h |
| **TOTAL** | **15 tarefas** | - | **18.5h** |

## Checklist Geral

### Frontend
- [ ] Componente Checkbox criado
- [ ] Utilitários de calendário criados
- [ ] CalendarDay criado
- [ ] DayTooltip criado
- [ ] CalendarGrid criado
- [ ] CalendarLegend criado
- [ ] FilterSidebar criado
- [ ] DayDetailModal criado
- [ ] AddActivityModal criado
- [ ] CalendarioSemestre criado
- [ ] Rotas atualizadas
- [ ] Redirects criados

### Testes
- [ ] Testes funcionais realizados
- [ ] Design system validado
- [ ] Acessibilidade validada

### Documentação
- [ ] Code comments adicionados
- [ ] README atualizado (se necessário)

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Componente Tooltip não existir | Alta | Baixo | Implementar com CSS/React puro |
| Performance com muitas atividades | Baixa | Médio | Paginação/lazy loading futuro |
| Bugs com fusos horários | Média | Alto | Usar UTC internamente |
| Links quebrados de rotas antigas | Alta | Alto | Redirects implementados |
| Inconsistência visual com sistema existente | Média | Médio | Reutilizar componentes shadcn/ui |

## Critérios de Aceite Finais

- [ ] Calendário exibe mês atual corretamente
- [ ] Navegação entre meses funciona
- [ ] Atividades aparecem nos dias corretos
- [ ] Cores correspondem aos tipos
- [ ] Tooltip aparece no hover
- [ ] Modal abre ao clicar no dia
- [ ] Filtro por matéria funciona
- [ ] Filtro por tipo funciona
- [ ] Botão adicionar tarefa funciona
- [ ] Legenda visível e correta
- [ ] Responsivo em mobile
- [ ] Rotas antigas redirecionam corretamente
- [ ] Não há regressões em funcionalidades existentes

## Próximos Passos

Após implementação:
1. Deploy em ambiente de staging
2. Testes com usuários reais
3. Feedback e ajustes
4. Deploy em produção
5. Monitoramento de bugs e performance

## Notas Adicionais

- Banco de dados não precisa de alterações
- Entidade Atividade já tem todos os campos necessários
- Reutilizar componentes shadcn/ui existentes
- Seguir design system Tailwind CSS existente
- Componentes devem ser reutilizáveis e testáveis
- Código deve seguir patterns existentes no projeto
