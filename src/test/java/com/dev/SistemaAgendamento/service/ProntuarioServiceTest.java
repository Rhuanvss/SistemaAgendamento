package com.dev.SistemaAgendamento.service;

import com.dev.SistemaAgendamento.entity.Consulta;
import com.dev.SistemaAgendamento.entity.Prontuario;
import com.dev.SistemaAgendamento.enums.StatusConsulta;
import com.dev.SistemaAgendamento.repository.ProntuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
class ProntuarioServiceTest {

    @Mock
    private ProntuarioRepository prontuarioRepository;

    @Mock
    private ConsultaService consultaService;

    @InjectMocks
    private ProntuarioService prontuarioService;

    @Test
    void listarProntuarios_retornaLista() {
        when(prontuarioRepository.findAll()).thenReturn(java.util.List.of(novoProntuario()));

        assertEquals(1, prontuarioService.listarProntuarios().size());
        verify(prontuarioRepository).findAll();
    }

    @Test
    void buscarPorId_quandoExiste_retornaProntuario() {
        Prontuario prontuario = novoProntuario();
        Long id = 100L;
        when(prontuarioRepository.findById(id)).thenReturn(Optional.of(prontuario));

        Prontuario resultado = prontuarioService.buscarPorId(id);

        assertSame(prontuario, resultado);
        verify(prontuarioRepository).findById(id);
    }

    @Test
    void buscarPorId_quandoNaoExiste_lancaExcecao() {
        Long id = 101L;
        when(prontuarioRepository.findById(id)).thenReturn(Optional.empty());

        NoSuchElementException exception = assertThrows(NoSuchElementException.class,
                () -> prontuarioService.buscarPorId(id));

        assertEquals("Prontuário não encontrado com id: " + id, exception.getMessage());
    }

    @Test
    void criarProntuario_quandoConsultaNaoConcluida_lancaExcecao() {
        Consulta consulta = novaConsulta(StatusConsulta.CONFIRMADO);
        Long consultaId = 5L;
        when(consultaService.buscarPorId(consultaId)).thenReturn(consulta);

        IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> prontuarioService.criarProntuario(consultaId, "desc", "diag", "presc"));

        assertEquals("O prontuário só pode ser criado para consultas com status CONCLUIDO.", exception.getMessage());
        verify(prontuarioRepository, never()).save(any(Prontuario.class));
    }

    @Test
    void criarProntuario_quandoJaExiste_lancaExcecao() {
        Consulta consulta = novaConsulta(StatusConsulta.CONCLUIDO);
        Long consultaId = 6L;
        when(consultaService.buscarPorId(consultaId)).thenReturn(consulta);
        when(prontuarioRepository.existsByConsultaId(consultaId)).thenReturn(true);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> prontuarioService.criarProntuario(consultaId, "desc", "diag", "presc"));

        assertEquals("Já existe um prontuário para esta consulta.", exception.getMessage());
        verify(prontuarioRepository, never()).save(any(Prontuario.class));
    }

    @Test
    void criarProntuario_quandoValido_salva() {
        Consulta consulta = novaConsulta(StatusConsulta.CONCLUIDO);
        Long consultaId = 7L;
        when(consultaService.buscarPorId(consultaId)).thenReturn(consulta);
        when(prontuarioRepository.existsByConsultaId(consultaId)).thenReturn(false);
        when(prontuarioRepository.save(any(Prontuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Prontuario resultado = prontuarioService.criarProntuario(consultaId, "desc", "diag", "presc");

        assertSame(consulta, resultado.getConsulta());
        assertEquals("desc", resultado.getDescricao());
        assertEquals("diag", resultado.getDiagnostico());
        assertEquals("presc", resultado.getPrescricao());
        verify(prontuarioRepository).save(any(Prontuario.class));
    }

    @Test
    void deletarProntuario_quandoNaoExiste_lancaExcecao() {
        Long id = 8L;
        when(prontuarioRepository.existsById(id)).thenReturn(false);

        NoSuchElementException exception = assertThrows(NoSuchElementException.class,
                () -> prontuarioService.deletarProntuario(id));

        assertEquals("Prontuário não encontrado com id: " + id, exception.getMessage());
        verify(prontuarioRepository, never()).deleteById(id);
    }

    @Test
    void deletarProntuario_quandoExiste_deleta() {
        Long id = 9L;
        when(prontuarioRepository.existsById(id)).thenReturn(true);

        prontuarioService.deletarProntuario(id);

        verify(prontuarioRepository).deleteById(id);
    }

    private Prontuario novoProntuario() {
        Prontuario prontuario = new Prontuario();
        prontuario.setId(200L);
        return prontuario;
    }

    private Consulta novaConsulta(StatusConsulta status) {
        Consulta consulta = new Consulta();
        consulta.setId(300L);
        consulta.setStatus(status);
        return consulta;
    }
}
