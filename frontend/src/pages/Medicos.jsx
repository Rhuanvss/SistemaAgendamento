import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Plus, Trash2, Mail, Phone, Activity } from "lucide-react";
import { listarMedicos, criarMedico, deletarMedico, adicionarEspecialidade } from "../api/medicos";
import { listarEspecialidades } from "../api/especialidades";
import Modal from "../components/Modal";
import ErrorMessage from "../components/ErrorMessage";

export default function Medicos() {
  const [dados, setDados] = useState([]);
  const [todasEspecialidades, setTodasEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEspecialidadeModal, setShowEspecialidadeModal] = useState(false);
  const [medicoSelecionado, setMedicoSelecionado] = useState(null);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const formEspecialidade = useForm();

  const carregar = () => {
    setLoading(true);
    setErro(null);
    Promise.all([listarMedicos(), listarEspecialidades()])
      .then(([meds, esps]) => {
        setDados(meds);
        setTodasEspecialidades(esps);
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
      ...data,
      especialidadesIds: data.especialidadesIds ? data.especialidadesIds.map(Number) : []
    };
    if (payload.especialidadesIds.length === 0) {
      setErro("Selecione pelo menos uma especialidade.");
      return;
    }
    
    const toastId = toast.loading("Salvando médico...");
    criarMedico(payload)
      .then(() => {
        toast.success("Médico cadastrado com sucesso!", { id: toastId });
        setShowModal(false);
        reset();
        carregar();
      })
      .catch((e) => {
        setErro(e.message);
        toast.error("Erro ao cadastrar", { id: toastId });
      });
  };

  const onAddEspecialidade = (data) => {
    setErro(null);
    const toastId = toast.loading("Adicionando especialidade...");
    adicionarEspecialidade(medicoSelecionado.id, Number(data.especialidadeId))
      .then(() => {
        toast.success("Especialidade adicionada!", { id: toastId });
        setShowEspecialidadeModal(false);
        formEspecialidade.reset();
        carregar();
      })
      .catch((e) => {
        setErro(e.message);
        toast.error(e.message || "Erro ao adicionar", { id: toastId });
      });
  };

  const handleDeletar = (id) => {
    if (window.confirm("Tem certeza que deseja deletar este médico?")) {
      setErro(null);
      const toastId = toast.loading("Deletando...");
      deletarMedico(id)
        .then(() => {
          toast.success("Médico deletado com sucesso!", { id: toastId });
          carregar();
        })
        .catch((e) => {
          setErro(e.message);
          toast.error(e.message || "Erro ao deletar", { id: toastId });
        });
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Corpo Clínico</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie os médicos e suas especialidades</p>
        </div>
        <button 
          onClick={() => { setShowModal(true); setErro(null); reset(); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Novo médico
        </button>
      </div>

      <ErrorMessage message={erro} />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {dados.map((med) => (
            <div key={med.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                    {med.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{med.nome}</h3>
                    <p className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block mt-1">CRM: {med.crm}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeletar(med.id)} 
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  title="Deletar médico"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{med.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{med.telefone}</span>
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Especialidades</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {med.especialidades.map(e => (
                    <span key={e.id} className="inline-flex items-center px-2 py-1 bg-blue-50/50 text-blue-700 border border-blue-100 rounded text-xs font-medium">
                      {e.nome}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => { setMedicoSelecionado(med); setErro(null); setShowEspecialidadeModal(true); }}
                  className="w-full flex justify-center items-center gap-1 py-2 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Adicionar especialidade
                </button>
              </div>
            </div>
          ))}
          {dados.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-gray-300" />
              </div>
              <p>Nenhum médico cadastrado no sistema.</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <Modal title="Novo Médico" onClose={() => setShowModal(false)}>
          <ErrorMessage message={erro} />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
              <input {...register("nome", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="Ex: Dr. João Silva" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CRM</label>
                <input {...register("crm", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="UF-123456" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input {...register("telefone", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="(00) 00000-0000" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email profissional</label>
              <input type="email" {...register("email", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="medico@clinica.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Especialidades (Selecione pelo menos uma)</label>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
                {todasEspecialidades.map(esp => (
                  <label key={esp.id} className="flex items-center space-x-3 cursor-pointer p-1 hover:bg-gray-100 rounded transition-colors">
                    <input type="checkbox" value={esp.id} {...register("especialidadesIds")} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                    <span className="text-sm font-medium text-gray-700">{esp.nome}</span>
                  </label>
                ))}
                {todasEspecialidades.length === 0 && <span className="text-xs text-gray-500">Nenhuma especialidade cadastrada. Vá em Especialidades para cadastrar.</span>}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancelar</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                Salvar Médico
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showEspecialidadeModal && (
        <Modal title={`Nova Especialidade para ${medicoSelecionado?.nome}`} onClose={() => setShowEspecialidadeModal(false)}>
          <ErrorMessage message={erro} />
          <form onSubmit={formEspecialidade.handleSubmit(onAddEspecialidade)} className="space-y-4 mt-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selecione a Especialidade</label>
              <select {...formEspecialidade.register("especialidadeId", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow">
                <option value="">Selecione...</option>
                {todasEspecialidades
                  .filter(e => !medicoSelecionado.especialidades.some(me => me.id === e.id))
                  .map(esp => (
                    <option key={esp.id} value={esp.id}>{esp.nome}</option>
                  ))
                }
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setShowEspecialidadeModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancelar</button>
              <button type="submit" disabled={formEspecialidade.formState.isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                Adicionar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}