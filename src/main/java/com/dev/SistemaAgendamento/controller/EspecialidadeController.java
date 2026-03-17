package com.dev.SistemaAgendamento.controller;

import com.dev.SistemaAgendamento.entity.Especialidade;
import com.dev.SistemaAgendamento.service.EspecialidadeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/especialidade")
public class EspecialidadeController {

    private final EspecialidadeService especialidadeService;

    public EspecialidadeController(EspecialidadeService especialidadeService) {
        this.especialidadeService = especialidadeService;
    }

    @GetMapping
    public ResponseEntity<List<Especialidade>> listarEspecialidades() {
        return ResponseEntity.ok(especialidadeService.listarEspecialidades());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Especialidade> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(especialidadeService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Especialidade> salvarEspecialidade(@RequestBody Especialidade especialidade) {
        Especialidade salva = especialidadeService.salvarEspecialidade(especialidade);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarEspecialidade(@PathVariable Long id) {
        especialidadeService.deletarEspecialidade(id);
        return ResponseEntity.noContent().build();
    }
}
