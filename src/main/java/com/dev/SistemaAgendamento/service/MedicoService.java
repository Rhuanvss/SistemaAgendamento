package com.dev.SistemaAgendamento.service;

import com.dev.SistemaAgendamento.entity.Especialidade;
import com.dev.SistemaAgendamento.entity.Medico;
import com.dev.SistemaAgendamento.repository.MedicoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class MedicoService {

    private final MedicoRepository medicoRepository;

    public MedicoService(MedicoRepository medicoRepository) {
        this.medicoRepository = medicoRepository;
    }

    public List<Medico> listarMedicos() {
        return medicoRepository.findAll();
    }

    public Medico buscarPorId(Long id) {
        return medicoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Médico não encontrado com id: " + id));
    }

    public Medico salvarMedico(Medico medico) {
        if (medicoRepository.existsByEmail(medico.getEmail())) {
            throw new IllegalArgumentException("Já existe um médico cadastrado com este e-mail.");
        }

        if (medicoRepository.existsByCrm(medico.getCrm())) {
            throw new IllegalArgumentException("Já existe um médico cadastrado com este CRM.");
        }

        return medicoRepository.save(medico);
    }

    public Medico adicionarEspecialidade(Long medicoId, Especialidade especialidade) {
        Medico medico = buscarPorId(medicoId);

        boolean jaTemEspecialidade = medico.getEspecialidades().stream()
                .anyMatch(e -> e.getId().equals(especialidade.getId()));

        if (jaTemEspecialidade) {
            throw new IllegalArgumentException("O médico já possui esta especialidade.");
        }

        medico.getEspecialidades().add(especialidade);
        return medicoRepository.save(medico);
    }

    public void deletarMedico(Long id) {
        if (!medicoRepository.existsById(id)) {
            throw new NoSuchElementException("Médico não encontrado com id: " + id);
        }

        medicoRepository.deleteById(id);
    }
}
