# Design: Tema Brutalista Acadêmico (todo o front)

## Contexto e objetivo
- Redesenhar todas as áreas (pública, admin, master) com estética cartaz brutalista acadêmica, mobile-first e totalmente responsiva.
- Priorizar clareza de informação para alunos e admins, mantendo impacto visual e hierarquia rígida.

## Escopo
- Layout base (Header, Sidebar, main).
- UI kit (botões, inputs, cards, badges, toasts, tabelas/listas).
- Páginas: Home, Período/Semestres, Calendário do semestre, Admin dashboard, Admin Atividades/Provas, Master Admin dashboards.
- Navegação mobile (sidebar overlay) e desktop (sidebar fixa).

## Direção estética
- Paleta: paper #f7f3eb, ink #0b0b0b, accent amarelo marcatexto #f4e409, graphite #222, alert #d92a2a, muted #b8b1a3.
- Brutalismo cartaz: blocos de alto contraste, borda grossa (3px), sombras duras sem blur (0 6px 0 ink).
- Tipografia: títulos em slab serif pesada (IBM Plex Serif 800); corpo/labels em mono (IBM Plex Mono 500/700).

## Tokens e estilo global
- Arquivo `src/styles/brutalismo.css` com CSS vars: cores, espelhamento de borda (`--border-thick:3px`), `--radius:6px` (uso raro), espaçamentos base 4px (4/8/12/16/24/32).
- Body: fundo paper, texto ink, anti-aliased; largura máxima 1100px em desktop para preservar proporção de cartaz.
- Sombra padrão: `box-shadow: 0 6px 0 var(--ink);` estados hover aumentam para 10px e deslocam -2px.

## Layout & navegação
- Header faixa preta fina com breadcrumbs em mono uppercase; logo/título em slab branco.
- Sidebar preta em desktop; em mobile vira overlay com backdrop paper e botão X grosso.
- Faixas divisórias entre seções: linha 3px preta com label mono uppercase.
- Estrutura mobile-first (coluna); em desktop abre colunas conforme necessário, mantendo densidade controlada.

## Componentes
- Botões: sólido (preto texto paper), outline (paper borda preta), warning (amarelo texto preto). Hover desloca -2px + sombra 10px; active volta ao plano.
- Inputs/selects: moldura 3px preta; foco troca fundo para amarelo claro e borda alert; labels mono uppercase 11–12px.
- Cards/blocos: papel ou preto invertido; numeração grande “01/02/03” no canto; divisor grosso abaixo do título; espaço para ações inferior.
- Badges: retângulo borda 2px preta; estados: hoje (amarelo), pendente (preto invertido), entregue (paper com borda preta), alerta (vermelho).
- Tabelas/listas: barras horizontais grossas separando blocos; zebra opcional cinza suave; headings mono uppercase.
- Toasts/feedback: fundo preto texto paper; sucesso em amarelo; erro em vermelho.

## Páginas
- Home: faixa superior preta “FATEC LISTA DE ATIVIDADES / 2026”; cards de cursos numerados (01 ADS, 02 DSM...) com botão “ENTRAR” amarelo.
- Período/Semestres: timeline vertical preta com marcadores amarelos; cada bloco paper com divisor grosso e CTA “ver calendário”.
- Calendário do semestre: header preto com curso/semestre; colunas por semana como módulos; atividades em blocos empilhados com badges de status.
- Admin dashboard: 2 colunas em desktop; métricas em cards pretos, listas de atividades/provas em paper; CTAs grandes amarelos.
- Admin Atividades/Provas: lista com barras grossas, filtros em faixa preta, botões de ação amarelos; estados com badges.
- Master admin: grid de cards fichário (borda 3px, slab título, mono subtítulo), status por badge.

## Responsividade
- Mobile-first: empilhamento vertical; sidebar overlay; tipografia reduzida 1–2 steps; espaçamentos 12–16px.
- Desktop: max-width 1100px, colunas para dashboards, grid de cards 2–3 colunas; manter proporção cartaz (margens amplas).
- Touch-friendly: hit areas mín. 44px; botões e listas com padding vertical generoso.

## Acessibilidade
- Contraste forte por padrão (preto/paper). Acento amarelo acompanhado de borda preta para garantir contraste.
- Foco visível (outline 3px amarelo/alert sobre borda preta).
- Texto uppercase apenas em labels; conteúdo principal mantém caso para legibilidade.

## Riscos e mitigação
- Peso tipográfico: garantir fallback seguro (serif/mono nativos) caso fonte falhe.
- Sombra dura pode parecer “heavy” em telas menores; ajustar deslocamento no breakpoint XS se necessário.
- Manter consistência de borda/sombra entre libs existentes (shadcn/base-ui); padronizar wrappers.

## Próximos passos
1) Implementar tokens em `src/styles/brutalismo.css` e aplicar no entry (`index.css`/`App` providers).  
2) Refatorar layout base (Header/Sidebar) para faixas pretas e overlay mobile.  
3) Atualizar UI kit (botões, inputs, cards, badges, toasts).  
4) Aplicar novo layout/padrão nas páginas listadas, priorizando Home → Período/Semestres → Calendário → Admin → Master.  
5) Ajustes responsivos finais e QA de contraste/foco.
