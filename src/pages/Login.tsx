import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast({ title: "Uspešna prijava!", description: "Dobrodošli u admin panel." });
      navigate("/admin");
    } else {
      toast({ title: "Greška", description: "Pogrešan email ili lozinka.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto flex max-w-md items-center justify-center px-4 py-16">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <LogIn className="h-6 w-6" />
              Admin Prijava
            </CardTitle>
            <CardDescription>
              Demo: admin@ranking.com / admin123
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@ranking.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Lozinka</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required />
              </div>
              <Button type="submit" className="w-full">Prijavi se</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Login;
