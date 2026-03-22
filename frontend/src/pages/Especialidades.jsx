import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregar();
  }, []);

  const onSubmit = (data) => {
    setErro(null);
    criarEspecialidade(data)
      .then(() => {
        setShowModal(false);
        reset();
        carregar();
      })
      .catch((e) => setErro(e.message));
  };

  const handleDeletar = (id) => {
    if (window.confirm("Tem certeza que deseja deletar?")) {
      setErro(null);
      deletarEspecialidade(id)
        .then(carregar)
        .catch((e) => setErro(e.message));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Especialidades</h1>
        <button 
          onClick={() => { setShowModal(true); setErro(null); reset(); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Nova especialidade
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
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">Duração (min)</th>
                <th className="px-6 py-3 font-medium">Preço</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dados.map((esp) => (
                <tr key={esp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{esp.nome}</td>
                  <td className="px-6 py-4">{esp.duracao}</td>
                  <td className="px-6 py-4">{Number(esp.preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDeletar(esp.id)} className="text-red-600 hover:text-red-800 font-medium">Deletar</button>
                  </td>
                </tr>
              ))}
              {dados.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Nenhuma especialidade encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal title="Nova Especialidade" onClose={() => setShowModal(false)}>
          <ErrorMessage message={erro} />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input {...register("nome", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duração (minutos)</label>
              <input type="number" min="1" {...register("duracao", { required: true, valueAsNumber: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
              <input type="number" step="0.01" min="0.01" {...register("preco", { required: true, valueAsNumber: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                Salvar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}