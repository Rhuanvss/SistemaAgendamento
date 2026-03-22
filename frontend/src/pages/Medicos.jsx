import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
      especialidadesIds: data.especialidadesIds ? data.especialidadesIds.map(Number) : []
    };
    if (payload.especialidadesIds.length === 0) {
      setErro("Selecione pelo menos uma especialidade.");
      return;
    }
    criarMedico(payload)
      .then(() => {
        setShowModal(false);
        reset();
        carregar();
      })
      .catch((e) => setErro(e.message));
  };

  const onAddEspecialidade = (data) => {
    setErro(null);
    adicionarEspecialidade(medicoSelecionado.id, Number(data.especialidadeId))
      .then(() => {
        setShowEspecialidadeModal(false);
        formEspecialidade.reset();
        carregar();
      })
      .catch((e) => setErro(e.message));
  };

  const handleDeletar = (id) => {
    if (window.confirm("Tem certeza que deseja deletar?")) {
      setErro(null);
      deletarMedico(id)
        .then(carregar)
        .catch((e) => setErro(e.message));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Médicos</h1>
        <button 
          onClick={() => { setShowModal(true); setErro(null); reset(); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Novo médico
        </button>
      </div>

      <ErrorMessage message={erro} />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {dados.map((med) => (
            <div key={med.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{med.nome}</h3>
                  <p className="text-sm text-gray-500">CRM: {med.crm}</p>
                </div>
                <button onClick={() => handleDeletar(med.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Deletar</button>
              </div>
              <p className="text-sm text-gray-600 mb-1">{med.email}</p>
              <p className="text-sm text-gray-600 mb-4">{med.telefone}</p>
              
              <div className="mt-auto">
                <div className="flex flex-wrap gap-1 mb-3">
                  {med.especialidades.map(e => (
                    <span key={e.id} className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                      {e.nome}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => { setMedicoSelecionado(med); setErro(null); setShowEspecialidadeModal(true); }}
                  className="w-full py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Adicionar especialidade
                </button>
              </div>
            </div>
          ))}
          {dados.length === 0 && (
            <p className="col-span-3 text-center text-gray-500 py-10">Nenhum médico encontrado.</p>
          )}
        </div>
      )}

      {showModal && (
        <Modal title="Novo Médico" onClose={() => setShowModal(false)}>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">CRM</label>
              <input {...register("crm", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Especialidades</label>
              <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
                {todasEspecialidades.map(esp => (
                  <label key={esp.id} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" value={esp.id} {...register("especialidadesIds")} className="rounded text-blue-600 border-gray-300" />
                    <span className="text-sm text-gray-700">{esp.nome}</span>
                  </label>
                ))}
              </div>
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

      {showEspecialidadeModal && (
        <Modal title={`Adicionar Especialidade - ${medicoSelecionado?.nome}`} onClose={() => setShowEspecialidadeModal(false)}>
          <ErrorMessage message={erro} />
          <form onSubmit={formEspecialidade.handleSubmit(onAddEspecialidade)} className="space-y-4 mt-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selecione a Especialidade</label>
              <select {...formEspecialidade.register("especialidadeId", { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white">
                <option value="">Selecione...</option>
                {todasEspecialidades
                  .filter(e => !medicoSelecionado.especialidades.some(me => me.id === e.id))
                  .map(esp => (
                    <option key={esp.id} value={esp.id}>{esp.nome}</option>
                  ))
                }
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setShowEspecialidadeModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button>
              <button type="submit" disabled={formEspecialidade.formState.isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                Adicionar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}