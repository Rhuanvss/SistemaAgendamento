package com.dev.SistemaAgendamento.service;

import com.dev.SistemaAgendamento.entity.Especialidade;
import com.dev.SistemaAgendamento.entity.Medico;
import com.dev.SistemaAgendamento.repository.MedicoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MedicoServiceTest {

    @Mock
    private MedicoRepository medicoRepository;

    @InjectMocks
    private MedicoService medicoService;

    @Test
    void listarMedicos_retornaLista() {
        List<Medico> medicos = List.of(novoMedico(), novoMedico());
        when(medicoRepository.findAll()).thenReturn(medicos);

        List<Medico> resultado = medicoService.listarMedicos();

        assertEquals(medicos, resultado);
        verify(medicoRepository).findAll();
    }

    @Test
    void buscarPorId_quandoExiste_retornaMedico() {
        Medico medico = novoMedico();
        Long id = 10L;
        when(medicoRepository.findById(id)).thenReturn(Optional.of(medico));

        Medico resultado = medicoService.buscarPorId(id);

        assertSame(medico, resultado);
        verify(medicoRepository).findById(id);
    }

    @Test
    void buscarPorId_quandoNaoExiste_lancaExcecao() {
        Long id = 11L;
        when(medicoRepository.findById(id)).thenReturn(Optional.empty());

        NoSuchElementException exception = assertThrows(NoSuchElementException.class,
                () -> medicoService.buscarPorId(id));

        assertEquals("Médico não encontrado com id: " + id, exception.getMessage());
    }

    @Test
    void salvarMedico_quandoEmailExiste_lancaExcecao() {
        Medico medico = novoMedico();
        when(medicoRepository.existsByEmail(medico.getEmail())).thenReturn(true);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> medicoService.salvarMedico(medico));

        assertEquals("Já existe um médico cadastrado com este e-mail.", exception.getMessage());
        verify(medicoRepository, never()).save(any(Medico.class));
    }

    @Test
    void salvarMedico_quandoCrmExiste_lancaExcecao() {
        Medico medico = novoMedico();
        when(medicoRepository.existsByEmail(medico.getEmail())).thenReturn(false);
        when(medicoRepository.existsByCrm(medico.getCrm())).thenReturn(true);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> medicoService.salvarMedico(medico));

        assertEquals("Já existe um médico cadastrado com este CRM.", exception.getMessage());
        verify(medicoRepository, never()).save(any(Medico.class));
    }

    @Test
    void salvarMedico_quandoValido_salvaMedico() {
        Medico medico = novoMedico();
        when(medicoRepository.existsByEmail(medico.getEmail())).thenReturn(false);
        when(medicoRepository.existsByCrm(medico.getCrm())).thenReturn(false);
        when(medicoRepository.save(medico)).thenReturn(medico);

        Medico resultado = medicoService.salvarMedico(medico);

        assertSame(medico, resultado);
        verify(medicoRepository).save(medico);
    }

    @Test
    void adicionarEspecialidade_quandoJaPossui_lancaExcecao() {
        Medico medico = novoMedico();
        Especialidade especialidade = novaEspecialidade();
        medico.setEspecialidades(List.of(especialidade));
        when(medicoRepository.findById(medico.getId())).thenReturn(Optional.of(medico));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> medicoService.adicionarEspecialidade(medico.getId(), especialidade));

        assertEquals("O médico já possui esta especialidade.", exception.getMessage());
        verify(medicoRepository, never()).save(any(Medico.class));
    }

    @Test
    void adicionarEspecialidade_quandoNaoPossui_adiciona() {
        Medico medico = novoMedico();
        Especialidade especialidade = novaEspecialidade();
        medico.setEspecialidades(new java.util.ArrayList<>());
        when(medicoRepository.findById(medico.getId())).thenReturn(Optional.of(medico));
        when(medicoRepository.save(medico)).thenReturn(medico);

        Medico resultado = medicoService.adicionarEspecialidade(medico.getId(), especialidade);

        assertSame(medico, resultado);
        assertEquals(1, medico.getEspecialidades().size());
        verify(medicoRepository).save(medico);
    }

    @Test
    void deletarMedico_quandoNaoExiste_lancaExcecao() {
        Long id = 12L;
        when(medicoRepository.existsById(id)).thenReturn(false);

        NoSuchElementException exception = assertThrows(NoSuchElementException.class,
                () -> medicoService.deletarMedico(id));

        assertEquals("Médico não encontrado com id: " + id, exception.getMessage());
        verify(medicoRepository, never()).deleteById(id);
    }

    @Test
    void deletarMedico_quandoExiste_deleta() {
        Long id = 13L;
        when(medicoRepository.existsById(id)).thenReturn(true);

        medicoService.deletarMedico(id);

        verify(medicoRepository).deleteById(id);
    }

    private Medico novoMedico() {
        Medico medico = new Medico(
                "Ana Lima",
                "ana.lima@example.com",
                "11988887777",
                "CRM1234"
        );
        medico.setId(10L);
        return medico;
    }

    private Especialidade novaEspecialidade() {
        Especialidade especialidade = new Especialidade(
                "Cardiologia",
                new BigDecimal("200.00"),
                30
        );
        especialidade.setId(99L);
        return especialidade;
    }
}
