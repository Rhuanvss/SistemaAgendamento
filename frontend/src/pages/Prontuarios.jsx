import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
      .catch((e) => setErro(e.message))
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
    criarProntuario(payload)
      .then(() => {
        setShowModal(false);
        reset();
        carregar();
      })
      .catch((e) => setErro(e.message));
  };

  const verDetalhes = (prontuario) => {
    setProntuarioSelecionado(prontuario);
    setShowDetalhesModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prontuários</h1>
        <button 
          onClick={() => { setShowModal(true); setErro(null); reset(); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Novo prontuário
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
                <th className="px-6 py-3 font-medium">ID Consulta</th>
                <th className="px-6 py-3 font-medium">Diagnóstico</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dados.map((pront) => (
                <tr key={pront.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{pront.consultaId}</td>
                  <td className="px-6 py-4">{pront.diagnostico.length > 60 ? pront.diagnostico.substring(0, 60) + "..." : pront.diagnostico}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => verDetalhes(pront)} className="text-blue-600 hover:text-blue-800 font-medium">Ver detalhes</button>
                  </td>
                </tr>
              ))}
              {dados.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">Nenhum prontuário encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal title="Novo Prontuário" onClose={() => setShowModal(false)}>
          <ErrorMessage message={erro} />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consulta</label>
              <select {...register("consultaId", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">
                <option value="">Selecione...</option>
                {consultasConcluidas.map(c => (
                  <option key={c.id} value={c.id}>
                    Cons #{c.id} - {c.paciente.nome} c/ {c.medico.nome} ({new Date(c.dataHoraInicio).toLocaleDateString("pt-BR")})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea {...register("descricao", { required: true })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
              <textarea {...register("diagnostico", { required: true })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prescrição</label>
              <textarea {...register("prescricao", { required: true })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
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

      {showDetalhesModal && prontuarioSelecionado && (
        <Modal title="Detalhes do Prontuário" onClose={() => setShowDetalhesModal(false)}>
          <div className="space-y-4 text-left">
            <div>
              <h3 className="text-sm font-medium text-gray-500">ID da Consulta</h3>
              <p className="text-gray-900 mt-1">{prontuarioSelecionado.consultaId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{prontuarioSelecionado.descricao}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Diagnóstico</h3>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{prontuarioSelecionado.diagnostico}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Prescrição</h3>
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{prontuarioSelecionado.prescricao}</p>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setShowDetalhesModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Fechar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}