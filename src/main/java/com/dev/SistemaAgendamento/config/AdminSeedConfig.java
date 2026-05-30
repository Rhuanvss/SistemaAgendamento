package com.dev.SistemaAgendamento.config;

import com.dev.SistemaAgendamento.entity.Usuario;
import com.dev.SistemaAgendamento.enums.Role;
import com.dev.SistemaAgendamento.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class AdminSeedConfig {

    @Bean
    CommandLineRunner seedAdminUser(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String email = System.getenv("ADMIN_EMAIL");
            String senha = System.getenv("ADMIN_PASSWORD");

            if (email == null || email.isBlank() || senha == null || senha.isBlank()) {
                System.out.println("ADMIN_EMAIL/ADMIN_PASSWORD não definidos. Seed de admin ignorado.");
                return;
            }

            if (usuarioRepository.existsByEmail(email)) {
                System.out.println("Usuário admin já existe. Seed de admin ignorado.");
                return;
            }

            Usuario admin = new Usuario();
            admin.setEmail(email);
            admin.setSenhaHash(passwordEncoder.encode(senha));
            admin.setRoles(Set.of(Role.ADMIN));
            usuarioRepository.save(admin);
            System.out.println("Usuário admin criado com sucesso.");
        };
    }
}
