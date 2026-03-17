package com.dev.SistemaAgendamento.service;

import com.dev.SistemaAgendamento.entity.Paciente;
import com.dev.SistemaAgendamento.repository.PacienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;

    public PacienteService(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    public List<Paciente> listarPacientes() {
        return pacienteRepository.findAll();
    }

    public Paciente buscarPorId(Long id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Paciente não encontrado com id: " + id));
    }

    public Paciente salvarPaciente(Paciente paciente) {
        if (pacienteRepository.existsByEmail(paciente.getEmail())) {
            throw new IllegalArgumentException("Já existe um paciente cadastrado com este e-mail.");
        }

        if (pacienteRepository.existsByCpf(paciente.getCpf())) {
            throw new IllegalArgumentException("Já existe um paciente cadastrado com este CPF.");
        }

        return pacienteRepository.save(paciente);
    }

    public void deletarPaciente(Long id) {
        if (!pacienteRepository.existsById(id)) {
            throw new NoSuchElementException("Paciente não encontrado com id: " + id);
        }

        pacienteRepository.deleteById(id);
    }
}
