package com.dev.SistemaAgendamento.repository;

import com.dev.SistemaAgendamento.entity.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {

    @Query("""
            SELECT COUNT(c) > 0 FROM Consulta c
            WHERE c.medico.id = :medicoId
            AND c.status <> 'CANCELADO'
            AND c.dataHoraInicio < :fim
            AND c.dataHoraFim > :inicio
            """)
    boolean existeConflito(
            @Param("medicoId") Long medicoId,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim
    );
}
