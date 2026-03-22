import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Check, XSquare, CheckCircle, Eye } from "lucide-react";
import { listarConsultas, criarConsulta, confirmarConsulta, concluirConsulta, cancelarConsulta } from "../api/consultas";
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
      .catch((e) => {
        setErro(e.message);
        toast.error("Erro ao carregar dados.");
      })
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
    
    const toastId = toast.loading("Agendando consulta...");
    
    criarConsulta(payload)
      .then(() => {
        toast.success("Consulta agendada com sucesso!", { id: toastId });
        setShowModal(false);
        reset();
        carregar();
      })
      .catch((e) => {
        setErro(e.message);
        toast.error("Falha ao agendar consulta", { id: toastId });
      });
  };

  const acao = (promessa, mensagemSucesso) => {
    setErro(null);
    const toastId = toast.loading("Processando...");
    promessa
      .then(() => {
        toast.success(mensagemSucesso, { id: toastId });
        carregar();
      })
      .catch((e) => {
        setErro(e.message);
        toast.error(e.message || "Erro ao executar ação", { id: toastId });
      });
  };

  const medicoSelecionado = medicos.find(m => m.id === Number(medicoIdWatch));
  const especialidadesDoMedico = medicoSelecionado?.especialidades ?? [];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultas</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie os agendamentos da clínica</p>
        </div>
        <button 
          onClick={() => { setShowModal(true); setErro(null); reset(); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nova consulta
        </button>
      </div>

      <ErrorMessage message={erro} />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-600 uppercase tracking-wider text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Paciente</th>
                  <th className="px-6 py-4">Médico</th>
                  <th className="px-6 py-4">Especialidade</th>
                  <th className="px-6 py-4">Data / Hora</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dados.map((cons) => (
                  <tr key={cons.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900">{cons.paciente.nome}</td>
                    <td className="px-6 py-4 text-gray-700">{cons.medico.nome}</td>
                    <td className="px-6 py-4 text-gray-600">{cons.especialidade.nome}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex flex-col">
                        <span>{new Date(cons.dataHoraInicio).toLocaleDateString("pt-BR")}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(cons.dataHoraInicio).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })} - {new Date(cons.dataHoraFim).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={cons.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        {cons.status === "PENDENTE" && (
                          <button 
                            onClick={() => acao(confirmarConsulta(cons.id), "Consulta confirmada!")} 
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                            title="Confirmar"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {cons.status === "CONFIRMADO" && (
                          <>
                            <button 
                              onClick={() => acao(concluirConsulta(cons.id), "Consulta concluída!")} 
                              className="p-1.5 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                              title="Concluir"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => acao(cancelarConsulta(cons.id), "Consulta cancelada.")} 
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                              title="Cancelar"
                            >
                              <XSquare className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {cons.status === "CONCLUIDO" && (
                          <button 
                            onClick={() => navigate("/prontuarios")} 
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Eye className="w-3 h-3" /> Ver prontuário
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {dados.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Calendar className="w-8 h-8 text-gray-300" />
                        <p>Nenhuma consulta agendada.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <Modal title="Nova Consulta" onClose={() => setShowModal(false)}>
          <ErrorMessage message={erro} />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
              <select {...register("pacienteId", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow">
                <option value="">Selecione o paciente...</option>
                {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Médico</label>
              <select {...register("medicoId", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow">
                <option value="">Selecione o médico...</option>
                {medicos.map(m => <option key={m.id} value={m.id}>{m.nome} ({m.crm})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
              <select {...register("especialidadeId", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white disabled:bg-gray-50 disabled:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" disabled={!medicoIdWatch}>
                <option value="">Selecione a especialidade...</option>
                {especialidadesDoMedico.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora de Início</label>
              <input type="datetime-local" {...register("dataHoraInicio", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" />
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancelar</button>
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                <Check className="w-4 h-4" />
                Agendar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}