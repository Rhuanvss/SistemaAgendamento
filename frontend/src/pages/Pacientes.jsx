import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregar();
  }, []);

  const onSubmit = (data) => {
    setErro(null);
    criarPaciente(data)
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
      deletarPaciente(id)
        .then(carregar)
        .catch((e) => setErro(e.message));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pacientes</h1>
        <button 
          onClick={() => { setShowModal(true); setErro(null); reset(); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Novo paciente
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
                <th className="px-6 py-3 font-medium">CPF</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Telefone</th>
                <th className="px-6 py-3 font-medium">Nascimento</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dados.map((pac) => (
                <tr key={pac.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{pac.nome}</td>
                  <td className="px-6 py-4">{pac.cpf}</td>
                  <td className="px-6 py-4">{pac.email}</td>
                  <td className="px-6 py-4">{pac.telefone}</td>
                  <td className="px-6 py-4">{new Date(pac.dataNascimento + "T00:00:00").toLocaleDateString("pt-BR")}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDeletar(pac.id)} className="text-red-600 hover:text-red-800 font-medium">Deletar</button>
                  </td>
                </tr>
              ))}
              {dados.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">Nenhum paciente encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal title="Novo Paciente" onClose={() => setShowModal(false)}>
          <ErrorMessage message={erro} />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input {...register("nome", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" {...register("email", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input {...register("telefone", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
              <input type="date" {...register("dataNascimento", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF (000.000.000-00)</label>
              <input {...register("cpf", { required: true, pattern: /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/ })} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="000.000.000-00" />
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