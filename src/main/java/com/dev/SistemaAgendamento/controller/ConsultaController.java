package com.dev.SistemaAgendamento.controller;

import com.dev.SistemaAgendamento.entity.Consulta;
import com.dev.SistemaAgendamento.service.ConsultaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consulta")
public class ConsultaController {

    private final ConsultaService consultaService;

    public ConsultaController(ConsultaService consultaService) {
        this.consultaService = consultaService;
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Consulta>> listarConsultas() {
        return ResponseEntity.ok(consultaService.listarConsultas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Consulta> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.buscarPorId(id));
    }

    @PostMapping("/adicionar")
    public ResponseEntity<Consulta> criarConsulta(@RequestBody Map<String, Object> body) {
        Long pacienteId = Long.valueOf(body.get("pacienteId").toString());
        Long medicoId = Long.valueOf(body.get("medicoId").toString());
        Long especialidadeId = Long.valueOf(body.get("especialidadeId").toString());
        LocalDateTime dataHoraInicio = LocalDateTime.parse(body.get("dataHoraInicio").toString());

        Consulta consulta = consultaService.criarConsulta(pacienteId, medicoId, especialidadeId, dataHoraInicio);
        return ResponseEntity.status(HttpStatus.CREATED).body(consulta);
    }

    @PatchMapping("/{id}/confirmar")
    public ResponseEntity<Consulta> confirmarConsulta(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.confirmarConsulta(id));
    }

    @PatchMapping("/{id}/concluir")
    public ResponseEntity<Consulta> concluirConsulta(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.concluirConsulta(id));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Consulta> cancelarConsulta(@PathVariable Long id) {
        return ResponseEntity.ok(consultaService.cancelarConsulta(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarConsulta(@PathVariable Long id) {
        consultaService.deletarConsulta(id);
        return ResponseEntity.noContent().build();
    }
}
