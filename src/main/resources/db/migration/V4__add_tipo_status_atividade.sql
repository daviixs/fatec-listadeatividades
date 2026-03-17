-- Adicionar colunas para suporte ao painel admin por sala
-- Campo tipo para diferenciar ATIVIDADE, PROVA, TRABALHO
-- Campo status_aprovacao para fluxo de aprovação (PENDENTE, APROVADA, REJEITADA)
-- Campo criado_por_aluno_id para rastrear quem criou a atividade

ALTER TABLE atividade
ADD COLUMN tipo VARCHAR(20) DEFAULT 'ATIVIDADE' NOT NULL;

ALTER TABLE atividade
ADD COLUMN status_aprovacao VARCHAR(20) DEFAULT 'APROVADA' NOT NULL;

ALTER TABLE atividade
ADD COLUMN criado_por_aluno_id BIGINT;
