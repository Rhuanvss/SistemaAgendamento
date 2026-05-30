package com.dev.SistemaAgendamento.service;

import com.dev.SistemaAgendamento.entity.Usuario;
import com.dev.SistemaAgendamento.enums.Role;
import com.dev.SistemaAgendamento.repository.UsuarioRepository;
import com.dev.SistemaAgendamento.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String login(String email, String senha) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, senha)
        );

        if (!authentication.isAuthenticated()) {
            throw new BadCredentialsException("Credenciais inválidas.");
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return jwtService.generateToken(userDetails);
    }

    public Usuario criarUsuario(String email, String senha, Set<String> roles) {
        if (usuarioRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Já existe um usuário com este e-mail.");
        }

        Set<Role> rolesEnum = roles.stream()
                .map(role -> {
                    try {
                        return Role.valueOf(role.toUpperCase());
                    } catch (IllegalArgumentException ex) {
                        throw new IllegalArgumentException("Role inválida: " + role);
                    }
                })
                .collect(Collectors.toSet());

        Usuario usuario = new Usuario();
        usuario.setEmail(email);
        usuario.setSenhaHash(passwordEncoder.encode(senha));
        usuario.setRoles(rolesEnum);
        return usuarioRepository.save(usuario);
    }

    public java.util.List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }
}
