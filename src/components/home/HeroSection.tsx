import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle, TrendingUp } from "lucide-react";
import logo from "@/assets/trading-university-logo.png";

const HeroSection = () => (
  <section className="relative overflow-hidden border-b">
    <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-gold/5" />
    <div className="absolute top-20 -right-40 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
    <div className="absolute bottom-10 -left-40 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
    <div className="container relative mx-auto px-4 py-20 text-center md:py-28">
      {/* Logo */}
      <div className="animate-slide-up mb-6 flex justify-center">
        <img src={logo} alt="Trading University" className="h-28 md:h-36 w-auto" />
      </div>
      <div className="animate-slide-up mx-auto inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-6">
        <TrendingUp className="h-4 w-4 text-gold" />
        Akademija Tradinga — Uči od najboljih
      </div>
      <h1 className="animate-slide-up mx-auto max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl" style={{ animationDelay: '0.1s' }}>
        Postani uspešan{" "}
        <span className="bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">
          trader
        </span>
        {" "}uz{" "}
        <span className="bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">
          TRADING UNIVERSITY
        </span>
      </h1>
      <p className="animate-slide-up mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl" style={{ animationDelay: '0.2s' }}>
        Nauči trading od iskusnih edukatora kroz struktuirane nivoe znanja i napredovanja, live sesije i podršku zajednice. Zaradi dok učiš, jer sve što trguju oni, trguj i ti - sve je transparentno.
      </p>
      <div className="animate-slide-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center" style={{ animationDelay: '0.3s' }}>
        <Link to="/mentori">
          <Button size="lg" className="bg-gold hover:bg-gold/90 text-gold-foreground px-8 h-12 text-base">
            Upoznaj mentore <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <Button size="lg" variant="outline" className="h-12 px-8 text-base">
          <Play className="mr-2 h-5 w-5" /> Pogledaj intro video
        </Button>
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-gold" /> Live podrška</span>
        <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-gold" /> 1000+ studenata</span>
      </div>
    </div>
  </section>
);

export default HeroSection;
