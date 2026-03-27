# Design: Calendario de Atividades por Semestre

**Data:** 2026-03-26  
**Status:** Aprovado  
**Autor:** Assistente AI

## Resumo

Refatoracao da navegacao do sistema para substituir as paginas de Materias e Atividades por uma unica tela de calendario mensal. O calendario exibe todas as atividades, provas e trabalhos do semestre, com filtros por materia e tipo, tooltips no hover e visualizacao detalhada ao clicar em um dia.

## Contexto

### Fluxo Atual
```
Home -> Periodo -> Semestre -> Materias -> Atividades
```

### Novo Fluxo
```
Home -> Periodo -> Semestre -> CalendarioSemestre
```

## Requisitos Funcionais

### RF01 - Calendario Mensal
- Exibir calendario em formato de grid mensal (7 colunas x 5-6 linhas)
- Navegacao entre meses com botoes anterior/proximo
- Botao "Hoje" para retornar ao mes atual
- Indicadores visuais coloridos nos dias com atividades

### RF02 - Cores por Tipo de Atividade
- **Prova:** Vermelho (`bg-red-500`)
- **Atividade:** Azul (`bg-blue-500`)
- **Trabalho:** Verde (`bg-emerald-500`)
- Legenda de cores visivel abaixo do calendario

### RF03 - Tooltip no Hover
- Ao passar o mouse sobre um dia com atividades, exibir card flutuante
- Listar ate 4 atividades no preview
- Mostrar "Ver mais..." se houver mais de 4
- Tooltip desaparece apos 300ms ao tirar o mouse

### RF04 - Visualizacao Detalhada (Click no Dia)
- Ao clicar em um dia, abrir modal/painel com todas as atividades
- Exibir informacoes completas: titulo, materia, professor, tipo entrega, status
- Filtro por tipo dentro do modal

### RF05 - Filtro por Materia
- Dropdown na sidebar com todas as materias do semestre
- Opcao "Todas as materias" no topo
- Filtro atualiza o calendario em tempo real

### RF06 - Filtro por Tipo
- Checkboxes para Atividade, Prova, Trabalho
- Todos marcados por padrao
- Desmarcar um tipo esconde do calendario

### RF07 - Adicionar Tarefa
- Botao "Adicionar Tarefa" na sidebar
- Abre modal com formulario (reutiliza logica existente)
- Campos: Titulo, Descricao, Tipo, Materia, Prazo, Tipo Entrega, Link, Regras

## Arquitetura

### Estrutura de Componentes

```
frontend/src/pages/
├── CalendarioSemestre.tsx        # Pagina principal

frontend/src/components/calendario/
├── CalendarGrid.tsx              # Grid do calendario
├── CalendarDay.tsx               # Celula de cada dia
├── DayTooltip.tsx                # Tooltip no hover
├── DayDetailModal.tsx            # Modal ao clicar no dia
├── FilterSidebar.tsx             # Filtros laterais
├── CalendarLegend.tsx            # Legenda de cores
└── AddActivityModal.tsx          # Modal de adicionar tarefa
```

### Layout da Pagina

```
+-----------------------------------------------------------+
|  Header: "Calendario - 3o Semestre"                       |
|  Subtitulo: "ADS - Diurno - Sala XYZ"                     |
+-----------------------------------------------------------+
|                                                           |
|  +------------+  +----------------------------------+     |
|  |  FILTROS   |  |         CALENDARIO               |     |
|  |            |  |  +--+--+--+--+--+--+--+          |     |
|  | [Materia v]|  |  |Do|Se|Te|Qu|Qu|Se|Sa|          |     |
|  |            |  |  +--+--+--+--+--+--+--+          |     |
|  | Tipo:      |  |  | 1| 2| 3| 4| 5| 6| 7|          |     |
|  | [ ] Ativ   |  |  +--+--+--+--+--+--+--+          |     |
|  | [ ] Prova  |  |  | 8| 9|10|11|12|13|14|          |     |
|  | [ ] Trab   |  |  +--+--+--+--+--+--+--+          |     |
|  |            |  |                                  |     |
|  | [+Tarefa]  |  |  < Marco 2026 >                  |     |
|  |            |  |                                  |     |
|  +------------+  |  LEGENDA: * Prova * Ativ * Trab  |     |
|                  +----------------------------------+     |
+-----------------------------------------------------------+
```

### Responsividade

- **Desktop (>1024px):** Sidebar fixa a esquerda, calendario a direita
- **Tablet (768-1024px):** Sidebar colapsavel
- **Mobile (<768px):** Filtros em drawer, calendario tela cheia

## Banco de Dados

### Analise

**Nenhuma alteracao necessaria.** A entidade `Atividade` ja possui:

| Campo | Tipo | Uso |
|-------|------|-----|
| `id` | Long | Identificador |
| `titulo` | String | Exibicao |
| `descricao` | String | Detalhes |
| `tipo` | Enum(ATIVIDADE, PROVA, TRABALHO) | Cor |
| `prazo` | LocalDate | Data no calendario |
| `materia_id` | Long FK | Filtro por materia |
| `status` | Enum(ATIVA, CANCELADA) | Filtrar |
| `statusAprovacao` | Enum | Mostrar apenas aprovadas |

## API

### Endpoints Existentes (suficientes)

1. `GET /api/salas` - Lista salas
2. `GET /api/salas/{salaId}/materias` - Materias de uma sala
3. `GET /api/materias/{materiaId}/atividades` - Atividades de uma materia
4. `POST /api/atividades` - Criar atividade

### Endpoint Sugerido (otimizacao futura)

```
GET /api/salas/{salaId}/atividades
```

Busca todas as atividades de todas as materias de uma sala em uma unica chamada.

## Mudancas nas Rotas

### Remover
- `/:courseId/:periodId/:semesterId/materias` -> Materias.tsx
- `/:courseId/:periodId/:semesterId/:subjectId/atividades` -> Atividades.tsx

### Adicionar
- `/:courseId/:periodId/:semesterId` -> CalendarioSemestre.tsx

### Arquivo: `routes/index.tsx`

```tsx
// Remover
<Route path="/:courseId/:periodId/:semesterId/materias" element={<Materias />} />
<Route path="/:courseId/:periodId/:semesterId/:subjectId/atividades" element={<Atividades />} />

// Adicionar
<Route path="/:courseId/:periodId/:semesterId" element={<CalendarioSemestre />} />
```

## Estado da Aplicacao

### Estado Local (CalendarioSemestre)

```typescript
interface CalendarioState {
  // Dados
  sala: SalaApiResponse | null;
  materias: MateriaApiResponse[];
  atividades: Atividade[];
  
  // Filtros
  materiaFiltro: number | null; // null = todas
  tiposFiltro: Set<TipoAtividade>; // ATIVIDADE, PROVA, TRABALHO
  
  // Navegacao
  mesAtual: Date;
  
  // UI
  diaSelecionado: Date | null; // modal aberto
  isAddModalOpen: boolean;
  loading: boolean;
  error: string | null;
}
```

## Fluxo de Dados

1. **Ao carregar a pagina:**
   - Buscar sala via `resolveSalaFromRoute()`
   - Buscar materias via `getMateriasPorSala(salaId)`
   - Para cada materia, buscar atividades via `getAtividadesPorMateria(materiaId)`
   - Agregar todas as atividades em um array unico

2. **Ao filtrar por materia:**
   - Atualizar `materiaFiltro`
   - Re-renderizar calendario com atividades filtradas

3. **Ao filtrar por tipo:**
   - Atualizar `tiposFiltro`
   - Re-renderizar calendario com atividades filtradas

4. **Ao clicar em um dia:**
   - Abrir modal `DayDetailModal`
   - Passar atividades do dia selecionado

5. **Ao adicionar tarefa:**
   - Abrir modal `AddActivityModal`
   - Ao salvar, recarregar atividades

## Estimativa de Esforco

| Tarefa | Complexidade | Estimativa |
|--------|--------------|------------|
| CalendarioSemestre.tsx | Media | 2-3h |
| CalendarGrid.tsx | Media | 2h |
| CalendarDay.tsx | Baixa | 1h |
| DayTooltip.tsx | Baixa | 1h |
| DayDetailModal.tsx | Media | 1-2h |
| FilterSidebar.tsx | Baixa | 1h |
| CalendarLegend.tsx | Baixa | 30min |
| AddActivityModal.tsx | Baixa (reutiliza) | 1h |
| Atualizacao de rotas | Baixa | 30min |
| Testes e ajustes | Media | 2h |
| **Total** | - | **12-15h** |

## Decisoes de Design

1. **Calendario custom vs biblioteca:** Custom (melhor integracao visual)
2. **Tooltip vs popover:** Tooltip (mais leve, menos intrusivo)
3. **Modal vs drawer para detalhes:** Modal (mais familiar, funciona bem mobile)
4. **Fetch por materia vs endpoint unico:** Por materia inicialmente (reutiliza API existente)

## Riscos e Mitigacoes

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|---------------|---------|-----------|
| Performance com muitas atividades | Baixa | Medio | Paginacao/lazy loading futuro |
| Complexidade do calendario custom | Media | Baixo | Comecar simples, iterar |
| Links quebrados de rotas antigas | Alta | Alto | Redirect das rotas removidas |

## Criterios de Aceite

- [ ] Calendario exibe mes atual corretamente
- [ ] Navegacao entre meses funciona
- [ ] Atividades aparecem nos dias corretos
- [ ] Cores correspondem aos tipos
- [ ] Tooltip aparece no hover
- [ ] Modal abre ao clicar no dia
- [ ] Filtro por materia funciona
- [ ] Filtro por tipo funciona
- [ ] Botao adicionar tarefa funciona
- [ ] Legenda visivel e correta
- [ ] Responsivo em mobile
- [ ] Rotas antigas redirecionam corretamente
