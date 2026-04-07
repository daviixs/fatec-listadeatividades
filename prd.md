# PRD - Seu Calendário Acadêmico

**Data:** 2026-04-07  
**Status:** Draft consolidado a partir do frontend, backend e documentos do repositório  
**Base da análise:** React/Vite no `frontend/`, backend Spring Boot em `src/main/java`, e planos em `docs/plans/`

## 1. Visão Geral do Produto

### Nome do produto
**Seu Calendário Acadêmico**

### Problema que resolve
Alunos de ensino superior convivem com prazos, provas, trabalhos, horários e mudanças de sala espalhados entre WhatsApp, Teams, avisos informais e plataformas institucionais pouco amigáveis no celular. Ao mesmo tempo, representantes de turma e operação acadêmica não têm uma camada simples para organizar, aprovar e distribuir essas informações por sala.

### Proposta de valor
Uma plataforma web mobile-first que centraliza o calendário acadêmico por curso, turno, semestre e sala, permitindo:
- consulta pública rápida sem fricção;
- organização visual das entregas em calendário mensal;
- colaboração da turma para registrar novas atividades;
- moderação por responsável da sala;
- lembretes automáticos por e-mail;
- governança operacional por master admin.

### Público-alvo
**Primário**
- Alunos de graduação tecnológica e cursos com dinâmica de turma/sala fixa.

**Secundário**
- Representantes de sala, líderes de turma ou monitores responsáveis por manter a agenda atualizada.

**Terciário**
- Coordenação acadêmica, operação interna ou equipe de suporte que precisa visibilidade global sobre salas, atividades e assinaturas.

### Contexto do estágio atual
O código indica um produto em estágio beta/piloto, já com experiência pública funcional de calendário por semestre, painel admin por sala, disparo de lembretes por e-mail, página pública de horários e dashboard master admin. Há também capacidades backend parcialmente expostas para entrada/aprovação de alunos e votação de cancelamento de atividades.

## 2. Objetivos do Produto

### Objetivos principais
1. Reduzir o atrito para o aluno descobrir prazos e provas da própria turma.
2. Aumentar a confiabilidade e a atualização da agenda acadêmica por sala.
3. Criar uma camada leve de governança para líderes de turma e operação.
4. Melhorar recorrência de uso com lembretes e retorno frequente ao calendário.
5. Preparar a base para expansão multi-sala e multi-instituição.

### Métricas de sucesso (KPIs)
| KPI | Meta inicial | Observação |
|---|---|---|
| Taxa de abertura do calendário após seleção de curso/turno/semestre | > 85% | Mede sucesso do fluxo principal |
| Tempo até visualizar o calendário da sala | < 3s p95 | Inclui carregamento de `GET /api/salas/{salaId}/calendario` |
| Retenção semanal de alunos ativos | > 35% | Indica valor recorrente |
| % de salas com pelo menos 1 atividade atualizada nos últimos 7 dias | > 70% | Mede saúde operacional |
| Conversão para lembrete por e-mail | > 12% dos visitantes do calendário | Relevante porque já existe CTA claro no produto |
| SLA de aprovação de atividade sugerida | < 24h | Importante se o fluxo de colaboração for moderado |
| Taxa de sucesso dos envios de e-mail | > 98% | Associado ao job de lembretes |
| % de atividades registradas antes do prazo em mais de 24h | > 80% | Qualidade do conteúdo |

## 3. Personas

### Persona 1: Aluno mobile-first
**Descrição**
- Estuda em um curso como ADS, DSM, GPI ou GRH.
- Acessa majoritariamente pelo celular.
- Não quer navegar em múltiplos sistemas para descobrir prazos.

**Dores principais**
- Perde prova ou trabalho porque a informação chega fragmentada.
- Não lembra em qual matéria ou dia está cada entrega.
- Tem baixa tolerância a login complexo e navegação lenta.

**Comportamentos**
- Entra rápido, consulta o mês, filtra por matéria e sai.
- Usa mais em véspera de prazo, semana de provas e início de semestre.
- Valoriza lembretes por e-mail para não depender só de mensagens informais.

### Persona 2: Representante de sala
**Descrição**
- É a pessoa informalmente responsável por consolidar avisos da turma.
- Precisa publicar e revisar atividades com agilidade.

**Dores principais**
- Recebe informação por vários canais e precisa repassar manualmente.
- Não quer manter planilha paralela ou responder dúvida repetida da turma.
- Pode errar dados sem uma camada de revisão.

**Comportamentos**
- Usa painel administrativo da sala com frequência semanal.
- Aprova, rejeita, edita e remove atividades.
- Trabalha por exceção: entra para revisar pendências e provas.

### Persona 3: Operação / Master Admin
**Descrição**
- Papel interno com visão global do sistema.
- Precisa manter integridade operacional, limpar dados errados e monitorar uso.

**Dores principais**
- Falta visibilidade sobre salas, atividades e e-mails cadastrados.
- Precisa resolver problemas sem depender de acesso manual ao banco.
- Quer governança mínima para um produto escalável.

**Comportamentos**
- Acessa dashboards de manutenção.
- Faz ações de limpeza e suporte.
- Observa volume de salas, atividades e assinantes ativos.

## 4. Jornada do Usuário

### Fluxo principal de uso: aluno
1. O aluno acessa a home e escolhe o curso.
2. Seleciona o turno em que estuda.
3. Escolhe o semestre.
4. O sistema resolve a sala correta com base na rota e carrega o calendário consolidado da sala.
5. O aluno visualiza o mês atual com atividades, provas e trabalhos.
6. Filtra por matéria e tipo para reduzir ruído.
7. Clica em um dia para ver detalhes, orientações e link de entrega.
8. Opcionalmente assina lembretes por e-mail da sala.
9. Retorna ao produto de forma recorrente pelo navegador ou após receber um lembrete.

### Fluxo secundário: colaboração da turma
1. O aluno ou colaborador abre o calendário da sala.
2. Clica em “Adicionar atividade”.
3. Preenche título, descrição, tipo, prazo, matéria e modo de entrega.
4. O sistema registra a atividade para aquela sala/matéria.
5. O responsável da sala revisa ou ajusta o conteúdo conforme a política de moderação vigente.

### Fluxo secundário: líder de sala
1. O líder acessa `/admin`.
2. Faz login com código da sala e segredo.
3. Entra no dashboard da sala com visão de pendências, total de atividades e provas.
4. Revisa atividades, aprova/rejeita, edita ou exclui registros.
5. Mantém a agenda confiável para a turma.

### Fluxo secundário: master admin
1. O operador acessa `/master-admin/login`.
2. Faz autenticação com credenciais globais.
3. Monitora e-mails cadastrados, atividades e salas.
4. Remove dados inválidos ou duplicados.
5. Atua como camada de suporte e governança da plataforma.

## 5. Funcionalidades (Features)

## MVP (essencial)

### Feature 1: Navegação pública por curso, turno e semestre
**Descrição**
- Permitir que o aluno encontre sua turma em poucos toques sem exigir login.

**Valor para o usuário**
- Reduz fricção de entrada e acelera o acesso à informação.

**Critérios de aceitação**
- O usuário consegue navegar de `Home -> Turno -> Semestre -> Calendário`.
- O sistema exibe cursos e semestres disponíveis de forma clara e mobile-first.
- Rotas inválidas redirecionam ou apresentam erro amigável.

### Feature 2: Calendário mensal consolidado da sala
**Descrição**
- Exibir todas as atividades, provas e trabalhos da sala em uma única visão mensal.

**Valor para o usuário**
- Dá visão de carga acadêmica e datas críticas em um formato mais útil do que listas longas.

**Critérios de aceitação**
- O calendário carrega a sala correta a partir da rota.
- Dias com atividades possuem indicadores visuais.
- Atividades canceladas não aparecem no fluxo principal do aluno.
- O botão “Hoje” reposiciona a visão no mês atual.

### Feature 3: Filtros por matéria e tipo
**Descrição**
- Permitir refinamento por matéria e por tipo de item acadêmico.

**Valor para o usuário**
- Ajuda o aluno a focar apenas no que importa naquele momento.

**Critérios de aceitação**
- O aluno pode filtrar por matéria específica ou ver todas.
- O aluno pode ligar/desligar Atividade, Prova e Trabalho.
- A atualização dos resultados acontece sem recarregar a página.

### Feature 4: Detalhe diário da agenda
**Descrição**
- Abrir modal com informações completas do dia selecionado.

**Valor para o usuário**
- Centraliza detalhes de prazo, instruções e links sem sair da tela.

**Critérios de aceitação**
- Ao clicar em um dia, o modal lista todos os itens daquele dia.
- Cada item mostra matéria, prazo, modo de entrega, descrição e status.
- Se houver `linkEntrega`, o usuário consegue abrir o destino externo.

### Feature 5: Cadastro colaborativo de atividades
**Descrição**
- Permitir que a turma adicione novas atividades diretamente pela interface pública do calendário.

**Valor para o usuário**
- Aumenta a velocidade de atualização do calendário e reduz dependência de um único mantenedor.

**Critérios de aceitação**
- O formulário exige matéria, título, descrição, prazo, regras e tipo.
- `linkEntrega` só é obrigatório quando o tipo de entrega for link externo.
- A atividade criada é vinculada à matéria correta da sala ativa.
- Após sucesso, a agenda é recarregada e o novo item fica disponível conforme a política de aprovação.

### Feature 6: Painel admin por sala
**Descrição**
- Área autenticada por sala para revisar e manter atividades.

**Valor para o usuário**
- Dá controle operacional ao líder da turma sem exigir um backoffice complexo.

**Critérios de aceitação**
- O login exige código da sala e segredo.
- O painel mostra contadores de total, pendentes, aprovadas e provas.
- O admin consegue listar, criar, editar, aprovar, rejeitar e excluir atividades da sala.

### Feature 7: Lembretes por e-mail por sala
**Descrição**
- Permitir assinatura de lembretes e disparos automáticos consolidados.

**Valor para o usuário**
- Reduz esquecimento e gera recorrência de uso mesmo fora do navegador.

**Critérios de aceitação**
- O aluno informa e-mail a partir da página do calendário.
- O sistema salva vínculo entre e-mail e sala.
- Novos assinantes recebem mensagem de boas-vindas.
- O backend processa janelas automáticas de envio e não duplica envios no mesmo ciclo.

### Feature 8: Página pública de horários
**Descrição**
- Página dedicada para consulta de horários por curso, turno e semestre.

**Valor para o usuário**
- Complementa o calendário de entregas com visão de rotina acadêmica.

**Critérios de aceitação**
- O usuário consegue filtrar curso, turno e semestre.
- A tabela responde à busca textual por disciplina ou dia.
- A experiência funciona em mobile e desktop.

## Fase 2 (expansão)

### Feature 9: Fluxo de entrada e aprovação de aluno por sala
**Descrição**
- Formalizar o acesso do aluno à sala por solicitação, aprovação e status.

**Valor para o usuário**
- Gera identidade mínima por sala e habilita regras mais fortes para votação e moderação.

**Critérios de aceitação**
- O aluno solicita entrada usando código da sala, RM e nome.
- O líder consegue aprovar ou rejeitar entradas pendentes.
- O status fica consultável até a decisão final.

### Feature 10: Votação de cancelamento de atividade
**Descrição**
- Permitir votação estruturada para cancelamento de atividade, com quorum por sala.

**Valor para o usuário**
- Formaliza acordos de turma e reduz conflitos informais.

**Critérios de aceitação**
- Cada atividade elegível pode ter no máximo uma votação aberta.
- A votação expira em janela definida.
- Apenas aluno aprovado pode votar.
- A atividade é cancelada automaticamente quando atingir a meta definida.

### Feature 11: Backoffice master admin
**Descrição**
- Consolidar visão global de salas, atividades e assinantes.

**Valor para o usuário**
- Dá escalabilidade operacional e reduz intervenção por banco de dados.

**Critérios de aceitação**
- O master admin consegue listar e excluir salas, atividades e e-mails.
- O acesso exige autenticação dedicada.
- A remoção respeita integridade dos dados relacionados.

### Feature 12: Monitoramento operacional de lembretes
**Descrição**
- Expor status de jobs, falhas por item e métricas básicas de entrega.

**Valor para o usuário**
- Melhora a confiabilidade do canal de notificação.

**Critérios de aceitação**
- Cada janela de envio gera job rastreável.
- Cada assinante processado possui status por item.
- O sistema distingue envio bem-sucedido, falha e “sem pendências”.

### Feature 13: Gestão dinâmica de horários
**Descrição**
- Migrar horários hoje hardcoded no frontend para fonte dinâmica administrável.

**Valor para o usuário**
- Elimina manutenção manual duplicada e melhora confiabilidade dos dados.

**Critérios de aceitação**
- Horários deixam de depender de arquivo local.
- Existe modelo consistente por curso, turno e semestre.
- Alterações refletem na página pública sem novo deploy do frontend.

## Fase 3 (escala)

### Feature 14: Multi-tenant institucional
**Descrição**
- Suportar múltiplas instituições, cursos e unidades com isolamento lógico.

**Valor para o usuário**
- Transforma o produto em plataforma SaaS escalável.

**Critérios de aceitação**
- Dados de uma instituição não vazam para outra.
- Branding e configuração podem ser parametrizados por tenant.
- Permissões administrativas passam a considerar tenant e escopo.

### Feature 15: Integrações com LMS/ERP/SSO
**Descrição**
- Integrar com sistemas acadêmicos existentes para sincronizar turmas, disciplinas e autenticação.

**Valor para o usuário**
- Reduz trabalho manual e aumenta aderência institucional.

**Critérios de aceitação**
- O sistema consegue importar turmas e disciplinas de fonte externa.
- Login institucional pode substituir autenticação manual em contas elegíveis.
- Jobs de sincronização registram sucesso e falha.

### Feature 16: Notificações push e app mobile
**Descrição**
- Levar o produto para experiência mais recorrente com push nativo ou PWA avançado.

**Valor para o usuário**
- Aumenta retenção e reduz dependência do e-mail.

**Critérios de aceitação**
- O usuário pode optar por push.
- O disparo respeita preferências e contexto da sala.
- Métricas de entrega e abertura são registradas.

### Feature 17: Inteligência de uso e analytics acadêmico
**Descrição**
- Gerar relatórios de engajamento, previsibilidade de picos e saúde operacional por turma.

**Valor para o usuário**
- Permite priorização de ações e mensuração de valor institucional.

**Critérios de aceitação**
- Dashboards exibem engajamento por sala e por período.
- Métricas podem ser filtradas por curso e semestre.
- Dados respeitam política de privacidade e anonimização quando aplicável.

## 6. Requisitos Funcionais

1. O sistema deve listar cursos, turnos e semestres em uma navegação pública simples.
2. O sistema deve identificar a sala correta a partir da combinação de curso, turno e semestre.
3. O sistema deve retornar calendário consolidado por sala com matérias e atividades em uma única resposta.
4. O sistema deve exibir atividades por tipo: atividade, prova e trabalho.
5. O sistema deve ocultar da experiência principal itens cancelados.
6. O sistema deve permitir filtragem por matéria e tipo sem recarregar a página.
7. O sistema deve exibir detalhes completos de um dia selecionado.
8. O sistema deve permitir cadastro de atividade associado à matéria da sala ativa.
9. O sistema deve permitir login de admin por sala.
10. O sistema deve permitir ao admin listar, criar, editar, aprovar, rejeitar e excluir atividades da sua sala.
11. O sistema deve oferecer assinatura de lembretes por e-mail por sala.
12. O sistema deve enviar mensagem de boas-vindas ao novo assinante quando aplicável.
13. O sistema deve processar lembretes em janelas agendadas e evitar duplicidade no mesmo slot.
14. O sistema deve disponibilizar uma página pública de horários com filtros.
15. O sistema deve permitir autenticação master admin e visão global de operação.
16. O sistema deve permitir exclusão administrativa de salas, atividades e assinantes em escopos autorizados.
17. O sistema deve suportar solicitação e aprovação de entrada em sala para fluxos que exigem identidade mínima.
18. O sistema deve suportar votação de cancelamento de atividade com regras de elegibilidade e quorum.
19. O sistema deve registrar erros de negócio com mensagens padronizadas para frontend.
20. O sistema deve expor endpoints de saúde e observabilidade para operação.

## 7. Requisitos Não Funcionais

### Performance
- Carregamento do calendário principal em até 3 segundos p95 em condições normais de rede.
- APIs públicas críticas com tempo médio abaixo de 500 ms e p95 abaixo de 1,2 s.
- Uso de cache para listagens de salas, matérias e calendário agregado.

### Segurança
- Endpoints administrativos devem ser protegidos por autenticação forte e autorização por escopo.
- Segredos não devem ficar expostos em texto puro no cliente como solução final de produção.
- O sistema deve registrar trilha de auditoria para ações administrativas críticas.
- Dados pessoais mínimos, como e-mail e identificação estudantil, devem seguir LGPD.

### Escalabilidade
- A arquitetura deve suportar separação entre frontend, API, banco e cache.
- Jobs de lembrete devem ser idempotentes e preparados para retry.
- O produto deve evoluir para multi-tenant sem refatoração estrutural total.

### Disponibilidade
- Meta inicial de disponibilidade: 99,5% mensal.
- Endpoints de saúde, métricas e logs estruturados devem estar disponíveis para operação.
- Falhas em integrações externas, como e-mail, não devem derrubar o fluxo principal do aluno.

### Confiabilidade e observabilidade
- Jobs de lembrete precisam registrar status por execução e por destinatário.
- Erros de backend devem ser rastreáveis por request e por contexto funcional.
- Métricas mínimas: acessos ao calendário, conversão em lembretes, falhas de envio, volume de atividades por sala.

### Usabilidade e acessibilidade
- O produto deve ser mobile-first.
- Áreas clicáveis devem respeitar mínimo de toque confortável.
- Contraste e foco visível devem atender padrões básicos de acessibilidade.

## 8. Arquitetura Sugerida

### Stack recomendada
- **Frontend:** React 19 + Vite + TypeScript + React Router
- **Backend:** Spring Boot 4 + Java 17 + Spring Web + Validation + Security + JPA
- **Banco transacional:** PostgreSQL
- **Cache e apoio operacional:** Redis
- **Migrações:** Flyway
- **E-mail transacional:** Resend
- **Observabilidade:** Spring Actuator + logs estruturados + provedor de métricas

### Backend
- Manter arquitetura por domínio/serviço.
- Consolidar endpoints agregados como `calendario por sala` para evitar fan-out excessivo no frontend.
- Evoluir autenticação para tokens com expiração, revogação e escopo por papel.
- Encapsular regras de lembrete, votação e aprovação em serviços separados.

### Frontend
- Manter experiência web mobile-first com rotas públicas e áreas autenticadas separadas.
- Reduzir dependência de catálogos hardcoded no cliente ao longo do tempo.
- Centralizar tipagem de domínio e contratos de API.
- Instrumentar eventos de uso para analytics de produto.

### Infraestrutura (cloud)
**Configuração recomendada para estágio atual**
- Frontend em Vercel.
- Backend containerizado em Fly.io, Render ou Cloud Run.
- PostgreSQL gerenciado.
- Redis gerenciado.

**Evolução para escala**
- Backend stateless com autoscaling.
- Banco com backups automáticos e read replicas quando necessário.
- Fila ou worker dedicado para envio de lembretes em alto volume.
- CDN e cache de borda para assets do frontend.

## 9. Modelo de Negócio

### Como o produto ganha dinheiro
Modelo recomendado: **B2B2C SaaS para instituições, coordenadorias ou grupos educacionais**, com o aluno como usuário final e a instituição como pagadora principal.

### Estratégias de monetização
- Assinatura mensal por instituição ou por conjunto de cursos.
- Cobrança por número de salas ativas ou alunos ativos.
- Setup fee para onboarding institucional e importação inicial de dados.
- Add-ons para integrações, branding white-label e analytics avançado.

### Possíveis planos / pricing
**Plano Piloto**
- Gratuito ou baixo custo.
- Até 3 cursos, operação manual, lembretes básicos.
- Objetivo: validação e prova de valor.

**Plano Pro Acadêmico**
- Faixa sugerida: **R$ 299 a R$ 799/mês**.
- Múltiplas salas, lembretes automáticos, dashboard admin, master admin básico.
- Indicado para coordenadorias menores ou unidades piloto.

**Plano Institucional**
- Preço customizado.
- Multi-curso, multi-campus, SSO, integrações, SLA e suporte.

## 10. Riscos e Assunções

### Riscos técnicos
- O mapeamento atual entre rota pública, catálogo local e nome real da sala é frágil e dependente de convenção.
- Parte dos dados ainda está hardcoded no frontend, especialmente horários e catálogo estrutural.
- O fluxo de segurança atual é simples demais para escala institucional.
- O cadastro colaborativo de atividades pode gerar spam, duplicidade ou baixa confiança se não houver moderação robusta.
- Dependência de e-mail como canal principal pode reduzir efetividade em públicos de baixa abertura.

### Riscos de mercado
- A instituição pode considerar suficiente o LMS já existente e não priorizar mais uma ferramenta.
- A adoção pode cair se representantes de sala não mantiverem o conteúdo atualizado.
- O valor percebido pode ficar limitado se o produto não se integrar aos sistemas acadêmicos oficiais.

### Assunções feitas
- O produto mira inicialmente cursos superiores no contexto brasileiro, com forte uso mobile.
- Existe ao menos um responsável por sala disposto a manter ou revisar atividades.
- O calendário acadêmico é um problema recorrente e mal resolvido pelos canais atuais.
- E-mail é um canal aceitável no curto prazo, antes de push/mobile app.
- A presença de módulos backend para votação e entrada em sala indica direção de produto, mesmo sem UX completa no frontend atual.
- O posicionamento ideal é de plataforma institucional escalável, não apenas ferramenta informal de turma.

## 11. Roadmap Inicial

### 0-30 dias
- Consolidar visão de produto e narrativa comercial.
- Endurecer segurança das áreas admin e master admin.
- Instrumentar analytics básicos de uso do calendário.
- Formalizar política de moderação para atividades criadas pela turma.
- Corrigir dependências frágeis entre catálogo local e dados do backend.

### 30-60 dias
- Expor no frontend o fluxo de entrada/aprovação por sala.
- Expor a votação de cancelamento com UX completa.
- Criar visão operacional de jobs de lembrete e falhas.
- Migrar horários para backend ou CMS simples.
- Melhorar governança e auditoria de ações administrativas.

### 60-90 dias
- Preparar modelo multi-tenant.
- Definir billing, onboarding e estratégia de rollout institucional.
- Iniciar integrações com SSO/LMS/ERP prioritários.
- Evoluir notificações para push/PWA.
- Criar dashboards de produto e operação para retenção, cobertura e uso.

## 12. Diferenciais Competitivos

1. **Acesso público sem fricção**: o aluno chega ao calendário por curso, turno e semestre sem onboarding pesado.
2. **Experiência centrada em calendário**: o produto organiza a vida acadêmica em torno do mês letivo, não de listas soltas.
3. **Colaboração com governança**: combina contribuição da turma com revisão por admin da sala.
4. **Camada leve de operação**: master admin resolve problemas sem depender de intervenção técnica.
5. **Lembretes consolidados por sala**: aumenta recorrência e utilidade prática.
6. **Base para regras coletivas da turma**: a votação de cancelamento cria um diferencial raro em produtos acadêmicos leves.
7. **Adequação ao contexto brasileiro**: fluxo, linguagem e estrutura por sala/turno/semestre aderem ao uso real de faculdades e FATECs.

## Conclusão

O produto já ultrapassou a ideia de um simples calendário estudantil. A leitura do front e do backend mostra uma plataforma acadêmica leve de coordenação por sala, com três pilares claros: consulta pública rápida, colaboração moderada e operação governada. O próximo salto não é adicionar mais telas, e sim transformar essa base em um produto institucional confiável, seguro e vendável.
