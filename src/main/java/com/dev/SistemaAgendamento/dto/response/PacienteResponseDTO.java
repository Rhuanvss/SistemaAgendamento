package com.dev.SistemaAgendamento.dto.response;

import java.time.LocalDate;

public record PacienteResponseDTO(
    Long id,
    String nome,
    String email,
    String telefone,
    LocalDate dataNascimento,
    String cpf
) {}
