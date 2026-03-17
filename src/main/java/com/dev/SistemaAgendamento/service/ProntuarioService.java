package com.dev.SistemaAgendamento.service;

import com.dev.SistemaAgendamento.entity.Consulta;
import com.dev.SistemaAgendamento.entity.Prontuario;
import com.dev.SistemaAgendamento.enums.StatusConsulta;
import com.dev.SistemaAgendamento.repository.ProntuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ProntuarioService {

    private final ProntuarioRepository prontuarioRepository;
    private final ConsultaService consultaService;

    public ProntuarioService(ProntuarioRepository prontuarioRepository, ConsultaService consultaService) {
        this.prontuarioRepository = prontuarioRepository;
        this.consultaService = consultaService;
    }

    public List<Prontuario> listarProntuarios() {
        return prontuarioRepository.findAll();
    }

    public Prontuario buscarPorId(Long id) {
        return prontuarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Prontuário não encontrado com id: " + id));
    }

    public Prontuario criarProntuario(Long consultaId, String descricao, String diagnostico, String prescricao) {
        Consulta consulta = consultaService.buscarPorId(consultaId);

        if (consulta.getStatus() != StatusConsulta.CONCLUIDO) {
            throw new IllegalStateException("O prontuário só pode ser criado para consultas com status CONCLUIDO.");
        }

        if (prontuarioRepository.existsByConsultaId(consultaId)) {
            throw new IllegalArgumentException("Já existe um prontuário para esta consulta.");
        }

        Prontuario prontuario = new Prontuario(consulta, descricao, diagnostico, prescricao);
        return prontuarioRepository.save(prontuario);
    }

    public void deletarProntuario(Long id) {
        if (!prontuarioRepository.existsById(id)) {
            throw new NoSuchElementException("Prontuário não encontrado com id: " + id);
        }

        prontuarioRepository.deleteById(id);
    }
}
