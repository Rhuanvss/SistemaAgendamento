package com.dev.SistemaAgendamento.controller;

import com.dev.SistemaAgendamento.dto.request.MedicoRequestDTO;
import com.dev.SistemaAgendamento.dto.response.EspecialidadeResponseDTO;
import com.dev.SistemaAgendamento.dto.response.MedicoResponseDTO;
import com.dev.SistemaAgendamento.entity.Especialidade;
import com.dev.SistemaAgendamento.entity.Medico;
import com.dev.SistemaAgendamento.service.EspecialidadeService;
import com.dev.SistemaAgendamento.service.MedicoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

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
    public ResponseEntity<List<MedicoResponseDTO>> listarMedicos() {
        List<MedicoResponseDTO> medicos = medicoService.listarMedicos().stream()
                .map(this::toResponseDTO)
                .toList();
        return ResponseEntity.ok(medicos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicoResponseDTO> buscarPorId(@PathVariable Long id) {
        Medico medico = medicoService.buscarPorId(id);
        return ResponseEntity.ok(toResponseDTO(medico));
    }

    @PostMapping("/adicionar")
    public ResponseEntity<MedicoResponseDTO> salvarMedico(@RequestBody @Valid MedicoRequestDTO dto) {
        Medico medico = toEntity(dto);
        Medico salvo = medicoService.salvarMedico(medico);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(salvo));
    }

    @PostMapping("/{id}/especialidade")
    public ResponseEntity<MedicoResponseDTO> adicionarEspecialidade(@PathVariable Long id,
                                                          @RequestBody Map<String, Object> body) {
        Long especialidadeId = Long.valueOf(body.get("especialidadeId").toString());
        Especialidade especialidade = especialidadeService.buscarPorId(especialidadeId);
        Medico medico = medicoService.adicionarEspecialidade(id, especialidade);
        return ResponseEntity.ok(toResponseDTO(medico));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarMedico(@PathVariable Long id) {
        medicoService.deletarMedico(id);
        return ResponseEntity.noContent().build();
    }

    private Medico toEntity(MedicoRequestDTO dto) {
        Medico medico = new Medico();
        medico.setNome(dto.nome());
        medico.setEmail(dto.email());
        medico.setTelefone(dto.telefone());
        medico.setCrm(dto.crm());
        
        List<Especialidade> especialidades = new ArrayList<>();
        if (dto.especialidadesIds() != null) {
            for (Long especialidadeId : dto.especialidadesIds()) {
                especialidades.add(especialidadeService.buscarPorId(especialidadeId));
            }
        }
        medico.setEspecialidades(especialidades);
        
        return medico;
    }

    private MedicoResponseDTO toResponseDTO(Medico medico) {
        List<EspecialidadeResponseDTO> especialidadesDTO = new ArrayList<>();
        if (medico.getEspecialidades() != null) {
            especialidadesDTO = medico.getEspecialidades().stream()
                    .map(e -> new EspecialidadeResponseDTO(e.getId(), e.getNome(), e.getPreco(), e.getDuracao()))
                    .toList();
        }
        
        return new MedicoResponseDTO(
                medico.getId(),
                medico.getNome(),
                medico.getEmail(),
                medico.getTelefone(),
                medico.getCrm(),
                especialidadesDTO
        );
    }
}
