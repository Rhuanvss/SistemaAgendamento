package com.dev.SistemaAgendamento.controller;

import com.dev.SistemaAgendamento.dto.request.PacienteRequestDTO;
import com.dev.SistemaAgendamento.dto.response.PacienteResponseDTO;
import com.dev.SistemaAgendamento.entity.Paciente;
import com.dev.SistemaAgendamento.service.PacienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paciente")
public class PacienteController {

    private final PacienteService pacienteService;

    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    @GetMapping("/listar")
    public ResponseEntity<List<PacienteResponseDTO>> listarPacientes() {
        List<PacienteResponseDTO> pacientes = pacienteService.listarPacientes().stream()
                .map(this::toResponseDTO)
                .toList();
        return ResponseEntity.ok(pacientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacienteResponseDTO> buscarPorId(@PathVariable Long id) {
        Paciente paciente = pacienteService.buscarPorId(id);
        return ResponseEntity.ok(toResponseDTO(paciente));
    }

    @PostMapping("/adicionar")
    public ResponseEntity<PacienteResponseDTO> salvarPaciente(@RequestBody @Valid PacienteRequestDTO dto) {
        Paciente paciente = toEntity(dto);
        Paciente salvo = pacienteService.salvarPaciente(paciente);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(salvo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPaciente(@PathVariable Long id) {
        pacienteService.deletarPaciente(id);
        return ResponseEntity.noContent().build();
    }

    private Paciente toEntity(PacienteRequestDTO dto) {
        Paciente paciente = new Paciente();
        paciente.setNome(dto.nome());
        paciente.setEmail(dto.email());
        paciente.setTelefone(dto.telefone());
        paciente.setDataNascimento(dto.dataNascimento());
        paciente.setCpf(dto.cpf());
        return paciente;
    }

    private PacienteResponseDTO toResponseDTO(Paciente paciente) {
        return new PacienteResponseDTO(
                paciente.getId(),
                paciente.getNome(),
                paciente.getEmail(),
                paciente.getTelefone(),
                paciente.getDataNascimento(),
                paciente.getCpf()
        );
    }
}
