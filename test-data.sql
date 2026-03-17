-- Criar assinante de teste
INSERT INTO lembrete_assinante (email, ativo, data_cadastro)
VALUES ('xaviersilvadavi@gmail.com', true, CURRENT_TIMESTAMP);

-- Buscar ID da sala criada (DSM 1° Manhã - semestre 1)
-- ID da sala: 1 (gerado pelo H2)
-- ID da matéria: 1 (primeira matéria dessa sala)

-- Criar preferência do assinante para a sala 1
INSERT INTO lembrete_assinante_sala (assinante_id, sala_id, ativo, data_cadastro)
SELECT id, 1, true, CURRENT_TIMESTAMP FROM lembrete_assinante WHERE email = 'xaviersilvadavi@gmail.com';

-- Criar uma atividade de teste na matéria 1
INSERT INTO atividade (titulo, descricao, regras, prazo, tipo_entrega, materia_id, data, status)
VALUES (
    'Entrega de Projeto Final',
    'Entregue o projeto final do semestre via link externo.',
    'Entrega individual, prazo rigoroso.',
    CURRENT_DATE + INTERVAL '7 DAY',
    'LINK_EXTERNO',
    1,
    CURRENT_DATE,
    'ATIVA'
);

-- Verificar dados
SELECT * FROM lembrete_assinante WHERE email = 'xaviersilvadavi@gmail.com';
SELECT * FROM lembrete_assinante_sala WHERE assinante_id = (SELECT id FROM lembrete_assinante WHERE email = 'xaviersilvadavi@gmail.com');
SELECT * FROM atividade WHERE titulo = 'Entrega de Projeto Final';
