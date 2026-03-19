package com.dev.SistemaAgendamento.controller;

import com.dev.SistemaAgendamento.dto.request.ConsultaRequestDTO;
import com.dev.SistemaAgendamento.dto.response.ConsultaResponseDTO;
import com.dev.SistemaAgendamento.dto.response.EspecialidadeResponseDTO;
import com.dev.SistemaAgendamento.dto.response.MedicoResponseDTO;
import com.dev.SistemaAgendamento.dto.response.PacienteResponseDTO;
import com.dev.SistemaAgendamento.entity.Consulta;
import com.dev.SistemaAgendamento.entity.Especialidade;
import com.dev.SistemaAgendamento.entity.Medico;
import com.dev.SistemaAgendamento.entity.Paciente;
import com.dev.SistemaAgendamento.service.ConsultaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/consulta")
public class ConsultaController {

    private final ConsultaService consultaService;

    public ConsultaController(ConsultaService consultaService) {
        this.consultaService = consultaService;
    }

    @GetMapping("/listar")
    public ResponseEntity<List<ConsultaResponseDTO>> listarConsultas() {
        List<ConsultaResponseDTO> consultas = consultaService.listarConsultas().stream()
                .map(this::toResponseDTO)
                .toList();
        return ResponseEntity.ok(consultas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsultaResponseDTO> buscarPorId(@PathVariable Long id) {
        Consulta consulta = consultaService.buscarPorId(id);
        return ResponseEntity.ok(toResponseDTO(consulta));
    }

    @PostMapping("/adicionar")
    public ResponseEntity<ConsultaResponseDTO> criarConsulta(@RequestBody @Valid ConsultaRequestDTO dto) {
        Consulta consulta = consultaService.criarConsulta(
            dto.pacienteId(), 
            dto.medicoId(), 
            dto.especialidadeId(), 
            dto.dataHoraInicio()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(consulta));
    }

    @PatchMapping("/{id}/confirmar")
    public ResponseEntity<ConsultaResponseDTO> confirmarConsulta(@PathVariable Long id) {
        return ResponseEntity.ok(toResponseDTO(consultaService.confirmarConsulta(id)));
    }

    @PatchMapping("/{id}/concluir")
    public ResponseEntity<ConsultaResponseDTO> concluirConsulta(@PathVariable Long id) {
        return ResponseEntity.ok(toResponseDTO(consultaService.concluirConsulta(id)));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<ConsultaResponseDTO> cancelarConsulta(@PathVariable Long id) {
        return ResponseEntity.ok(toResponseDTO(consultaService.cancelarConsulta(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarConsulta(@PathVariable Long id) {
        consultaService.deletarConsulta(id);
        return ResponseEntity.noContent().build();
    }

    private ConsultaResponseDTO toResponseDTO(Consulta consulta) {
        Paciente p = consulta.getPaciente();
        PacienteResponseDTO pacienteDTO = null;
        if (p != null) {
            pacienteDTO = new PacienteResponseDTO(p.getId(), p.getNome(), p.getEmail(), p.getTelefone(), p.getDataNascimento(), p.getCpf());
        }

        Medico m = consulta.getMedico();
        MedicoResponseDTO medicoDTO = null;
        if (m != null) {
            List<EspecialidadeResponseDTO> especialidadesDTO = new ArrayList<>();
            if (m.getEspecialidades() != null) {
                especialidadesDTO = m.getEspecialidades().stream()
                        .map(e -> new EspecialidadeResponseDTO(e.getId(), e.getNome(), e.getPreco(), e.getDuracao()))
                        .toList();
            }
            medicoDTO = new MedicoResponseDTO(m.getId(), m.getNome(), m.getEmail(), m.getTelefone(), m.getCrm(), especialidadesDTO);
        }

        Especialidade e = consulta.getEspecialidade();
        EspecialidadeResponseDTO especialidadeDTO = null;
        if (e != null) {
            especialidadeDTO = new EspecialidadeResponseDTO(e.getId(), e.getNome(), e.getPreco(), e.getDuracao());
        }

        return new ConsultaResponseDTO(
                consulta.getId(),
                pacienteDTO,
                medicoDTO,
                especialidadeDTO,
                consulta.getDataHoraInicio(),
                consulta.getDataHoraFim(),
                consulta.getStatus()
        );
    }
}
