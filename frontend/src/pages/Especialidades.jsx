import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Plus, Trash2, Activity, Clock, DollarSign } from "lucide-react";
import { listarEspecialidades, criarEspecialidade, deletarEspecialidade } from "../api/especialidades";
import Modal from "../components/Modal";
import ErrorMessage from "../components/ErrorMessage";

export default function Especialidades() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const carregar = () => {
    setLoading(true);
    setErro(null);
    listarEspecialidades()
      .then(setDados)
      .catch((e) => {
        setErro(e.message);
        toast.error("Erro ao carregar especialidades.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregar();
  }, []);

  const onSubmit = (data) => {
    setErro(null);
    const toastId = toast.loading("Salvando especialidade...");
    criarEspecialidade(data)
      .then(() => {
        toast.success("Especialidade cadastrada!", { id: toastId });
        setShowModal(false);
        reset();
        carregar();
      })
      .catch((e) => {
        setErro(e.message);
        toast.error("Erro ao cadastrar", { id: toastId });
      });
  };

  const handleDeletar = (id) => {
    if (window.confirm("Tem certeza que deseja deletar?")) {
      setErro(null);
      const toastId = toast.loading("Deletando...");
      deletarEspecialidade(id)
        .then(() => {
          toast.success("Deletado com sucesso!", { id: toastId });
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
          <h1 className="text-2xl font-bold text-gray-900">Especialidades</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie as áreas de atendimento da clínica</p>
        </div>
        <button 
          onClick={() => { setShowModal(true); setErro(null); reset(); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nova especialidade
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
                  <th className="px-6 py-4">Nome da Especialidade</th>
                  <th className="px-6 py-4">Duração (min)</th>
                  <th className="px-6 py-4">Valor Base</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dados.map((esp) => (
                  <tr key={esp.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" />
                        {esp.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {esp.duracao} min
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      <div className="flex items-center gap-1">
                        {Number(esp.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeletar(esp.id)} 
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors opacity-80 group-hover:opacity-100"
                        title="Deletar especialidade"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {dados.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                          <Activity className="w-8 h-8 text-gray-300" />
                        </div>
                        <p>Nenhuma especialidade cadastrada.</p>
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
        <Modal title="Nova Especialidade" onClose={() => setShowModal(false)}>
          <ErrorMessage message={erro} />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da especialidade</label>
              <input {...register("nome", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="Ex: Cardiologia" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duração (minutos)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input type="number" min="1" {...register("duracao", { required: true, valueAsNumber: true })} className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="30" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço Base (R$)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input type="number" step="0.01" min="0.01" {...register("preco", { required: true, valueAsNumber: true })} className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="250.00" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancelar</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                Salvar Especialidade
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}