import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/consultas",     label: "Consultas"      },
  { to: "/medicos",       label: "Médicos"         },
  { to: "/pacientes",     label: "Pacientes"       },
  { to: "/especialidades",label: "Especialidades"  },
  { to: "/prontuarios",   label: "Prontuários"     },
];

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-left">
      <aside className="w-52 bg-white border-r border-gray-100 flex flex-col py-6 px-3 gap-1">
        <div className="text-base font-semibold text-gray-900 px-3 mb-4 text-left">Clínica Med</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </aside>
      <main className="flex-1 p-8 text-left">{children}</main>
    </div>
  );
}