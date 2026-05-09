import { Button } from "@hms/ui"; // Componente real de Shadcn

export default function Home() {
  return (
    <div className="p-20 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold">Panel Administrativo</h1>
      
      {/* Este botón de Shadcn será del color del hotel automáticamente */}
      <Button size="lg">
        Botón de Shadcn Dinámico
      </Button>

      <div className="p-4 bg-secondary text-secondary-foreground rounded-md">
        Este recuadro usa el color secundario del hotel
      </div>
    </div>
  );
}