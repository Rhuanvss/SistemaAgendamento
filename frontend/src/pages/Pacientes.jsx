import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Plus, Trash2, Users } from "lucide-react";
import { listarPacientes, criarPaciente, deletarPaciente } from "../api/pacientes";
import Modal from "../components/Modal";
import ErrorMessage from "../components/ErrorMessage";

export default function Pacientes() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const carregar = () => {
    setLoading(true);
    setErro(null);
    listarPacientes()
      .then(setDados)
      .catch((e) => {
        setErro(e.message);
        toast.error("Erro ao carregar pacientes.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregar();
  }, []);

  const onSubmit = (data) => {
    setErro(null);
    const toastId = toast.loading("Salvando paciente...");
    criarPaciente(data)
      .then(() => {
        toast.success("Paciente cadastrado com sucesso!", { id: toastId });
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
    if (window.confirm("Tem certeza que deseja deletar este paciente?")) {
      setErro(null);
      const toastId = toast.loading("Deletando...");
      deletarPaciente(id)
        .then(() => {
          toast.success("Paciente deletado com sucesso!", { id: toastId });
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
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-sm text-gray-500 mt-1">Cadastro e gestão de pacientes</p>
        </div>
        <button 
          onClick={() => { setShowModal(true); setErro(null); reset(); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Novo paciente
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
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">CPF</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Telefone</th>
                  <th className="px-6 py-4">Data de Nascimento</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dados.map((pac) => (
                  <tr key={pac.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {pac.nome.charAt(0).toUpperCase()}
                        </div>
                        {pac.nome}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono">{pac.cpf}</td>
                    <td className="px-6 py-4 text-gray-600">{pac.email}</td>
                    <td className="px-6 py-4 text-gray-600">{pac.telefone}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(pac.dataNascimento + "T00:00:00").toLocaleDateString("pt-BR")}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeletar(pac.id)} 
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors opacity-80 group-hover:opacity-100"
                        title="Deletar paciente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {dados.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                          <Users className="w-8 h-8 text-gray-300" />
                        </div>
                        <p>Nenhum paciente encontrado.</p>
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
        <Modal title="Novo Paciente" onClose={() => setShowModal(false)}>
          <ErrorMessage message={erro} />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
              <input {...register("nome", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="Ex: Maria Oliveira" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <input {...register("cpf", { required: true, pattern: /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/ })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow font-mono text-sm" placeholder="000.000.000-00" />
                <p className="text-xs text-gray-400 mt-1">Formato: 000.000.000-00</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                <input type="date" {...register("dataNascimento", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input {...register("telefone", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="(00) 00000-0000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" {...register("email", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="email@exemplo.com" />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancelar</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                Salvar Paciente
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}