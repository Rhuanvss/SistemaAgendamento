package com.dev.SistemaAgendamento.service;

import com.dev.SistemaAgendamento.entity.Especialidade;
import com.dev.SistemaAgendamento.repository.EspecialidadeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EspecialidadeServiceTest {

    @Mock
    private EspecialidadeRepository especialidadeRepository;

    @InjectMocks
    private EspecialidadeService especialidadeService;

    @Test
    void salvarEspecialidade_quandoNomeVazio_lancaExcecao() {
        Especialidade especialidade = novaEspecialidade();
        especialidade.setNome("  ");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> especialidadeService.salvarEspecialidade(especialidade));

        assertEquals("O nome da especialidade é obrigatório.", exception.getMessage());
        verify(especialidadeRepository, never()).save(any(Especialidade.class));
    }

    @Test
    void salvarEspecialidade_quandoPrecoInvalido_lancaExcecao() {
        Especialidade especialidade = novaEspecialidade();
        especialidade.setPreco(BigDecimal.ZERO);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> especialidadeService.salvarEspecialidade(especialidade));

        assertEquals("O preço da especialidade deve ser maior que zero.", exception.getMessage());
        verify(especialidadeRepository, never()).save(any(Especialidade.class));
    }

    @Test
    void salvarEspecialidade_quandoDuracaoInvalida_lancaExcecao() {
        Especialidade especialidade = novaEspecialidade();
        especialidade.setDuracao(0);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> especialidadeService.salvarEspecialidade(especialidade));

        assertEquals("A duração da especialidade deve ser maior que zero.", exception.getMessage());
        verify(especialidadeRepository, never()).save(any(Especialidade.class));
    }

    @Test
    void salvarEspecialidade_quandoValida_salva() {
        Especialidade especialidade = novaEspecialidade();
        when(especialidadeRepository.save(especialidade)).thenReturn(especialidade);

        Especialidade resultado = especialidadeService.salvarEspecialidade(especialidade);

        assertSame(especialidade, resultado);
        verify(especialidadeRepository).save(especialidade);
    }

    @Test
    void deletarEspecialidade_quandoNaoExiste_lancaExcecao() {
        Long id = 20L;
        when(especialidadeRepository.existsById(id)).thenReturn(false);

        NoSuchElementException exception = assertThrows(NoSuchElementException.class,
                () -> especialidadeService.deletarEspecialidade(id));

        assertEquals("Especialidade não encontrada com id: " + id, exception.getMessage());
        verify(especialidadeRepository, never()).deleteById(id);
    }

    @Test
    void deletarEspecialidade_quandoExiste_deleta() {
        Long id = 21L;
        when(especialidadeRepository.existsById(id)).thenReturn(true);

        especialidadeService.deletarEspecialidade(id);

        verify(especialidadeRepository).deleteById(id);
    }

    private Especialidade novaEspecialidade() {
        Especialidade especialidade = new Especialidade(
                "Dermatologia",
                new BigDecimal("150.00"),
                25
        );
        especialidade.setId(5L);
        return especialidade;
    }
}
