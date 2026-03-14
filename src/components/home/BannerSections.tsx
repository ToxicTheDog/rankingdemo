import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, TrendingUp, Shield, Zap } from "lucide-react";
import heroBanner1 from "@/assets/hero-banner-1.jpg";
import heroBanner2 from "@/assets/hero-banner-2.jpg";
import heroBanner3 from "@/assets/hero-banner-3.jpg";

const BannerSections = () => (
  <>

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
            {["Kapital do $200,000", "Isplate bazirane na performansama"].map((text) => (
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
                Registruj Se
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default BannerSections;
