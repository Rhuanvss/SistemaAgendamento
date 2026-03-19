package com.dev.SistemaAgendamento.dto.response;

import java.util.List;

public record MedicoResponseDTO(
    Long id,
    String nome,
    String email,
    String telefone,
    String crm,
    List<EspecialidadeResponseDTO> especialidades
) {}
