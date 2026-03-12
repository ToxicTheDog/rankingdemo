import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, TrendingUp, Shield, Zap } from "lucide-react";
import heroBanner1 from "@/assets/hero-banner-1.jpg";
import heroBanner2 from "@/assets/hero-banner-2.jpg";
import heroBanner3 from "@/assets/hero-banner-3.jpg";

const BannerSections = () => (
  <>
    {/* Banner 1 — Full-width hero image with text overlay */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBanner1} alt="Trading setup" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
      </div>
      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold md:text-5xl mb-4">
            Više snage,{" "}
            <span className="text-gold">manje rizika</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Trguj sa kapitalom do $200K kroz naše partnere. Dokazani sistemi, profesionalni mentori i transparentni rezultati.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/mentori">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-gold-foreground">
                Započni sada <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* Banner 2 — Stats/features row with background */}
    <section className="relative overflow-hidden border-y">
      <div className="absolute inset-0">
        <img src={heroBanner2} alt="Trading charts" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-background/85" />
      </div>
      <div className="container relative mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: <TrendingUp className="h-8 w-8 text-gold" />, title: "Profesionalna edukacija", desc: "Struktuirani program za sve nivoe — od potpunog početnika do naprednog tradera." },
            { icon: <Shield className="h-8 w-8 text-gold" />, title: "Zaštita kapitala", desc: "Nauči risk management koji koriste profesionalci sa Wall Street-a." },
            { icon: <Zap className="h-8 w-8 text-gold" />, title: "Brzi rezultati", desc: "Naši studenti prolaze prop firm challenge-e za prosečno 30 dana." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border bg-card/60 backdrop-blur-sm p-6 text-center transition-all hover:bg-card/80 hover:border-gold/30">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Banner 3 — CTA with background image */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBanner3} alt="Trading education" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/70 to-background/40" />
      </div>
      <div className="container relative mx-auto px-4 py-20 md:py-28">
        <div className="ml-auto max-w-lg text-right">
          <h2 className="text-3xl font-bold md:text-4xl mb-4">
            Započni svoje{" "}
            <span className="text-gold">trading putovanje</span>
          </h2>
          <div className="space-y-3 mb-8">
            {["Besplatna probna verzija", "Kapital do $200,000", "Isplate bazirane na performansama"].map((text) => (
              <div key={text} className="flex items-center justify-end gap-2 text-muted-foreground">
                <span>{text}</span>
                <CheckCircle className="h-5 w-5 text-gold flex-shrink-0" />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3">
            <Link to="/mentori">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-gold-foreground">
                Pogledaj mentore
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline">
                Besplatan početak
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default BannerSections;
