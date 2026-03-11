package com.dev.SistemaAgendamento.repository;

import com.dev.SistemaAgendamento.entity.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    @Query("""
            SELECT COUNT(a) > 0 FROM Agendamento a
            WHERE a.servico.id = :servicoId
            AND a.status <> 'CANCELADO'
            AND a.dataHoraInicio < :fim
            AND a.dataHoraFim > :inicio
            """)
    boolean existeConflito(
            @Param("servicoId") Long servicoId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim
    );
}
