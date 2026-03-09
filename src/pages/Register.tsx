import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth, type RegisterData } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Check, X, Loader2, User, Mail, Phone, MapPin, Globe, AtSign, Lock, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    address: "",
    cityCountry: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("package");
  const { toast } = useToast();

  // Debounced username check via Supabase RPC
  useEffect(() => {
    if (formData.username.length < 3) {
      setUsernameStatus("idle");
      return;
    }
    setUsernameStatus("checking");
    const timeout = setTimeout(async () => {
      try {
        const { data, error } = await supabase.rpc("check_username_available", {
          requested_username: formData.username,
        });
        if (error) throw error;
        setUsernameStatus(data ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [formData.username]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Greška", description: "Lozinke se ne poklapaju", variant: "destructive" });
      return;
    }
    if (usernameStatus === "taken") {
      toast({ title: "Greška", description: "Username nije dostupan", variant: "destructive" });
      return;
    }
    if (formData.username.length < 3) {
      toast({ title: "Greška", description: "Username mora imati minimum 3 karaktera", variant: "destructive" });
      return;
    }

    setLoading(true);
    const regData: RegisterData = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone,
      birthDate: formData.birthDate,
      address: formData.address,
      cityCountry: formData.cityCountry,
      username: formData.username,
    };
    const success = await register(regData);
    setLoading(false);

    if (success) {
      toast({ title: "Uspešno!", description: "Registracija uspešna." });
      navigate(packageId ? `/payment?package=${packageId}` : "/");
    } else {
      toast({ title: "Greška", description: "Registracija nije uspela. Pokušajte ponovo.", variant: "destructive" });
    }
  };

  const usernameIndicator = usernameStatus === "checking" ? (
    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
  ) : usernameStatus === "available" ? (
    <Check className="h-4 w-4 text-emerald-500" />
  ) : usernameStatus === "taken" ? (
    <X className="h-4 w-4 text-destructive" />
  ) : null;

  const fields = [
    { id: "fullName", label: "Ime i prezime", icon: <User className="h-4 w-4" />, type: "text", placeholder: "Marko Marković" },
    { id: "email", label: "Email adresa", icon: <Mail className="h-4 w-4" />, type: "email", placeholder: "email@example.com" },
    { id: "phone", label: "Broj telefona", icon: <Phone className="h-4 w-4" />, type: "tel", placeholder: "+381 60 123 4567" },
    { id: "birthDate", label: "Datum rođenja", icon: <Calendar className="h-4 w-4" />, type: "date", placeholder: "" },
    { id: "address", label: "Ulica i broj", icon: <MapPin className="h-4 w-4" />, type: "text", placeholder: "Knez Mihailova 10" },
    { id: "cityCountry", label: "Grad i država", icon: <Globe className="h-4 w-4" />, type: "text", placeholder: "Beograd, Srbija" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto flex max-w-xl items-center justify-center px-4 py-12">
        <Card className="w-full border-border/50 shadow-2xl shadow-gold/5 overflow-hidden">
          {/* Header gradient bar */}
          <div className="h-1.5 bg-gradient-to-r from-gold via-amber-500 to-gold" />

          <div className="p-8">
            {/* Title */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20">
                <UserPlus className="h-7 w-7 text-gold" />
              </div>
              <h1 className="text-2xl font-bold">Kreiraj nalog</h1>
              {packageId && (
                <p className="text-sm text-muted-foreground mt-1">
                  Registruj se da bi nastavio sa kupovinom
                </p>
              )}
            </div>

            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Two-column grid for standard fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {fields.map((f) => (
                    <div key={f.id} className="space-y-1.5">
                      <Label htmlFor={f.id} className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {f.label}
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {f.icon}
                        </div>
                        <Input
                          id={f.id}
                          type={f.type}
                          value={(formData as any)[f.id]}
                          onChange={(e) => updateField(f.id, e.target.value)}
                          placeholder={f.placeholder}
                          required
                          className="pl-10 bg-secondary/30 border-border/50 focus:border-gold/50 focus:ring-gold/20 transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Username — full width */}
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Username
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <AtSign className="h-4 w-4" />
                    </div>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => updateField("username", e.target.value)}
                      placeholder="tvoj_username"
                      required
                      minLength={3}
                      className="pl-10 pr-10 bg-secondary/30 border-border/50 focus:border-gold/50 focus:ring-gold/20 transition-colors"
                    />
                    {usernameIndicator && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {usernameIndicator}
                      </div>
                    )}
                  </div>
                  {usernameStatus === "available" && (
                    <p className="text-xs text-emerald-500">Username je dostupan!</p>
                  )}
                  {usernameStatus === "taken" && (
                    <p className="text-xs text-destructive">Username je već zauzet.</p>
                  )}
                </div>

                {/* Password fields — two columns */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Lozinka
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        className="pl-10 bg-secondary/30 border-border/50 focus:border-gold/50 focus:ring-gold/20 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Potvrdi lozinku
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        className="pl-10 bg-secondary/30 border-border/50 focus:border-gold/50 focus:ring-gold/20 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gold hover:bg-gold/90 text-gold-foreground font-semibold text-base shadow-lg shadow-gold/20 transition-all hover:shadow-gold/30"
                  disabled={loading || usernameStatus === "taken"}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registracija...
                    </>
                  ) : (
                    "Registruj se"
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Već imaš nalog?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-gold hover:underline font-medium"
                  >
                    Prijavi se
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

export default Register;
