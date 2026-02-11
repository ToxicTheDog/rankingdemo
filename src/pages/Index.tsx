import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { TrendingUp, BarChart3, BookOpen, Users, ArrowRight, Shield, Target, Zap } from "lucide-react";

const features = [
  { icon: <BarChart3 className="h-8 w-8 text-emerald-500" />, title: "Tehnička Analiza", desc: "Naučite da čitate grafikone, prepoznajete paterne i donosite informisane odluke." },
  { icon: <BookOpen className="h-8 w-8 text-emerald-500" />, title: "Edukativni Materijali", desc: "Video lekcije, e-knjige i webinari dostupni 24/7 za sve nivoe znanja." },
  { icon: <Shield className="h-8 w-8 text-emerald-500" />, title: "Risk Management", desc: "Zaštitite svoj kapital sa proverenim strategijama upravljanja rizikom." },
  { icon: <Target className="h-8 w-8 text-emerald-500" />, title: "Live Trading", desc: "Pratite naše mentore uživo dok trguju i učite iz njihovih odluka u realnom vremenu." },
  { icon: <Users className="h-8 w-8 text-emerald-500" />, title: "Zajednica", desc: "Pridružite se zajednici od 1000+ aktivnih tradera koji dele iskustva i strategije." },
  { icon: <Zap className="h-8 w-8 text-emerald-500" />, title: "Signali", desc: "Dnevni trading signali sa jasnim ulaznim i izlaznim tačkama za brz start." },
];

const stats = [
  { value: "1,200+", label: "Studenata" },
  { value: "5", label: "Mentora" },
  { value: "95%", label: "Zadovoljstvo" },
  { value: "3+", label: "Godina iskustva" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-900/5" />
        <div className="container relative mx-auto px-4 py-20 text-center md:py-28">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            Škola Tradinga — Uči od najboljih
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl">
            Postani uspešan{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
              trader
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Nauči trading od iskusnih mentora kroz strukturisane kurseve, live sesije i podršku zajednice. Bez obzira da li si početnik ili napredni trader.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/mentori">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Upoznaj mentore <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Saznaj više
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b">
        <div className="container mx-auto grid grid-cols-2 gap-4 px-4 py-12 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-emerald-500">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-2 text-center text-3xl font-bold">Šta nudimo</h2>
        <p className="mb-10 text-center text-muted-foreground">Sve što ti treba da započneš i usavršiš trading karijeru</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4">{f.icon}</div>
                <h3 className="mb-1 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold">Spreman da počneš?</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Pogledaj naše mentore, izaberi svog voditelja i započni trading putovanje već danas.
          </p>
          <Link to="/mentori">
            <Button size="lg" className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white">
              Pogledaj mentore <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 TradeAcademy. Sva prava zadržana.
        </div>
      </footer>
    </div>
  );
};

export default Index;
