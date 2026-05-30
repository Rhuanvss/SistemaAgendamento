package com.dev.SistemaAgendamento.controller;

import com.dev.SistemaAgendamento.dto.request.CreateUserRequest;
import com.dev.SistemaAgendamento.dto.request.LoginRequest;
import com.dev.SistemaAgendamento.dto.response.LoginResponse;
import com.dev.SistemaAgendamento.dto.response.UsuarioResponse;
import com.dev.SistemaAgendamento.entity.Usuario;
import com.dev.SistemaAgendamento.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final long expirationHours;

    public AuthController(
            AuthService authService,
            @Value("${security.jwt.expiration-hours:8}") long expirationHours
    ) {
        this.authService = authService;
        this.expirationHours = expirationHours;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        String token = authService.login(request.email(), request.senha());
        Instant expiresAt = Instant.now().plus(expirationHours, ChronoUnit.HOURS);
        return ResponseEntity.ok(new LoginResponse(token, expiresAt));
    }

    @PostMapping("/usuarios")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResponse> criarUsuario(@RequestBody @Valid CreateUserRequest request) {
        Usuario usuario = authService.criarUsuario(request.email(), request.senha(), request.roles());
        UsuarioResponse response = new UsuarioResponse(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getRoles(),
                usuario.isAtivo(),
                usuario.getCriadoEm()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/usuarios")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<java.util.List<UsuarioResponse>> listarUsuarios() {
        java.util.List<UsuarioResponse> usuarios = authService.listarUsuarios().stream()
                .map(usuario -> new UsuarioResponse(
                        usuario.getId(),
                        usuario.getEmail(),
                        usuario.getRoles(),
                        usuario.isAtivo(),
                        usuario.getCriadoEm()
                ))
                .toList();
        return ResponseEntity.ok(usuarios);
    }
}
