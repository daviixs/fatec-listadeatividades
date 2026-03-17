# Design: mapeamento estrito de matéria na tela de atividades

Data: 2026-03-17  
Status: Aprovado

## Contexto

A tela de atividades usa fallback para matéria quando não encontra correspondência exata. Isso causa:
- aviso indesejado na UI;
- risco de rota diferente apontar para a mesma matéria real;
- atividade parecer "em todas as matérias" quando o `materiaId` resolvido é o mesmo por fallback.

## Objetivo

1. Remover completamente o fallback de matéria.
2. Garantir vínculo estrito por `curso + período + semestre + matéria` da rota.
3. Ajustar o bloco "Nenhuma atividade cadastrada" para o tema da página principal.

## Decisão técnica

### 1) Resolução estrita de sala
- Resolver uma sala por contexto da rota (`courseId`, `periodId`, `semesterId`) com regras fixas.
- Sem varredura por "melhor match" com troca automática para outra sala.

### 2) Resolução estrita de matéria
- Matéria da rota é obtida por `subjectId` no catálogo local.
- Buscar essa matéria dentro da sala ativa por nome normalizado (acento/case/pontuação).
- Sem fallback para primeira matéria ou similaridade por tokens.

### 3) Listagem e criação
- Listagem: `GET /api/materias/{materiaId}/atividades`.
- Criação: `POST /api/atividades` com `materiaId` estrito da rota.
- Resultado: atividades isoladas por matéria (e, por consequência, por curso/período/semestre/sala).

### 4) UX
- Remover banner de aviso de fallback de matéria.
- Reestilizar estado vazio para o mesmo idioma visual da área principal:
  - superfície clara;
  - borda e tipografia consistentes;
  - CTA principal coerente.

## Critérios de aceite

1. A mensagem "A matéria ... não foi encontrada exatamente..." não aparece mais.
2. Criar atividade em uma matéria não impacta listagem de outra matéria.
3. Estado "Nenhuma atividade cadastrada" visualmente integrado ao tema principal.
4. Build frontend com `npx vite build` concluído.
