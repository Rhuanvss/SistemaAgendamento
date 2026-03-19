package com.dev.SistemaAgendamento.dto.response;

public record ProntuarioResponseDTO(
    Long id,
    Long consultaId,
    String descricao,
    String diagnostico,
    String prescricao
) {}
