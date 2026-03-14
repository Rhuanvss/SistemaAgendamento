package com.dev.SistemaAgendamento.controller;

import com.dev.SistemaAgendamento.entity.Agendamento;
import com.dev.SistemaAgendamento.service.AgendamentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agendamento")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    public AgendamentoController(AgendamentoService agendamentoService) {
        this.agendamentoService = agendamentoService;
    }

    @GetMapping
    public ResponseEntity<List<Agendamento>> listarAgendamentos() {
        return ResponseEntity.ok(agendamentoService.listarAgendamentos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Agendamento> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(agendamentoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Agendamento> criarAgendamento(@RequestBody Map<String, Object> body) {
        Long clienteId = Long.valueOf(body.get("clienteId").toString());
        Long servicoId = Long.valueOf(body.get("servicoId").toString());
        LocalDateTime dataHoraInicio = LocalDateTime.parse(body.get("dataHoraInicio").toString());

        Agendamento agendamento = agendamentoService.criarAgendamento(clienteId, servicoId, dataHoraInicio);
        return ResponseEntity.status(HttpStatus.CREATED).body(agendamento);
    }

    @PatchMapping("/{id}/confirmar")
    public ResponseEntity<Agendamento> confirmarAgendamento(@PathVariable Long id) {
        return ResponseEntity.ok(agendamentoService.confirmarAgendamento(id));
    }

    @PatchMapping("/{id}/concluir")
    public ResponseEntity<Agendamento> concluirAgendamento(@PathVariable Long id) {
        return ResponseEntity.ok(agendamentoService.concluirAgendamento(id));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Agendamento> cancelarAgendamento(@PathVariable Long id) {
        return ResponseEntity.ok(agendamentoService.cancelarAgendamento(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAgendamento(@PathVariable Long id) {
        agendamentoService.deletarAgendamento(id);
        return ResponseEntity.noContent().build();
    }
}
