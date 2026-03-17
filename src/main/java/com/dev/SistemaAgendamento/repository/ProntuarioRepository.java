package com.dev.SistemaAgendamento.repository;

import com.dev.SistemaAgendamento.entity.Prontuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProntuarioRepository extends JpaRepository<Prontuario, Long> {

    boolean existsByConsultaId(Long consultaId);
}
