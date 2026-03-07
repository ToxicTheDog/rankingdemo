import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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


const propFirms = [
  { name: "FTMO", desc: "Najpoznatija prop firma sa rigoroznim evaluation procesom. Do 90% profit split i računi do $200,000.", logo: ftmoLogo, url: "https://ftmo.com", highlight: "Do $200K račun" },
  { name: "Funded Trader Markets", desc: "Isplata u roku od 24h ili dupliraju iznos. Do $1.5M kapitala sa fleksibilnim uslovima.", logo: null, url: "https://fundedtradermarkets.com", highlight: "24h isplata" },
  { name: "TopStep", desc: "Specijalizovani za futures trading. Jedan od pionira prop trading industrije sa izvrsnom podrškom.", logo: topstepLogo, url: "https://www.topstep.com", highlight: "Futures fokus" },
  { name: "Instant Funding", desc: "Bez evaluation faze — trenutni pristup funded računu. Idealno za iskusne tradere koji žele brz start.", logo: null, url: "https://instantfunding.io", highlight: "Bez evaluacije" },
];

const payoutImages = [
  { src: chart1, alt: "Live trading sa nasim mentorima", label: "Live Trading" },
  { src: myfxbook1, alt: "Statistika jednog od nasih studenata", label: "MyFXBook Statistika Studenta" },
  { src: payout1, alt: "Jedan od mnogih payouta kao rezultat nasih studenata", label: "Payout Naseg Studenta" },
  { src: payout3, alt: "Jedan od mnogih payouta kao rezultat nasih studenata", label: "Payout Naseg Studenta" },
  { src: myfxbook2, alt: "Statistika jednog od nasih studenata", label: "MyFXBook Statistika Studenta" },
  { src: payout2, alt: "Jedan od mnogih payouta kao rezultat nasih studenata", label: "Payout Naseg Studenta" },
  { src: result1, alt: "Rezultat jednog od nasih trejdova", label: "Rezultat Jednog Od Nasih Trejdera" },
  { src: payout4, alt: "Jedan od mnogih payouta kao rezultat nasih studenata", label: "Payout Naseg Studenta" },
  { src: chart2, alt: "Live trading sa nasim mentorima", label: "Live Trading" },
];

const PropFirmsSection = () => {
  return (
    <>
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

      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 text-gold">Dokazi isplata</Badge>
            <h2 className="text-3xl font-bold md:text-4xl">Stvarni payouti naših partnera</h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Evo dokaza da naši partneri zaista isplaćuju tradere — milioni dolara mesečno
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {payoutImages.map((img, i) => (
              <Card key={i} className="overflow-hidden group transition-all hover:shadow-lg hover:border-gold/30">
                <AspectRatio ratio={24 / 16}>
                  <img src={img.src} alt={img.alt} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                </AspectRatio>
                <CardContent className="p-3">
                  <p className="text-sm font-medium text-center">{img.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PropFirmsSection;
