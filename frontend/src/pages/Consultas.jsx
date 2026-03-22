import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { listarConsultas, criarConsulta, deletarConsulta, confirmarConsulta, concluirConsulta, cancelarConsulta } from "../api/consultas";
import { listarPacientes } from "../api/pacientes";
import { listarMedicos } from "../api/medicos";
import Modal from "../components/Modal";
import ErrorMessage from "../components/ErrorMessage";
import StatusBadge from "../components/StatusBadge";

export default function Consultas() {
  const [dados, setDados] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm();
  
  const medicoIdWatch = watch("medicoId");

  const carregar = () => {
    setLoading(true);
    setErro(null);
    Promise.all([listarConsultas(), listarPacientes(), listarMedicos()])
      .then(([cons, pacs, meds]) => {
        setDados(cons);
        setPacientes(pacs);
        setMedicos(meds);
      })
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregar();
  }, []);

  const onSubmit = (data) => {
    setErro(null);
    const payload = {
      pacienteId: Number(data.pacienteId),
      medicoId: Number(data.medicoId),
      especialidadeId: Number(data.especialidadeId),
      dataHoraInicio: data.dataHoraInicio
    };
    criarConsulta(payload)
      .then(() => {
        setShowModal(false);
        reset();
        carregar();
      })
      .catch((e) => setErro(e.message));
  };

  const acao = (promessa) => {
    setErro(null);
    promessa.then(carregar).catch((e) => setErro(e.message));
  };

  const medicoSelecionado = medicos.find(m => m.id === Number(medicoIdWatch));
  const especialidadesDoMedico = medicoSelecionado?.especialidades ?? [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Consultas</h1>
        <button 
          onClick={() => { setShowModal(true); setErro(null); reset(); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Nova consulta
        </button>
      </div>

      <ErrorMessage message={erro} />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="mt-4 bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium">Paciente</th>
                <th className="px-6 py-3 font-medium">Médico</th>
                <th className="px-6 py-3 font-medium">Especialidade</th>
                <th className="px-6 py-3 font-medium">Início</th>
                <th className="px-6 py-3 font-medium">Fim</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dados.map((cons) => (
                <tr key={cons.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{cons.paciente.nome}</td>
                  <td className="px-6 py-4">{cons.medico.nome}</td>
                  <td className="px-6 py-4">{cons.especialidade.nome}</td>
                  <td className="px-6 py-4">{new Date(cons.dataHoraInicio).toLocaleString("pt-BR")}</td>
                  <td className="px-6 py-4">{new Date(cons.dataHoraFim).toLocaleString("pt-BR")}</td>
                  <td className="px-6 py-4"><StatusBadge status={cons.status} /></td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {cons.status === "PENDENTE" && (
                      <button onClick={() => acao(confirmarConsulta(cons.id))} className="text-blue-600 hover:text-blue-800 font-medium">Confirmar</button>
                    )}
                    {cons.status === "CONFIRMADO" && (
                      <>
                        <button onClick={() => acao(concluirConsulta(cons.id))} className="text-green-600 hover:text-green-800 font-medium">Concluir</button>
                        <button onClick={() => acao(cancelarConsulta(cons.id))} className="text-red-600 hover:text-red-800 font-medium">Cancelar</button>
                      </>
                    )}
                    {cons.status === "CONCLUIDO" && (
                      <button onClick={() => navigate("/prontuarios")} className="text-gray-600 hover:text-gray-800 font-medium">Ver prontuário</button>
                    )}
                  </td>
                </tr>
              ))}
              {dados.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">Nenhuma consulta encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal title="Nova Consulta" onClose={() => setShowModal(false)}>
          <ErrorMessage message={erro} />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
              <select {...register("pacienteId", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">
                <option value="">Selecione...</option>
                {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Médico</label>
              <select {...register("medicoId", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">
                <option value="">Selecione...</option>
                {medicos.map(m => <option key={m.id} value={m.id}>{m.nome} ({m.crm})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
              <select {...register("especialidadeId", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white" disabled={!medicoIdWatch}>
                <option value="">Selecione...</option>
                {especialidadesDoMedico.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora de Início</label>
              <input type="datetime-local" {...register("dataHoraInicio", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                Agendar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}