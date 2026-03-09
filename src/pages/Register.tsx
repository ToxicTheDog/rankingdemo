import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Check, X, Loader2 } from "lucide-react";
import { checkUsernameAvailability } from "@/lib/api";

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

  // Debounced username check
  useEffect(() => {
    if (formData.username.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus("checking");
    const timeout = setTimeout(async () => {
      try {
        const result = await checkUsernameAvailability(formData.username);
        setUsernameStatus(result.available ? "available" : "taken");
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
    const success = await register(formData.email, formData.password, formData.fullName);
    setLoading(false);

    if (success) {
      toast({ title: "Uspešno!", description: "Registracija uspešna." });
      if (packageId) {
        navigate(`/payment?package=${packageId}`);
      } else {
        navigate("/");
      }
    } else {
      toast({ title: "Greška", description: "Registracija nije uspela. Pokušajte ponovo.", variant: "destructive" });
    }
  };

  const usernameIcon = {
    idle: null,
    checking: <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />,
    available: <Check className="h-4 w-4 text-emerald-500" />,
    taken: <X className="h-4 w-4 text-destructive" />,
  };

  const usernameMessage = {
    idle: null,
    checking: "Provera...",
    available: "Username je dostupan!",
    taken: "Username je već zauzet.",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto flex max-w-lg items-center justify-center px-4 py-16">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <UserPlus className="h-6 w-6" />
              Registracija
            </CardTitle>
            {packageId && (
              <p className="text-sm text-muted-foreground mt-1">
                Registruj se da bi nastavio sa kupovinom paketa
              </p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Ime i prezime</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  placeholder="Marko Marković"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email adresa</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="email@example.com"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Broj telefona</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+381 60 123 4567"
                  required
                />
              </div>

              {/* Birth Date */}
              <div className="space-y-2">
                <Label htmlFor="birthDate">Datum rođenja</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => updateField("birthDate", e.target.value)}
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Ulica i broj</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="Knez Mihailova 10"
                  required
                />
              </div>

              {/* City & Country */}
              <div className="space-y-2">
                <Label htmlFor="cityCountry">Grad i država</Label>
                <Input
                  id="cityCountry"
                  value={formData.cityCountry}
                  onChange={(e) => updateField("cityCountry", e.target.value)}
                  placeholder="Beograd, Srbija"
                  required
                />
              </div>

              {/* Username with availability check */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => updateField("username", e.target.value)}
                    placeholder="tvoj_username"
                    required
                    minLength={3}
                    className="pr-10"
                  />
                  {usernameIcon[usernameStatus] && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameIcon[usernameStatus]}
                    </div>
                  )}
                </div>
                {usernameMessage[usernameStatus] && (
                  <p className={`text-xs ${usernameStatus === "available" ? "text-emerald-500" : usernameStatus === "taken" ? "text-destructive" : "text-muted-foreground"}`}>
                    {usernameMessage[usernameStatus]}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Lozinka</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Potvrdi lozinku</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gold hover:bg-gold/90 text-gold-foreground"
                disabled={loading || usernameStatus === "taken"}
              >
                {loading ? "Registracija..." : "Registruj se"}
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
        </Card>
      </main>
    </div>
  );
};

export default Register;
