import { 
  Button, Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle, Input, Label 
} from "@hms/ui";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Card className="w-100 shadow-2xl border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="text-2xl text-center">OmniHotel Admin</CardTitle>
          <CardDescription className="text-center">
            Acceso exclusivo para personal autorizado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Usuario</Label>
            <Input id="email" type="email" placeholder="nombre@hotel.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Entrar al Panel</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
