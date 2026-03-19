package com.dev.SistemaAgendamento.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProntuarioRequestDTO(
    @NotNull(message = "O ID da consulta é obrigatório")
    Long consultaId,

    @NotBlank(message = "A descrição é obrigatória")
    String descricao,

    @NotBlank(message = "O diagnóstico é obrigatório")
    String diagnostico,

    @NotBlank(message = "A prescrição é obrigatória")
    String prescricao
) {}
