package com.dev.SistemaAgendamento.dto.response;

import java.time.Instant;

public record LoginResponse(
        String token,
        Instant expiresAt
) {
}
