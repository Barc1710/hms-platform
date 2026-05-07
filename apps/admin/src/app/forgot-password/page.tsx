"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button, Input, Label } from "@hms/ui";
import { Hotel, ArrowLeft, Loader2, Send } from "lucide-react";
import { useTenant } from "@/hooks/use-tenant";

const forgotSchema = z.object({
  email: z.string().email("Correo electrónico no válido"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const tenantSlug = useTenant();

  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:3000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, tenant: tenantSlug }),
      });

      if (!response.ok) throw new Error("No pudimos procesar tu solicitud.");

      toast.success("Correo enviado", {
        description: "Si el correo existe, recibirás instrucciones en breve.",
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "No pudimos procesar tu solicitud.";
      toast.error("Error", { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-white">
      {/* LADO IZQUIERDO: MISMO BRANDING QUE EL LOGIN */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-zinc-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070')] bg-cover bg-center opacity-40 grayscale" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <Hotel className="h-7 w-27" />
          </div>
          <span className="text-2xl font-bold tracking-tight uppercase">HMS <span className="font-light text-primary">Security</span></span>
        </div>
        <div className="relative z-10 space-y-6">
          <p className="text-4xl font-light leading-tight tracking-tight italic">
            Recupera el acceso a <br />
            <span className="font-bold text-primary not-italic text-5xl">tu centro de mando.</span>
          </p>
        </div>
        <div className="relative z-10 text-xs text-zinc-500 font-medium tracking-widest uppercase">© 2026 HMS Platform</div>
      </div>

      {/* LADO DERECHO: FORMULARIO */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-24">
        <div className="w-full max-w-sm space-y-10">
          <button 
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft size={16} /> Volver al login
          </button>

          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tighter text-zinc-900 text-balance">
              ¿Olvidaste tu clave?
            </h1>
            <p className="text-zinc-500 text-sm">
              Escribe tu correo y te enviaremos un link para restablecerla.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-700 font-semibold ml-1 text-xs uppercase tracking-wider">
                Correo Electrónico
              </Label>
              <Input 
                {...form.register("email")}
                id="email" 
                placeholder="admin@hotel.com" 
                className="h-12 border-zinc-200 text-black rounded-2xl px-6 bg-zinc-50/50"
              />
              {form.formState.errors.email && <p className="text-xs text-red-500 font-medium ml-1">{form.formState.errors.email.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-full bg-zinc-950 text-white font-semibold shadow-lg hover:scale-[1.02] transition-all">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <div className="flex items-center gap-2">Enviar instrucciones <Send size={16}/></div>}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}