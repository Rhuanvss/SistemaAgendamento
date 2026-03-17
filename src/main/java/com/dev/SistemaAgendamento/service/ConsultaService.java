package com.dev.SistemaAgendamento.service;

import com.dev.SistemaAgendamento.entity.Consulta;
import com.dev.SistemaAgendamento.entity.Especialidade;
import com.dev.SistemaAgendamento.entity.Medico;
import com.dev.SistemaAgendamento.entity.Paciente;
import com.dev.SistemaAgendamento.enums.StatusConsulta;
import com.dev.SistemaAgendamento.repository.ConsultaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ConsultaService {

    private final ConsultaRepository consultaRepository;
    private final PacienteService pacienteService;
    private final MedicoService medicoService;
    private final EspecialidadeService especialidadeService;

    public ConsultaService(ConsultaRepository consultaRepository,
                           PacienteService pacienteService,
                           MedicoService medicoService,
                           EspecialidadeService especialidadeService) {
        this.consultaRepository = consultaRepository;
        this.pacienteService = pacienteService;
        this.medicoService = medicoService;
        this.especialidadeService = especialidadeService;
    }

    public List<Consulta> listarConsultas() {
        return consultaRepository.findAll();
    }

    public Consulta buscarPorId(Long id) {
        return consultaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Consulta não encontrada com id: " + id));
    }

    public Consulta criarConsulta(Long pacienteId, Long medicoId, Long especialidadeId,
                                   LocalDateTime dataHoraInicio) {
        Paciente paciente = pacienteService.buscarPorId(pacienteId);
        Medico medico = medicoService.buscarPorId(medicoId);
        Especialidade especialidade = especialidadeService.buscarPorId(especialidadeId);

        boolean medicoTemEspecialidade = medico.getEspecialidades().stream()
                .anyMatch(e -> e.getId().equals(especialidadeId));

        if (!medicoTemEspecialidade) {
            throw new IllegalArgumentException("O médico não possui a especialidade solicitada.");
        }

        if (dataHoraInicio == null) {
            throw new IllegalArgumentException("A data e hora de início são obrigatórias.");
        }

        if (dataHoraInicio.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("A consulta não pode ser agendada para uma data/hora no passado.");
        }

        LocalDateTime dataHoraFim = dataHoraInicio.plusMinutes(especialidade.getDuracao());

        if (consultaRepository.existeConflito(medicoId, dataHoraInicio, dataHoraFim)) {
            throw new IllegalArgumentException("Já existe uma consulta agendada para este médico no horário solicitado.");
        }

        Consulta consulta = new Consulta(paciente, medico, especialidade, dataHoraInicio, dataHoraFim, StatusConsulta.PENDENTE);
        return consultaRepository.save(consulta);
    }

    public Consulta confirmarConsulta(Long id) {
        Consulta consulta = buscarPorId(id);

        if (consulta.getStatus() != StatusConsulta.PENDENTE) {
            throw new IllegalStateException("Apenas consultas com status PENDENTE podem ser confirmadas.");
        }

        consulta.setStatus(StatusConsulta.CONFIRMADO);
        return consultaRepository.save(consulta);
    }

    public Consulta concluirConsulta(Long id) {
        Consulta consulta = buscarPorId(id);

        if (consulta.getStatus() != StatusConsulta.CONFIRMADO) {
            throw new IllegalStateException("Apenas consultas com status CONFIRMADO podem ser concluídas.");
        }

        consulta.setStatus(StatusConsulta.CONCLUIDO);
        return consultaRepository.save(consulta);
    }

    public Consulta cancelarConsulta(Long id) {
        Consulta consulta = buscarPorId(id);

        if (consulta.getStatus() == StatusConsulta.CONCLUIDO) {
            throw new IllegalStateException("Consultas já concluídas não podem ser canceladas.");
        }

        if (consulta.getStatus() == StatusConsulta.CANCELADO) {
            throw new IllegalStateException("Esta consulta já está cancelada.");
        }

        consulta.setStatus(StatusConsulta.CANCELADO);
        return consultaRepository.save(consulta);
    }

    public void deletarConsulta(Long id) {
        if (!consultaRepository.existsById(id)) {
            throw new NoSuchElementException("Consulta não encontrada com id: " + id);
        }

        consultaRepository.deleteById(id);
    }
}
