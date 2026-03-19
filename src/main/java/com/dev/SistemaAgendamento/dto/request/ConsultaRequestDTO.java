package com.dev.SistemaAgendamento.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ConsultaRequestDTO(
    @NotNull(message = "O ID do paciente é obrigatório")
    Long pacienteId,

    @NotNull(message = "O ID do médico é obrigatório")
    Long medicoId,

    @NotNull(message = "O ID da especialidade é obrigatório")
    Long especialidadeId,

    @NotNull(message = "A data e hora de início é obrigatória")
    @FutureOrPresent(message = "A data e hora de início deve ser no presente ou futuro")
    LocalDateTime dataHoraInicio
) {}
