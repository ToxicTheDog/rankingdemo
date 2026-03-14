import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowUpRight, TrendingUp, DollarSign, Percent, Award } from "lucide-react";

import ftmoLogo from "@/assets/ftmo-logo.png";
import topstepLogo from "@/assets/topstep-logo.svg";

import chart1 from "@/assets/chart1.png";
import chart2 from "@/assets/chart2.png";
import myfxbook1 from "@/assets/myfxbook1.png";
import myfxbook2 from "@/assets/myfxbook2.png";
import payout1 from "@/assets/payout1.png";
import payout2 from "@/assets/payout2.png";
import payout3 from "@/assets/payout3.png";
import payout4 from "@/assets/payout4.png";
import result1 from "@/assets/result1.png";

import ftmoL from "@/assets/ftmoLogo.png";
import pipsL from "@/assets/fundingpipsLogo.jpg";
import startL from "@/assets/startraderLogo.png";
import exnessL from "@/assets/exnessLogo.jpg";

import duke from "@/assets/dukeimage2.png";


const propFirms = [
  {
    name: "FTMO",
    desc: "Najpoznatija prop firma sa rigoroznim evaluation procesom. Do 90% profit split i računi do $200,000.",
    logo: ftmoL,
    url: "https://trader.ftmo.com/?affiliates=xfnfBWhNTMzpWYOiZlIi",
    highlight: "Do $200K račun",
    stats: [
      { icon: <DollarSign className="h-3.5 w-3.5" />, label: "$200K max" },
      { icon: <Percent className="h-3.5 w-3.5" />, label: "90% split" },
    ],
  },
  {
    name: "Funding Pips",
    desc: "Moderna prop firma sa odličnim uslovima i brzim isplatama. Fleksibilni challenge-i za sve nivoe tradera.",
    logo: pipsL,
    url: "https://app.fundingpips.com/register?ref=8c98be68",
    highlight: "Brze isplate",
    stats: [
      { icon: <DollarSign className="h-3.5 w-3.5" />, label: "Fleksibilno" },
      { icon: <TrendingUp className="h-3.5 w-3.5" />, label: "Brz payout" },
    ],
  },
  {
    name: "Star Trader",
    desc: "Globalni broker sa naprednom platformom za profesionalne tradere. Izvrsna podrška i konkurentni uslovi.",
    logo: startL,
    url: "https://www.startrader.com/live-account/?affid=MzAzMjcz&ibpRebateCode=MzAzMjczU1QxMDIwMQ==",
    highlight: "Pro platforma",
    stats: [
      { icon: <Award className="h-3.5 w-3.5" />, label: "Globalni" },
      { icon: <TrendingUp className="h-3.5 w-3.5" />, label: "Pro alati" },
    ],
  },
  {
    name: "Exness",
    desc: "Jedan od najvećih brokera na svetu sa instant povlačenjem sredstava i ultra niskim spreadovima.",
    logo: exnessL,
    url: "https://one.exnessonelink.com/a/igsd0hn29q",
    highlight: "Instant withdrawal",
    stats: [
      { icon: <TrendingUp className="h-3.5 w-3.5" />, label: "Instant" },
      { icon: <DollarSign className="h-3.5 w-3.5" />, label: "Niski spread" },
    ],
  },
];

const row1Images = [
  { src: payout1, alt: "FTMO milionski payouti" },
  { src: payout2, alt: "FTMO $200K račun" },
  { src: payout3, alt: "FTM platforma" },
  { src: payout4, alt: "TopStep payout" },
];

const row2Images = [
  { src: myfxbook1, alt: "Instant Funding payout" },
  { src: myfxbook2, alt: "FTMO payouti" },
  { src: chart1, alt: "TopStep payout potvrda" },
  { src: chart2, alt: "FTM screenshot" },
  { src: result1, alt: "FTMO banner" },
];

const PropFirmsSection = () => {
  return (
    <>
      {/* Partners */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4 text-gold">Partneri</Badge>
          <h2 className="text-3xl font-bold md:text-4xl">Prop firme koje koristimo</h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Sarađujemo sa vodećim prop trading firmama kako bi naši studenti mogli da trguju sa većim kapitalom
          </p>
        </div>

        {/* === PREMIUM BLEND CONTAINER (tačno kao na slici koju si poslao) === */}
        <div className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 min-h-[620px]">

          {/* 1. SLIKA (duke) – puna pozadina */}
          <img
            src={duke}
            alt="Duke"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* 2. KLJUČNI BLEND GRADIENT – polako se tamni KA DESNOJ STRANI (kao na tvojoj novoj slici) */}
          {/* Levo: slika se vidi iza kartica (samo 30% tame), desno: tamnije da kartice "lebde" */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/30 via-zinc-950/65 to-zinc-950/95" />

          {/* 3. PLAVI HLADNI OVERLAY (isti premium vibe kao FTMO) */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/35 via-transparent to-transparent" />

          {/* 4. KARTICE PREKO SLIKE */}
          <div className="relative z-10 h-full p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-center">

              {/* LEVA STRANA – KARTICE (glassmorphism da se vidi slika iza njih) */}
              <div className="hidden lg:block lg:col-span-5" />


              {/* DESNA STRANA – prazna (da gradient može da radi svoj posao) */}
              <div className="lg:col-span-7">
                <div className="grid gap-5 sm:grid-cols-2 stagger-children">
                  {propFirms.map((p) => (
                    <a
                      key={p.name}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <Card className="h-full bg-zinc-950/70 backdrop-blur-2xl border border-white/10 hover:border-gold/40 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            {/* Logo */}
                            <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900/80 border border-white/10 group-hover:border-gold/30 transition-colors p-2.5">
                              {p.logo ? (
                                <img src={p.logo} alt={`${p.name} logo`} className="h-full w-full object-contain" />
                              ) : (
                                <span className="text-xl font-bold text-gold">{p.name[0]}</span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-white text-lg truncate">{p.name}</h3>
                                <ArrowUpRight className="h-4 w-4 text-gold group-hover:rotate-45 transition-transform" />
                              </div>

                              <Badge variant="outline" className="text-xs text-gold border-gold/30 mb-3">{p.highlight}</Badge>
                              <p className="text-sm text-zinc-300 leading-relaxed mb-4">{p.desc}</p>

                              <div className="flex flex-wrap gap-2">
                                {p.stats.map((stat, i) => (
                                  <div key={i} className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900/80 border border-white/10 px-3 py-1 text-xs text-zinc-400">
                                    <span className="text-gold">{stat.icon}</span>
                                    {stat.label}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
