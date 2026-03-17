package com.dev.SistemaAgendamento.controller;

import com.dev.SistemaAgendamento.entity.Especialidade;
import com.dev.SistemaAgendamento.entity.Medico;
import com.dev.SistemaAgendamento.service.EspecialidadeService;
import com.dev.SistemaAgendamento.service.MedicoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medico")
public class MedicoController {

    private final MedicoService medicoService;
    private final EspecialidadeService especialidadeService;

    public MedicoController(MedicoService medicoService, EspecialidadeService especialidadeService) {
        this.medicoService = medicoService;
        this.especialidadeService = especialidadeService;
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Medico>> listarMedicos() {
        return ResponseEntity.ok(medicoService.listarMedicos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medico> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(medicoService.buscarPorId(id));
    }

    @PostMapping("/adicionar")
    public ResponseEntity<Medico> salvarMedico(@RequestBody Medico medico) {
        Medico salvo = medicoService.salvarMedico(medico);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PostMapping("/{id}/especialidade")
    public ResponseEntity<Medico> adicionarEspecialidade(@PathVariable Long id,
                                                          @RequestBody Map<String, Object> body) {
        Long especialidadeId = Long.valueOf(body.get("especialidadeId").toString());
        Especialidade especialidade = especialidadeService.buscarPorId(especialidadeId);
        Medico medico = medicoService.adicionarEspecialidade(id, especialidade);
        return ResponseEntity.ok(medico);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarMedico(@PathVariable Long id) {
        medicoService.deletarMedico(id);
        return ResponseEntity.noContent().build();
    }
}
