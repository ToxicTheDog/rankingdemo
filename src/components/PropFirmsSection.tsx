import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Quote } from "lucide-react";

import ftmoLogo from "@/assets/ftmo-logo.png";
import ftmoPayouts from "@/assets/ftmo-payouts.jpg";
import ftmoPayoutBanner from "@/assets/ftmo-payout-banner.jpg";
import ftmScreenshot from "@/assets/ftm-screenshot.png";
import topstepLogo from "@/assets/topstep-logo.svg";
import topstepPayout from "@/assets/topstep-payout.jpg";
import instantfundingPayout from "@/assets/instantfunding-payout.jpg";

const propFirms = [
  { name: "FTMO", desc: "Najpoznatija prop firma sa rigoroznim evaluation procesom. Do 90% profit split i računi do $200,000.", logo: ftmoLogo, url: "https://ftmo.com", highlight: "Do $200K račun" },
  { name: "Funded Trader Markets", desc: "Isplata u roku od 24h ili dupliraju iznos. Do $1.5M kapitala sa fleksibilnim uslovima.", logo: null, url: "https://fundedtradermarkets.com", highlight: "24h isplata" },
  { name: "TopStep", desc: "Specijalizovani za futures trading. Jedan od pionira prop trading industrije sa izvrsnom podrškom.", logo: topstepLogo, url: "https://www.topstep.com", highlight: "Futures fokus" },
  { name: "Instant Funding", desc: "Bez evaluation faze — trenutni pristup funded računu. Idealno za iskusne tradere koji žele brz start.", logo: null, url: "https://instantfunding.io", highlight: "Bez evaluacije" },
];

const row1Images = [
  { src: ftmoPayouts, alt: "FTMO milionski payouti" },
  { src: ftmoPayoutBanner, alt: "FTMO $200K račun" },
  { src: ftmScreenshot, alt: "FTM platforma" },
  { src: topstepPayout, alt: "TopStep payout" },
  { src: instantfundingPayout, alt: "Instant Funding payout" },
];

const row2Images = [
  { src: instantfundingPayout, alt: "Instant Funding payout" },
  { src: ftmoPayouts, alt: "FTMO payouti" },
  { src: topstepPayout, alt: "TopStep payout potvrda" },
  { src: ftmScreenshot, alt: "FTM screenshot" },
  { src: ftmoPayoutBanner, alt: "FTMO banner" },
];

const PropFirmsSection = () => {
  return (
    <>
      {/* Partners */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 text-gold">Partneri</Badge>
          <h2 className="text-3xl font-bold md:text-4xl">Prop firme koje koristimo</h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Sarađujemo sa vodećim prop trading firmama kako bi naši studenti mogli da trguju sa većim kapitalom
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
          {propFirms.map((p) => (
            <Card key={p.name} className="group transition-all hover:shadow-lg hover:border-gold/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex h-16 w-16 items-center justify-center rounded-xl bg-muted/80 p-2">
                    {p.logo ? (
                      <img src={p.logo} alt={`${p.name} logo`} className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-lg font-bold text-gold">{p.name.split(" ").map(w => w[0]).join("")}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{p.name}</h3>
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold transition-colors">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                    <Badge variant="outline" className="text-xs text-gold border-gold/30 mb-2">{p.highlight}</Badge>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Payout Proof — Marquee */}
      <section className="border-y bg-muted/30 py-20 overflow-hidden">
        <div className="container mx-auto px-4 mb-12">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 text-gold">Dokazi isplata</Badge>
            <h2 className="text-3xl font-bold md:text-4xl">Stvarni payouti naših partnera</h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Milioni dolara isplaćeni mesečno — evo dokaza da naši partneri zaista plaćaju
            </p>
          </div>
        </div>

        {/* Row 1 — Left to Right */}
        <div className="marquee-container mb-4">
          <div className="marquee-track animate-marquee-left">
            {[...row1Images, ...row1Images].map((img, i) => (
              <div key={i} className="flex-shrink-0 w-72 rounded-xl overflow-hidden border border-border/50 shadow-lg shadow-background/50 hover:border-gold/30 transition-colors">
                <img src={img.src} alt={img.alt} className="w-full h-44 object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — Right to Left */}
        <div className="marquee-container">
          <div className="marquee-track animate-marquee-right">
            {[...row2Images, ...row2Images].map((img, i) => (
              <div key={i} className="flex-shrink-0 w-72 rounded-xl overflow-hidden border border-border/50 shadow-lg shadow-background/50 hover:border-gold/30 transition-colors">
                <img src={img.src} alt={img.alt} className="w-full h-44 object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PropFirmsSection;
