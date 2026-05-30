package com.dev.SistemaAgendamento.dto.response;

public record ProntuarioResponseDTO(
    Long id,
    Long consultaId,
    PacienteResumoDTO paciente,
    MedicoResumoDTO medico,
    java.time.LocalDateTime dataConsulta,
    String descricao,
    String diagnostico,
    String prescricao
) {}
