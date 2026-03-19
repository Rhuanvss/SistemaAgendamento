package com.dev.SistemaAgendamento.dto.response;

import java.math.BigDecimal;

public record EspecialidadeResponseDTO(
    Long id,
    String nome,
    BigDecimal preco,
    Integer duracao
) {}
