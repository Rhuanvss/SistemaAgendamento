package com.dev.SistemaAgendamento.controller;

import com.dev.SistemaAgendamento.dto.request.EspecialidadeRequestDTO;
import com.dev.SistemaAgendamento.dto.response.EspecialidadeResponseDTO;
import com.dev.SistemaAgendamento.entity.Especialidade;
import com.dev.SistemaAgendamento.service.EspecialidadeService;
import jakarta.validation.Valid;
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
    public ResponseEntity<List<EspecialidadeResponseDTO>> listarEspecialidades() {
        List<EspecialidadeResponseDTO> especialidades = especialidadeService.listarEspecialidades().stream()
                .map(this::toResponseDTO)
                .toList();
        return ResponseEntity.ok(especialidades);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EspecialidadeResponseDTO> buscarPorId(@PathVariable Long id) {
        Especialidade especialidade = especialidadeService.buscarPorId(id);
        return ResponseEntity.ok(toResponseDTO(especialidade));
    }

    @PostMapping
    public ResponseEntity<EspecialidadeResponseDTO> salvarEspecialidade(@RequestBody @Valid EspecialidadeRequestDTO dto) {
        Especialidade especialidade = toEntity(dto);
        Especialidade salva = especialidadeService.salvarEspecialidade(especialidade);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(salva));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarEspecialidade(@PathVariable Long id) {
        especialidadeService.deletarEspecialidade(id);
        return ResponseEntity.noContent().build();
    }

    private Especialidade toEntity(EspecialidadeRequestDTO dto) {
        Especialidade especialidade = new Especialidade();
        especialidade.setNome(dto.nome());
        especialidade.setPreco(dto.preco());
        especialidade.setDuracao(dto.duracao());
        return especialidade;
    }

    private EspecialidadeResponseDTO toResponseDTO(Especialidade especialidade) {
        return new EspecialidadeResponseDTO(
                especialidade.getId(),
                especialidade.getNome(),
                especialidade.getPreco(),
                especialidade.getDuracao()
        );
    }
}
