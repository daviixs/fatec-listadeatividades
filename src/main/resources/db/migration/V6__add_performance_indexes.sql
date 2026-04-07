CREATE INDEX IF NOT EXISTS idx_materia_sala_id ON materia (sala_id);

CREATE INDEX IF NOT EXISTS idx_atividade_materia_id ON atividade (materia_id);

CREATE INDEX IF NOT EXISTS idx_atividade_prazo ON atividade (prazo);

CREATE INDEX IF NOT EXISTS idx_atividade_status_prazo ON atividade (status, prazo);
