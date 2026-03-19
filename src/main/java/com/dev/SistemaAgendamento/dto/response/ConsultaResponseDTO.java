package com.dev.SistemaAgendamento.dto.response;

import com.dev.SistemaAgendamento.enums.StatusConsulta;
import java.time.LocalDateTime;

public record ConsultaResponseDTO(
    Long id,
    PacienteResponseDTO paciente,
    MedicoResponseDTO medico,
    EspecialidadeResponseDTO especialidade,
    LocalDateTime dataHoraInicio,
    LocalDateTime dataHoraFim,
    StatusConsulta status
) {}
