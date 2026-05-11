import { Users, DoorOpen, CalendarCheck, TrendingUp } from "lucide-react";

const stats = [
  { name: "Huéspedes Actuales", value: "42", icon: Users, change: "+3 hoy" },
  {
    name: "Check-ins Pendientes",
    value: "12",
    icon: CalendarCheck,
    change: "Para hoy",
  },
  {
    name: "Habitaciones Disponibles",
    value: "08",
    icon: DoorOpen,
    change: "Limpias",
  },
  {
    name: "Ocupación Total",
    value: "84%",
    icon: TrendingUp,
    change: "+5% vs ayer",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Título de Bienvenida */}
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-primary">
          Resumen de Operaciones
        </h1>
        <p className="text-primary/60 font-medium">
          Estado actual de tu propiedad en tiempo real.
        </p>
      </div>

      {/* Grid de Estadísticas con Colores Dinámicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="p-6 rounded-3xl bg-secondary border border-primary/5 flex flex-col justify-between gap-4 hover:shadow-xl hover:shadow-primary/5 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-white rounded-2xl text-primary shadow-sm group-hover:scale-110 transition-transform">
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 bg-primary/5 px-2 py-1 rounded-full">
                Live
              </span>
            </div>

            <div>
              <p className="text-4xl font-black tracking-tighter text-primary">
                {stat.value}
              </p>
              <p className="text-xs font-bold text-primary/70">{stat.name}</p>
            </div>

            <div className="pt-2 border-t border-primary/5">
              <p className="text-[10px] font-bold text-primary/50 uppercase">
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder para Gráficas / Tabla de Reservas Recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-primary/5 rounded-3xl p-8 h-80 flex items-center justify-center italic text-primary/20 font-bold">
          [ Espacio para Gráfica de Ocupación Semanal ]
        </div>
        <div className="bg-primary rounded-3xl p-8 text-primary-foreground flex flex-col justify-center gap-4 shadow-2xl shadow-primary/20">
          <h3 className="text-xl font-bold leading-tight">
            ¿Necesitas ayuda con el cierre de caja?
          </h3>
          <p className="text-sm opacity-80">
            Recuerda que todos los turnos deben cerrarse antes de la medianoche.
          </p>
          <button className="mt-4 bg-white text-primary font-black py-3 px-6 rounded-2xl text-xs uppercase tracking-widest hover:bg-opacity-90 transition-colors">
            Ir a Finanzas
          </button>
        </div>
      </div>
    </div>
  );
}
