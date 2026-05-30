package com.dev.SistemaAgendamento.service;

import com.dev.SistemaAgendamento.entity.Paciente;
import com.dev.SistemaAgendamento.repository.PacienteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
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
class PacienteServiceTest {

    @Mock
    private PacienteRepository pacienteRepository;

    @InjectMocks
    private PacienteService pacienteService;

    @Test
    void listarPacientes_retornaLista() {
        List<Paciente> pacientes = List.of(novoPaciente(), novoPaciente());
        when(pacienteRepository.findAll()).thenReturn(pacientes);

        List<Paciente> resultado = pacienteService.listarPacientes();

        assertEquals(pacientes, resultado);
        verify(pacienteRepository).findAll();
    }

    @Test
    void buscarPorId_quandoExiste_retornaPaciente() {
        Paciente paciente = novoPaciente();
        Long id = 1L;
        when(pacienteRepository.findById(id)).thenReturn(Optional.of(paciente));

        Paciente resultado = pacienteService.buscarPorId(id);

        assertSame(paciente, resultado);
        verify(pacienteRepository).findById(id);
    }

    @Test
    void buscarPorId_quandoNaoExiste_lancaExcecao() {
        Long id = 2L;
        when(pacienteRepository.findById(id)).thenReturn(Optional.empty());

        NoSuchElementException exception = assertThrows(NoSuchElementException.class,
                () -> pacienteService.buscarPorId(id));

        assertEquals("Paciente não encontrado com id: " + id, exception.getMessage());
    }

    @Test
    void salvarPaciente_quandoEmailExiste_lancaExcecao() {
        Paciente paciente = novoPaciente();
        when(pacienteRepository.existsByEmail(paciente.getEmail())).thenReturn(true);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> pacienteService.salvarPaciente(paciente));

        assertEquals("Já existe um paciente cadastrado com este e-mail.", exception.getMessage());
        verify(pacienteRepository, never()).save(any(Paciente.class));
    }

    @Test
    void salvarPaciente_quandoCpfExiste_lancaExcecao() {
        Paciente paciente = novoPaciente();
        when(pacienteRepository.existsByEmail(paciente.getEmail())).thenReturn(false);
        when(pacienteRepository.existsByCpf(paciente.getCpf())).thenReturn(true);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> pacienteService.salvarPaciente(paciente));

        assertEquals("Já existe um paciente cadastrado com este CPF.", exception.getMessage());
        verify(pacienteRepository, never()).save(any(Paciente.class));
    }

    @Test
    void salvarPaciente_quandoValido_salvaPaciente() {
        Paciente paciente = novoPaciente();
        when(pacienteRepository.existsByEmail(paciente.getEmail())).thenReturn(false);
        when(pacienteRepository.existsByCpf(paciente.getCpf())).thenReturn(false);
        when(pacienteRepository.save(paciente)).thenReturn(paciente);

        Paciente resultado = pacienteService.salvarPaciente(paciente);

        assertSame(paciente, resultado);
        verify(pacienteRepository).save(paciente);
    }

    @Test
    void deletarPaciente_quandoNaoExiste_lancaExcecao() {
        Long id = 3L;
        when(pacienteRepository.existsById(id)).thenReturn(false);

        NoSuchElementException exception = assertThrows(NoSuchElementException.class,
                () -> pacienteService.deletarPaciente(id));

        assertEquals("Paciente não encontrado com id: " + id, exception.getMessage());
        verify(pacienteRepository, never()).deleteById(id);
    }

    @Test
    void deletarPaciente_quandoExiste_deleta() {
        Long id = 4L;
        when(pacienteRepository.existsById(id)).thenReturn(true);

        pacienteService.deletarPaciente(id);

        verify(pacienteRepository).deleteById(id);
    }

    private Paciente novoPaciente() {
        Paciente paciente = new Paciente(
                "Maria Souza",
                "maria.souza@example.com",
                "11999999999",
                LocalDate.of(1995, 5, 20),
                "123.456.789-00"
        );
        paciente.setId(1L);
        return paciente;
    }
}
