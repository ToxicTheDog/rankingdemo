import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { TEST_TOKEN, testUser, testRankingsMe, testDashboardStats, testAffiliates } from '../lib/testData';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as any)?.redirect || "/";
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      toast({ title: "Uspešno!", description: "Dobrodošli nazad." });
      navigate(redirectTo);
    } else {
      toast({ title: "Greška", description: "Pogrešan email ili lozinka", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto flex max-w-md items-center justify-center px-4 py-16">
        <Card className="w-full border-border/50 shadow-2xl shadow-gold/5 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-gold via-amber-500 to-gold" />
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20">
                <LogIn className="h-7 w-7 text-gold" />
              </div>
              <h1 className="text-2xl font-bold">Prijava</h1>
            </div>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </div>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required className="pl-10 bg-secondary/30 border-border/50 focus:border-gold/50 focus:ring-gold/20" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Lozinka</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required className="pl-10 bg-secondary/30 border-border/50 focus:border-gold/50 focus:ring-gold/20" />
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 bg-gold hover:bg-gold/90 text-gold-foreground font-semibold text-base shadow-lg shadow-gold/20" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Prijava...</> : "Prijavi se"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Nemaš nalog?{" "}
                  <button type="button" onClick={() => navigate("/register")} className="text-gold hover:underline font-medium">
                    Registruj se
                  </button>
                </p>
              </form>
            </CardContent>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Login;
