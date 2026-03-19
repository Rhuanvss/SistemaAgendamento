package com.dev.SistemaAgendamento.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record MedicoRequestDTO(
    @NotBlank(message = "O nome é obrigatório")
    String nome,

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "E-mail com formato inválido")
    String email,

    @NotBlank(message = "O telefone é obrigatório")
    String telefone,

    @NotBlank(message = "O CRM é obrigatório")
    String crm,

    @NotEmpty(message = "O médico deve ter pelo menos uma especialidade")
    List<Long> especialidadesIds
) {}
