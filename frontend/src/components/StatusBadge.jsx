const cores = {
  PENDENTE:   "bg-amber-50 text-amber-700 border border-amber-200/60",
  CONFIRMADO: "bg-blue-50 text-blue-700 border border-blue-200/60",
  CONCLUIDO:  "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  CANCELADO:  "bg-red-50 text-red-700 border border-red-200/60",
};

const labels = {
  PENDENTE: "Pendente",
  CONFIRMADO: "Confirmado",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
};

const dots = {
  PENDENTE: "bg-amber-500",
  CONFIRMADO: "bg-blue-500",
  CONCLUIDO: "bg-emerald-500",
  CANCELADO: "bg-red-500",
}

export default function StatusBadge({ status }) {
  const currentStatus = cores[status] ? status : 'PENDENTE';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cores[currentStatus]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[currentStatus]}`}></span>
      {labels[status] ?? status}
    </span>
  );
}