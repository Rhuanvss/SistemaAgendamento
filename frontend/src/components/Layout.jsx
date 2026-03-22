import { NavLink } from "react-router-dom";
import { Calendar, Users, UserRound, Stethoscope, FileText, Activity } from "lucide-react";

const navItems = [
  { to: "/consultas",     label: "Consultas",      icon: Calendar },
  { to: "/medicos",       label: "Médicos",         icon: Stethoscope },
  { to: "/pacientes",     label: "Pacientes",       icon: Users },
  { to: "/especialidades",label: "Especialidades",  icon: Activity },
  { to: "/prontuarios",   label: "Prontuários",     icon: FileText },
];

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-left font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col py-6 px-4 gap-2 shadow-sm z-10">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Clínica Med</span>
        </div>
        
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </aside>
      
      <main className="flex-1 p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}