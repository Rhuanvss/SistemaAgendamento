package com.dev.SistemaAgendamento.dto.response;

import com.dev.SistemaAgendamento.enums.Role;

import java.time.LocalDateTime;
import java.util.Set;

public record UsuarioResponse(
        Long id,
        String email,
        Set<Role> roles,
        boolean ativo,
        LocalDateTime criadoEm
) {
}
