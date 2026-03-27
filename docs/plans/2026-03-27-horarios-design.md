# Design: Página de Horários (tabela brutalista)

## Objetivo
Listar todos os horários de aula (todos os cursos/turnos/semestres) em uma página pública `/horarios`, com filtros simples, visual brutalista e mobile-first.

## Escopo
- Nova rota pública `/horarios` dentro do Layout principal.
- Entrada no menu lateral: “Horários”.
- Dados locais em `src/data/schedules.ts` (hardcoded).
- Tela com filtros (curso, turno, semestre) e busca opcional.
- Tabela brutalista com linhas filtradas.

## Arquitetura & Dados
- Estrutura de dados:
  ```ts
  type Slot = { dia: string; inicio: string; fim: string; disciplina: string };
  type Semester = { id: string; name: string; slots: Slot[] };
  type Turno = { id: "matutino" | "noturno"; name: string; semesters: Semester[] };
  type Course = { id: string; name: string; turnos: Turno[] };
  export const schedules: Course[];
  ```
- Conteúdo: usar os horários fornecidos (DSM, ADS, GPI, RH; matutino e noturno; 1º–6º).
- Estado da página: `selectedCourse`, `selectedTurno`, `selectedSemester`, `searchTerm`.
- Defaults: primeiro curso/turno/semestre da lista.
- Derivação: filtra slots por seleções e (se houver) busca textual.
- Sem CSV/export.

## UI/UX brutalista
- Faixa superior preta com título “HORÁRIOS DE AULA / 2026” e badge amarelo com contagem de linhas.
- Bloco de filtros em paper, borda 3px, sombra dura: selects de Curso/Turno/Semestre (mono uppercase) + campo de busca (opcional) + botão “Limpar”.
- Tabela: header fundo preto texto paper; linhas borda 3px, hover amarelo claro. Colunas: Dia | Início | Fim | Disciplina.
- Responsivo: mobile-first; filtros empilhados; tabela com scroll horizontal se necessário.
- Acessibilidade: foco visível em amarelo; fontes Plex mono/serif já definidas.

## Navegação
- Adicionar item “Horários” na Sidebar pública apontando para `/horarios`.
- Rota registrada em `src/routes/index.tsx` dentro do layout público.

## Riscos/Observações
- Volume de dados extenso; usar estrutura normalizada para manter legibilidade.
- Manutenção manual dos horários (hardcoded).

## Passos de implementação
1) Criar `src/data/schedules.ts` com estrutura normalizada e horários fornecidos.
2) Criar página `src/pages/Horarios.tsx` com filtros + tabela brutalista.
3) Registrar rota e entrada na Sidebar.
4) Validar responsividade e contraste.
