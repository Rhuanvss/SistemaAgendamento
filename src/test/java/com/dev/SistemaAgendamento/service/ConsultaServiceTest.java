package com.dev.SistemaAgendamento.service;

import com.dev.SistemaAgendamento.entity.Consulta;
import com.dev.SistemaAgendamento.entity.Especialidade;
import com.dev.SistemaAgendamento.entity.Medico;
import com.dev.SistemaAgendamento.entity.Paciente;
import com.dev.SistemaAgendamento.enums.StatusConsulta;
import com.dev.SistemaAgendamento.repository.ConsultaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
class ConsultaServiceTest {

    @Mock
    private ConsultaRepository consultaRepository;

    @Mock
    private PacienteService pacienteService;

    @Mock
    private MedicoService medicoService;

    @Mock
    private EspecialidadeService especialidadeService;

    @InjectMocks
    private ConsultaService consultaService;

    @Test
    void listarConsultas_retornaLista() {
        List<Consulta> consultas = List.of(novaConsulta(StatusConsulta.PENDENTE));
        when(consultaRepository.findAll()).thenReturn(consultas);

        List<Consulta> resultado = consultaService.listarConsultas();

        assertEquals(consultas, resultado);
        verify(consultaRepository).findAll();
    }

    @Test
    void buscarPorId_quandoExiste_retornaConsulta() {
        Consulta consulta = novaConsulta(StatusConsulta.PENDENTE);
        Long id = 50L;
        when(consultaRepository.findById(id)).thenReturn(Optional.of(consulta));

        Consulta resultado = consultaService.buscarPorId(id);

        assertSame(consulta, resultado);
        verify(consultaRepository).findById(id);
    }

    @Test
    void buscarPorId_quandoNaoExiste_lancaExcecao() {
        Long id = 51L;
        when(consultaRepository.findById(id)).thenReturn(Optional.empty());

        NoSuchElementException exception = assertThrows(NoSuchElementException.class,
                () -> consultaService.buscarPorId(id));

        assertEquals("Consulta não encontrada com id: " + id, exception.getMessage());
    }

    @Test
    void criarConsulta_quandoMedicoNaoTemEspecialidade_lancaExcecao() {
        Long pacienteId = 1L;
        Long medicoId = 2L;
        Long especialidadeId = 3L;
        LocalDateTime inicio = LocalDateTime.now().plusMinutes(30);

        Paciente paciente = novoPaciente();
        Medico medico = novoMedico();
        medico.setEspecialidades(List.of());
        Especialidade especialidade = novaEspecialidade();
        especialidade.setId(especialidadeId);

        when(pacienteService.buscarPorId(pacienteId)).thenReturn(paciente);
        when(medicoService.buscarPorId(medicoId)).thenReturn(medico);
        when(especialidadeService.buscarPorId(especialidadeId)).thenReturn(especialidade);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> consultaService.criarConsulta(pacienteId, medicoId, especialidadeId, inicio));

        assertEquals("O médico não possui a especialidade solicitada.", exception.getMessage());
        verify(consultaRepository, never()).save(any(Consulta.class));
    }

    @Test
    void criarConsulta_quandoDataHoraNula_lancaExcecao() {
        Long pacienteId = 1L;
        Long medicoId = 2L;
        Long especialidadeId = 3L;

        Paciente paciente = novoPaciente();
        Medico medico = novoMedico();
        Especialidade especialidade = novaEspecialidade();
        especialidade.setId(especialidadeId);
        medico.setEspecialidades(List.of(especialidade));

        when(pacienteService.buscarPorId(pacienteId)).thenReturn(paciente);
        when(medicoService.buscarPorId(medicoId)).thenReturn(medico);
        when(especialidadeService.buscarPorId(especialidadeId)).thenReturn(especialidade);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> consultaService.criarConsulta(pacienteId, medicoId, especialidadeId, null));

        assertEquals("A data e hora de início são obrigatórias.", exception.getMessage());
        verify(consultaRepository, never()).save(any(Consulta.class));
    }

    @Test
    void criarConsulta_quandoDataHoraPassada_lancaExcecao() {
        Long pacienteId = 1L;
        Long medicoId = 2L;
        Long especialidadeId = 3L;
        LocalDateTime inicio = LocalDateTime.now().minusMinutes(30);

        Paciente paciente = novoPaciente();
        Medico medico = novoMedico();
        Especialidade especialidade = novaEspecialidade();
        especialidade.setId(especialidadeId);
        medico.setEspecialidades(List.of(especialidade));

        when(pacienteService.buscarPorId(pacienteId)).thenReturn(paciente);
        when(medicoService.buscarPorId(medicoId)).thenReturn(medico);
        when(especialidadeService.buscarPorId(especialidadeId)).thenReturn(especialidade);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> consultaService.criarConsulta(pacienteId, medicoId, especialidadeId, inicio));

        assertEquals("A consulta não pode ser agendada para uma data/hora no passado.", exception.getMessage());
        verify(consultaRepository, never()).save(any(Consulta.class));
    }

    @Test
    void criarConsulta_quandoConflitoHorario_lancaExcecao() {
        Long pacienteId = 1L;
        Long medicoId = 2L;
        Long especialidadeId = 3L;
        LocalDateTime inicio = LocalDateTime.now().plusMinutes(30);

        Paciente paciente = novoPaciente();
        Medico medico = novoMedico();
        Especialidade especialidade = novaEspecialidade();
        especialidade.setId(especialidadeId);
        medico.setEspecialidades(List.of(especialidade));
        especialidade.setId(especialidadeId);

        when(pacienteService.buscarPorId(pacienteId)).thenReturn(paciente);
        when(medicoService.buscarPorId(medicoId)).thenReturn(medico);
        when(especialidadeService.buscarPorId(especialidadeId)).thenReturn(especialidade);
        when(consultaRepository.existeConflito(medicoId, inicio, inicio.plusMinutes(especialidade.getDuracao())))
                .thenReturn(true);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> consultaService.criarConsulta(pacienteId, medicoId, especialidadeId, inicio));

        assertEquals("Já existe uma consulta agendada para este médico no horário solicitado.", exception.getMessage());
        verify(consultaRepository, never()).save(any(Consulta.class));
    }

    @Test
    void criarConsulta_quandoValida_salvaConsulta() {
        Long pacienteId = 1L;
        Long medicoId = 2L;
        Long especialidadeId = 3L;
        LocalDateTime inicio = LocalDateTime.now().plusMinutes(30);

        Paciente paciente = novoPaciente();
        Medico medico = novoMedico();
        Especialidade especialidade = novaEspecialidade();
        especialidade.setId(especialidadeId);
        medico.setEspecialidades(List.of(especialidade));

        when(pacienteService.buscarPorId(pacienteId)).thenReturn(paciente);
        when(medicoService.buscarPorId(medicoId)).thenReturn(medico);
        when(especialidadeService.buscarPorId(especialidadeId)).thenReturn(especialidade);
        when(consultaRepository.existeConflito(medicoId, inicio, inicio.plusMinutes(especialidade.getDuracao())))
                .thenReturn(false);
        when(consultaRepository.save(any(Consulta.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Consulta resultado = consultaService.criarConsulta(pacienteId, medicoId, especialidadeId, inicio);

        assertEquals(StatusConsulta.PENDENTE, resultado.getStatus());
        assertEquals(inicio, resultado.getDataHoraInicio());
        assertEquals(inicio.plusMinutes(especialidade.getDuracao()), resultado.getDataHoraFim());
        verify(consultaRepository).save(any(Consulta.class));
    }

    @Test
    void confirmarConsulta_quandoStatusNaoPendente_lancaExcecao() {
        Consulta consulta = novaConsulta(StatusConsulta.CONFIRMADO);
        Long id = 60L;
        when(consultaRepository.findById(id)).thenReturn(Optional.of(consulta));

        IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> consultaService.confirmarConsulta(id));

        assertEquals("Apenas consultas com status PENDENTE podem ser confirmadas.", exception.getMessage());
        verify(consultaRepository, never()).save(any(Consulta.class));
    }

    @Test
    void confirmarConsulta_quandoPendente_confirma() {
        Consulta consulta = novaConsulta(StatusConsulta.PENDENTE);
        Long id = 61L;
        when(consultaRepository.findById(id)).thenReturn(Optional.of(consulta));
        when(consultaRepository.save(consulta)).thenReturn(consulta);

        Consulta resultado = consultaService.confirmarConsulta(id);

        assertEquals(StatusConsulta.CONFIRMADO, resultado.getStatus());
        verify(consultaRepository).save(consulta);
    }

    @Test
    void concluirConsulta_quandoStatusNaoConfirmado_lancaExcecao() {
        Consulta consulta = novaConsulta(StatusConsulta.PENDENTE);
        Long id = 62L;
        when(consultaRepository.findById(id)).thenReturn(Optional.of(consulta));

        IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> consultaService.concluirConsulta(id));

        assertEquals("Apenas consultas com status CONFIRMADO podem ser concluídas.", exception.getMessage());
        verify(consultaRepository, never()).save(any(Consulta.class));
    }

    @Test
    void concluirConsulta_quandoConfirmado_conclui() {
        Consulta consulta = novaConsulta(StatusConsulta.CONFIRMADO);
        Long id = 63L;
        when(consultaRepository.findById(id)).thenReturn(Optional.of(consulta));
        when(consultaRepository.save(consulta)).thenReturn(consulta);

        Consulta resultado = consultaService.concluirConsulta(id);

        assertEquals(StatusConsulta.CONCLUIDO, resultado.getStatus());
        verify(consultaRepository).save(consulta);
    }

    @Test
    void cancelarConsulta_quandoConcluida_lancaExcecao() {
        Consulta consulta = novaConsulta(StatusConsulta.CONCLUIDO);
        Long id = 64L;
        when(consultaRepository.findById(id)).thenReturn(Optional.of(consulta));

        IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> consultaService.cancelarConsulta(id));

        assertEquals("Consultas já concluídas não podem ser canceladas.", exception.getMessage());
        verify(consultaRepository, never()).save(any(Consulta.class));
    }

    @Test
    void cancelarConsulta_quandoJaCancelada_lancaExcecao() {
        Consulta consulta = novaConsulta(StatusConsulta.CANCELADO);
        Long id = 65L;
        when(consultaRepository.findById(id)).thenReturn(Optional.of(consulta));

        IllegalStateException exception = assertThrows(IllegalStateException.class,
                () -> consultaService.cancelarConsulta(id));

        assertEquals("Esta consulta já está cancelada.", exception.getMessage());
        verify(consultaRepository, never()).save(any(Consulta.class));
    }

    @Test
    void cancelarConsulta_quandoValida_cancela() {
        Consulta consulta = novaConsulta(StatusConsulta.CONFIRMADO);
        Long id = 66L;
        when(consultaRepository.findById(id)).thenReturn(Optional.of(consulta));
        when(consultaRepository.save(consulta)).thenReturn(consulta);

        Consulta resultado = consultaService.cancelarConsulta(id);

        assertEquals(StatusConsulta.CANCELADO, resultado.getStatus());
        verify(consultaRepository).save(consulta);
    }

    @Test
    void deletarConsulta_quandoNaoExiste_lancaExcecao() {
        Long id = 70L;
        when(consultaRepository.existsById(id)).thenReturn(false);

        NoSuchElementException exception = assertThrows(NoSuchElementException.class,
                () -> consultaService.deletarConsulta(id));

        assertEquals("Consulta não encontrada com id: " + id, exception.getMessage());
        verify(consultaRepository, never()).deleteById(id);
    }

    @Test
    void deletarConsulta_quandoExiste_deleta() {
        Long id = 71L;
        when(consultaRepository.existsById(id)).thenReturn(true);

        consultaService.deletarConsulta(id);

        verify(consultaRepository).deleteById(id);
    }

    private Consulta novaConsulta(StatusConsulta status) {
        LocalDateTime inicio = LocalDateTime.now().plusMinutes(20);
        Especialidade especialidade = novaEspecialidade();
        Medico medico = novoMedico();
        medico.setEspecialidades(List.of(especialidade));
        Consulta consulta = new Consulta(
                novoPaciente(),
                medico,
                especialidade,
                inicio,
                inicio.plusMinutes(especialidade.getDuracao()),
                status
        );
        consulta.setId(80L);
        return consulta;
    }

    private Paciente novoPaciente() {
        Paciente paciente = new Paciente();
        paciente.setId(1L);
        return paciente;
    }

    private Medico novoMedico() {
        Medico medico = new Medico();
        medico.setId(2L);
        return medico;
    }

    private Especialidade novaEspecialidade() {
        Especialidade especialidade = new Especialidade(
                "Ortopedia",
                new BigDecimal("180.00"),
                40
        );
        especialidade.setId(3L);
        return especialidade;
    }
}
