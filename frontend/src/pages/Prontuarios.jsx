import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Plus, Eye, FileText, ClipboardList } from "lucide-react";
import { listarProntuarios, criarProntuario } from "../api/prontuarios";
import { listarConsultas } from "../api/consultas";
import Modal from "../components/Modal";
import ErrorMessage from "../components/ErrorMessage";

export default function Prontuarios() {
  const [dados, setDados] = useState([]);
  const [consultasConcluidas, setConsultasConcluidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [prontuarioSelecionado, setProntuarioSelecionado] = useState(null);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const carregar = () => {
    setLoading(true);
    setErro(null);
    Promise.all([listarProntuarios(), listarConsultas()])
      .then(([pronts, cons]) => {
        setDados(pronts);
        setConsultasConcluidas(cons.filter(c => c.status === "CONCLUIDO"));
      })
      .catch((e) => {
        setErro(e.message);
        toast.error("Erro ao carregar prontuários.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregar();
  }, []);

  const onSubmit = (data) => {
    setErro(null);
    const payload = {
      ...data,
      consultaId: Number(data.consultaId)
    };
    
    const toastId = toast.loading("Salvando prontuário...");
    criarProntuario(payload)
      .then(() => {
        toast.success("Prontuário criado com sucesso!", { id: toastId });
        setShowModal(false);
        reset();
        carregar();
      })
      .catch((e) => {
        setErro(e.message);
        toast.error("Erro ao salvar", { id: toastId });
      });
  };

  const verDetalhes = (prontuario) => {
    setProntuarioSelecionado(prontuario);
    setShowDetalhesModal(true);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prontuários</h1>
          <p className="text-sm text-gray-500 mt-1">Histórico de atendimento e prescrições médicas</p>
        </div>
        <button 
          onClick={() => { setShowModal(true); setErro(null); reset(); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Novo prontuário
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
                  <th className="px-6 py-4 w-32">Consulta ID</th>
                  <th className="px-6 py-4">Diagnóstico Resumido</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dados.map((pront) => (
                  <tr key={pront.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-mono text-xs font-medium">
                        #{pront.consultaId}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate max-w-md">
                          {pront.diagnostico.length > 80 ? pront.diagnostico.substring(0, 80) + "..." : pront.diagnostico}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => verDetalhes(pront)} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors opacity-90 group-hover:opacity-100"
                      >
                        <Eye className="w-3.5 h-3.5" /> Abrir Prontuário
                      </button>
                    </td>
                  </tr>
                ))}
                {dados.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                          <ClipboardList className="w-8 h-8 text-gray-300" />
                        </div>
                        <p>Nenhum prontuário registrado.</p>
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
        <Modal title="Novo Prontuário" onClose={() => setShowModal(false)}>
          <ErrorMessage message={erro} />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consulta Concluída</label>
              <select {...register("consultaId", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow">
                <option value="">Selecione a consulta...</option>
                {consultasConcluidas.map(c => (
                  <option key={c.id} value={c.id}>
                    Cons #{c.id} - {c.paciente.nome} c/ {c.medico.nome} ({new Date(c.dataHoraInicio).toLocaleDateString("pt-BR")})
                  </option>
                ))}
              </select>
              {consultasConcluidas.length === 0 && <p className="text-xs text-amber-600 mt-1">Não há consultas com status "CONCLUIDO" disponíveis.</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do Atendimento</label>
              <textarea {...register("descricao", { required: true })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-none" placeholder="Relato do paciente, sintomas..." />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico Médico</label>
              <textarea {...register("diagnostico", { required: true })} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-none" placeholder="CID ou descrição do diagnóstico..." />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prescrição e Conduta</label>
              <textarea {...register("prescricao", { required: true })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-none" placeholder="Medicamentos, exames solicitados, orientações..." />
            </div>
            
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancelar</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                Salvar Prontuário
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showDetalhesModal && prontuarioSelecionado && (
        <Modal title={`Prontuário da Consulta #${prontuarioSelecionado.consultaId}`} onClose={() => setShowDetalhesModal(false)}>
          <div className="space-y-5 text-left bg-gray-50/50 p-1 rounded-lg">
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Descrição</h3>
              </div>
              <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{prontuarioSelecionado.descricao}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm border-l-4 border-l-amber-400">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Diagnóstico</h3>
              </div>
              <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{prontuarioSelecionado.diagnostico}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm border-l-4 border-l-green-500">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="w-4 h-4 text-green-600" />
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Prescrição e Conduta</h3>
              </div>
              <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{prontuarioSelecionado.prescricao}</p>
            </div>
            
            <div className="flex justify-end mt-6 pt-2">
              <button onClick={() => setShowDetalhesModal(false)} className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">Fechar Prontuário</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}