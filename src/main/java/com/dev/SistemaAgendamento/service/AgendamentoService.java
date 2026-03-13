package com.dev.SistemaAgendamento.service;

import com.dev.SistemaAgendamento.entity.Agendamento;
import com.dev.SistemaAgendamento.entity.Servico;
import com.dev.SistemaAgendamento.entity.Usuario;
import com.dev.SistemaAgendamento.enums.StatusAgendamento;
import com.dev.SistemaAgendamento.repository.AgendamentoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final UsuarioService usuarioService;
    private final ServicoService servicoService;

    public AgendamentoService(AgendamentoRepository agendamentoRepository,
                              UsuarioService usuarioService,
                              ServicoService servicoService) {
        this.agendamentoRepository = agendamentoRepository;
        this.usuarioService = usuarioService;
        this.servicoService = servicoService;
    }

    public List<Agendamento> listarAgendamentos() {
        return agendamentoRepository.findAll();
    }

    public Agendamento buscarPorId(Long id) {
        return agendamentoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Agendamento não encontrado com id: " + id));
    }

    public Agendamento criarAgendamento(Long clienteId, Long servicoId, LocalDateTime dataHoraInicio) {
        Usuario cliente = usuarioService.buscarPorId(clienteId);
        Servico servico = servicoService.buscarPorId(servicoId);

        if (dataHoraInicio == null) {
            throw new IllegalArgumentException("A data e hora de início são obrigatórias.");
        }

        if (dataHoraInicio.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("O agendamento não pode ser realizado para uma data/hora no passado.");
        }

        LocalDateTime dataHoraFim = dataHoraInicio.plusMinutes(servico.getDuracao());

        if (agendamentoRepository.existeConflito(servicoId, dataHoraInicio, dataHoraFim)) {
            throw new IllegalArgumentException("Já existe um agendamento para este serviço no horário solicitado.");
        }

        Agendamento agendamento = new Agendamento(cliente, servico, dataHoraInicio, dataHoraFim, StatusAgendamento.PENDENTE);
        return agendamentoRepository.save(agendamento);
    }

    public Agendamento confirmarAgendamento(Long id) {
        Agendamento agendamento = buscarPorId(id);

        if (agendamento.getStatus() != StatusAgendamento.PENDENTE) {
            throw new IllegalStateException("Apenas agendamentos com status PENDENTE podem ser confirmados.");
        }

        agendamento.setStatus(StatusAgendamento.CONFIRMADO);
        return agendamentoRepository.save(agendamento);
    }

    public Agendamento concluirAgendamento(Long id) {
        Agendamento agendamento = buscarPorId(id);

        if (agendamento.getStatus() != StatusAgendamento.CONFIRMADO) {
            throw new IllegalStateException("Apenas agendamentos com status CONFIRMADO podem ser concluídos.");
        }

        agendamento.setStatus(StatusAgendamento.CONCLUIDO);
        return agendamentoRepository.save(agendamento);
    }

    public Agendamento cancelarAgendamento(Long id) {
        Agendamento agendamento = buscarPorId(id);

        if (agendamento.getStatus() == StatusAgendamento.CONCLUIDO) {
            throw new IllegalStateException("Agendamentos já concluídos não podem ser cancelados.");
        }

        if (agendamento.getStatus() == StatusAgendamento.CANCELADO) {
            throw new IllegalStateException("Este agendamento já está cancelado.");
        }

        agendamento.setStatus(StatusAgendamento.CANCELADO);
        return agendamentoRepository.save(agendamento);
    }

    public void deletarAgendamento(Long id) {
        if (!agendamentoRepository.existsById(id)) {
            throw new NoSuchElementException("Agendamento não encontrado com id: " + id);
        }

        agendamentoRepository.deleteById(id);
    }
}
