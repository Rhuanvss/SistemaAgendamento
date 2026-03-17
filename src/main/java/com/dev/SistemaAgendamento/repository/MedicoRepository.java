package com.dev.SistemaAgendamento.repository;

import com.dev.SistemaAgendamento.entity.Medico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicoRepository extends JpaRepository<Medico, Long> {

    boolean existsByEmail(String email);

    boolean existsByCrm(String crm);
}
