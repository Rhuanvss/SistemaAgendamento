package com.dev.SistemaAgendamento.controller;

import com.dev.SistemaAgendamento.dto.request.ProntuarioRequestDTO;
import com.dev.SistemaAgendamento.dto.response.ProntuarioResponseDTO;
import com.dev.SistemaAgendamento.entity.Prontuario;
import com.dev.SistemaAgendamento.service.ProntuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prontuario")
public class ProntuarioController {

    private final ProntuarioService prontuarioService;

    public ProntuarioController(ProntuarioService prontuarioService) {
        this.prontuarioService = prontuarioService;
    }

    @GetMapping("/listar")
    public ResponseEntity<List<ProntuarioResponseDTO>> listarProntuarios() {
        List<ProntuarioResponseDTO> prontuarios = prontuarioService.listarProntuarios().stream()
                .map(this::toResponseDTO)
                .toList();
        return ResponseEntity.ok(prontuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProntuarioResponseDTO> buscarPorId(@PathVariable Long id) {
        Prontuario prontuario = prontuarioService.buscarPorId(id);
        return ResponseEntity.ok(toResponseDTO(prontuario));
    }

    @PostMapping("/adicionar")
    public ResponseEntity<ProntuarioResponseDTO> criarProntuario(@RequestBody @Valid ProntuarioRequestDTO dto) {
        Prontuario prontuario = prontuarioService.criarProntuario(
            dto.consultaId(), 
            dto.descricao(), 
            dto.diagnostico(), 
            dto.prescricao()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(prontuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProntuario(@PathVariable Long id) {
        prontuarioService.deletarProntuario(id);
        return ResponseEntity.noContent().build();
    }

    private ProntuarioResponseDTO toResponseDTO(Prontuario prontuario) {
        Long consultaId = prontuario.getConsulta() != null ? prontuario.getConsulta().getId() : null;
        return new ProntuarioResponseDTO(
                prontuario.getId(),
                consultaId,
                prontuario.getDescricao(),
                prontuario.getDiagnostico(),
                prontuario.getPrescricao()
        );
    }
}
