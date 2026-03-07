import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Crown, Star, Shield, TrendingUp, Check, ArrowRight, Zap, Users, BookOpen, BarChart3 } from "lucide-react";

export interface Package {
  id: string;
  name: string;
  firstMonthPrice: number;
  monthlyPrice: number;
  oneTimeFee: number;
  points: string;
  icon: React.ReactNode;
  color: string;
  popular?: boolean;
  features: string[];
}

const packages: Package[] = [
  {
    id: "elitni",
    name: "Elitni Paket",
    firstMonthPrice: 230,
    monthlyPrice: 189.99,
    oneTimeFee: 50,
    points: "19VB",
    icon: <Crown className="h-8 w-8" />,
    color: "from-yellow-400 to-amber-600",
    popular: true,
    features: [
      "Pristup svim kursevima i materijalima",
      "1-na-1 mentorske sesije (neograničeno)",
      "Dnevni VIP trading signali",
      "Ekskluzivna Elitna zajednica",
      "Live trading sesije sa mentorima",
      "Personalizovani trading plan",
      "Priority podrška 24/7",
      "Pristup affiliate programu",
    ],
  },
  {
    id: "premium",
    name: "Premium Paket",
    firstMonthPrice: 199,
    monthlyPrice: 149.99,
    oneTimeFee: 35,
    points: "15VB",
    icon: <Star className="h-8 w-8" />,
    color: "from-purple-400 to-purple-600",
    features: [
      "Pristup svim kursevima i materijalima",
      "1-na-1 mentorske sesije (4x mesečno)",
      "Dnevni trading signali",
      "Premium zajednica",
      "Live trading sesije sa mentorima",
      "Personalizovani trading plan",
      "Pristup affiliate programu",
    ],
  },
  {
    id: "liderski",
    name: "Liderski Paket",
    firstMonthPrice: 159,
    monthlyPrice: 109.99,
    oneTimeFee: 25,
    points: "11VB",
    icon: <Shield className="h-8 w-8" />,
    color: "from-blue-400 to-blue-600",
    features: [
      "Pristup svim kursevima",
      "1-na-1 mentorske sesije (2x mesečno)",
      "Trading signali",
      "Zajednica tradera",
      "Live trading sesije",
      "Pristup affiliate programu",
    ],
  },
  {
    id: "investitorski",
    name: "Investitorski Paket",
    firstMonthPrice: 129,
    monthlyPrice: 79.99,
    oneTimeFee: 20,
    points: "8VB",
    icon: <TrendingUp className="h-8 w-8" />,
    color: "from-emerald-400 to-emerald-600",
    features: [
      "Pristup osnovnim kursevima",
      "Grupne mentorske sesije",
      "Osnovni trading signali",
      "Zajednica tradera",
      "Pristup affiliate programu",
    ],
  },
];

const PackagesSection = () => {
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleBuy = (pkg: Package) => {
    if (!isLoggedIn) {
      navigate("/login", { state: { redirect: `/payment?package=${pkg.id}` } });
    } else {
      navigate(`/payment?package=${pkg.id}`);
    }
  };

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4 text-gold">Paketi</Badge>
        <h2 className="text-3xl font-bold md:text-4xl">Izaberi svoj paket</h2>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
          Investiraj u svoje znanje i započni trading putovanje sa paketom koji ti odgovara
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`relative transition-all hover:shadow-xl hover:shadow-gold/5 hover:-translate-y-1 ${
              pkg.popular ? "border-gold/50 shadow-lg shadow-gold/10" : "hover:border-gold/30"
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-gold text-gold-foreground shadow-lg">
                  <Zap className="h-3 w-3 mr-1" /> Najpopularniji
                </Badge>
              </div>
            )}
            <CardContent className="p-6 pt-8 flex flex-col h-full">
              <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${pkg.color} text-white`}>
                {pkg.icon}
              </div>
              <h3 className="text-lg font-bold text-center">{pkg.name}</h3>

              <div className="mt-4 text-center">
                <div className="text-3xl font-extrabold text-gold">{pkg.firstMonthPrice}€</div>
                <div className="text-xs text-muted-foreground">prvi mesec</div>
              </div>

              <div className="mt-3 space-y-1 text-center text-sm text-muted-foreground">
                <div>Zatim <span className="text-foreground font-semibold">{pkg.monthlyPrice}€</span>/mes</div>
                <div>Jednokratna provizija: <span className="text-foreground font-semibold">{pkg.oneTimeFee}€</span></div>
              </div>

              <div className="mt-4 flex items-center justify-center">
                <Badge variant="outline" className="text-gold border-gold/30 font-bold">
                  {pkg.points} bodova
                </Badge>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <Button
                  onClick={() => setSelectedPkg(pkg)}
                  variant="outline"
                  className="w-full"
                >
                  Više informacija
                </Button>
                <Button
                  onClick={() => handleBuy(pkg)}
                  className={`w-full ${pkg.popular ? "bg-gold hover:bg-gold/90 text-gold-foreground" : ""}`}
                >
                  Kupi paket <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Package Details Modal */}
      <Dialog open={!!selectedPkg} onOpenChange={(open) => !open && setSelectedPkg(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            {selectedPkg && (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${selectedPkg.color} text-white`}>
                    {selectedPkg.icon}
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedPkg.name}</DialogTitle>
                    <DialogDescription>Detalji o paketu</DialogDescription>
                  </div>
                </div>
              </>
            )}
          </DialogHeader>

          {selectedPkg && (
            <div className="space-y-5">
              {/* Pricing breakdown */}
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cena prvog meseca</span>
                  <span className="font-bold text-gold">{selectedPkg.firstMonthPrice}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mesečna članarina</span>
                  <span className="font-semibold">{selectedPkg.monthlyPrice}€/mes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jednokratna provizija</span>
                  <span className="font-semibold">{selectedPkg.oneTimeFee}€</span>
                </div>
                <div className="flex justify-between text-sm border-t border-border pt-2">
                  <span className="text-muted-foreground">Bodovi</span>
                  <Badge variant="outline" className="text-gold border-gold/30 font-bold">{selectedPkg.points}</Badge>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold mb-3 text-sm">Šta uključuje:</h4>
                <ul className="space-y-2">
                  {selectedPkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => {
                  setSelectedPkg(null);
                  handleBuy(selectedPkg);
                }}
                className="w-full bg-gold hover:bg-gold/90 text-gold-foreground"
                size="lg"
              >
                Kupi {selectedPkg.name} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PackagesSection;
