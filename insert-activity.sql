-- Criar atividade de teste
INSERT INTO atividade (titulo, descricao, regras, prazo, tipo_entrega, materia_id, data, status)
VALUES (
    'Entrega de Projeto Final',
    'Entregue o projeto final do semestre via link externo.',
    'Entrega individual, prazo rigoroso.',
    DATEADD('DAY', 7, CURRENT_DATE),
    'LINK_EXTERNO',
    1,
    CURRENT_DATE,
    'ATIVA'
);

-- Verificar atividade criada
SELECT * FROM atividade WHERE titulo = 'Entrega de Projeto Final';
