import { useSearchParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Shield, TrendingUp, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const packageData: Record<string, { name: string; firstMonthPrice: number; monthlyPrice: number; oneTimeFee: number; points: string; icon: React.ReactNode; color: string }> = {
  elitni: { name: "Elitni Paket", firstMonthPrice: 230, monthlyPrice: 189.99, oneTimeFee: 50, points: "19VB", icon: <Crown className="h-6 w-6" />, color: "from-yellow-400 to-amber-600" },
  premium: { name: "Premium Paket", firstMonthPrice: 199, monthlyPrice: 149.99, oneTimeFee: 35, points: "15VB", icon: <Star className="h-6 w-6" />, color: "from-purple-400 to-purple-600" },
  liderski: { name: "Liderski Paket", firstMonthPrice: 159, monthlyPrice: 109.99, oneTimeFee: 25, points: "11VB", icon: <Shield className="h-6 w-6" />, color: "from-blue-400 to-blue-600" },
  investitorski: { name: "Investitorski Paket", firstMonthPrice: 129, monthlyPrice: 79.99, oneTimeFee: 20, points: "8VB", icon: <TrendingUp className="h-6 w-6" />, color: "from-emerald-400 to-emerald-600" },
};

const Payment = () => {
  const [searchParams] = useSearchParams();
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const pkgId = searchParams.get("package");
  const pkg = pkgId ? packageData[pkgId] : null;

  if (!isLoggedIn) return <Navigate to="/login" state={{ redirect: `/payment?package=${pkgId}` }} />;
  if (!pkg) return <Navigate to="/" />;

  const totalFirst = pkg.firstMonthPrice + pkg.oneTimeFee;

  const handlePurchase = async () => {
    setLoading(true);
    try {
      // TODO: connect to POST /api/v2/payments/purchase
      // body: { packageId: pkgId }
      await new Promise((r) => setTimeout(r, 1500));
      toast({ title: "Uspešno!", description: `Uspešno ste kupili ${pkg.name}. Dobrodošli! 🎉` });
    } catch {
      toast({ title: "Greška", description: "Došlo je do greške. Pokušajte ponovo.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Završi kupovinu</h1>

        <Card className="border-gold/30">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${pkg.color} text-white`}>
                {pkg.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold">{pkg.name}</h2>
                <Badge variant="outline" className="text-gold border-gold/30">{pkg.points} bodova</Badge>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cena prvog meseca</span>
                <span className="font-semibold">{pkg.firstMonthPrice}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Jednokratna provizija</span>
                <span className="font-semibold">{pkg.oneTimeFee}€</span>
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-3">
                <span className="font-semibold">Ukupno danas</span>
                <span className="font-bold text-gold text-lg">{totalFirst}€</span>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Zatim {pkg.monthlyPrice}€/mesečno
              </div>
            </div>

            <Button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full bg-gold hover:bg-gold/90 text-gold-foreground h-12 text-base"
              size="lg"
            >
              {loading ? "Obrađujem..." : <>Potvrdi kupovinu <ArrowRight className="ml-2 h-5 w-5" /></>}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Klikom na "Potvrdi kupovinu" prihvatate uslove korišćenja.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
