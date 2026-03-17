package com.dev.SistemaAgendamento.controller;

import com.dev.SistemaAgendamento.entity.Prontuario;
import com.dev.SistemaAgendamento.service.ProntuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prontuario")
public class ProntuarioController {

    private final ProntuarioService prontuarioService;

    public ProntuarioController(ProntuarioService prontuarioService) {
        this.prontuarioService = prontuarioService;
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Prontuario>> listarProntuarios() {
        return ResponseEntity.ok(prontuarioService.listarProntuarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prontuario> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(prontuarioService.buscarPorId(id));
    }

    @PostMapping("/adicionar")
    public ResponseEntity<Prontuario> criarProntuario(@RequestBody Map<String, Object> body) {
        Long consultaId = Long.valueOf(body.get("consultaId").toString());
        String descricao = body.get("descricao").toString();
        String diagnostico = body.get("diagnostico").toString();
        String prescricao = body.get("prescricao").toString();

        Prontuario prontuario = prontuarioService.criarProntuario(consultaId, descricao, diagnostico, prescricao);
        return ResponseEntity.status(HttpStatus.CREATED).body(prontuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProntuario(@PathVariable Long id) {
        prontuarioService.deletarProntuario(id);
        return ResponseEntity.noContent().build();
    }
}
