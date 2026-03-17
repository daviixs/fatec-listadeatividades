CREATE TABLE lembrete_assinante (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_envio TIMESTAMP NULL
);

CREATE TABLE lembrete_assinante_sala (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assinante_id BIGINT NOT NULL,
    sala_id INTEGER NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_las_assinante FOREIGN KEY (assinante_id) REFERENCES lembrete_assinante(id) ON DELETE CASCADE,
    CONSTRAINT fk_las_sala FOREIGN KEY (sala_id) REFERENCES sala_de_aula(id) ON DELETE CASCADE,
    CONSTRAINT uk_las_assinante_sala UNIQUE (assinante_id, sala_id)
);

CREATE TABLE lembrete_envio_job (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slot_inicio TIMESTAMP NOT NULL,
    slot_fim TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL,
    data_inicio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_fim TIMESTAMP NULL,
    erro TEXT NULL,
    CONSTRAINT uk_lej_slot UNIQUE (slot_inicio)
);

CREATE TABLE lembrete_envio_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    assinante_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL,
    tentativas INT NOT NULL DEFAULT 0,
    provedor_message_id VARCHAR(255) NULL,
    erro TEXT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NULL,
    CONSTRAINT fk_lei_job FOREIGN KEY (job_id) REFERENCES lembrete_envio_job(id) ON DELETE CASCADE,
    CONSTRAINT fk_lei_assinante FOREIGN KEY (assinante_id) REFERENCES lembrete_assinante(id) ON DELETE CASCADE,
    CONSTRAINT uk_lei_job_assinante UNIQUE (job_id, assinante_id)
);
