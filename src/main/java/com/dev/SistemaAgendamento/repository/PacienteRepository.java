package com.dev.SistemaAgendamento.repository;

import com.dev.SistemaAgendamento.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);
}
