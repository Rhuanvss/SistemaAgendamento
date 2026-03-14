CREATE TABLE IF NOT EXISTS agendamento (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    servico_id BIGINT NOT NULL,
    data_hora_inicio TIMESTAMP NOT NULL,
    data_hora_fim TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL,
    CONSTRAINT fk_agendamento_cliente FOREIGN KEY (cliente_id) REFERENCES usuario(id),
    CONSTRAINT fk_agendamento_servico FOREIGN KEY (servico_id) REFERENCES servico(id)
);
