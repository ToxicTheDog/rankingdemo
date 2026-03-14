import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, BookOpen, Shield, Target, Users, Zap } from "lucide-react";

const features = [
  { icon: <BarChart3 className="h-8 w-8 text-gold" />, title: "Tehnička Analiza", desc: "Naučite da čitate grafikone, prepoznajete paterne i donosite informisane odluke." },
  { icon: <BookOpen className="h-8 w-8 text-gold" />, title: "Fundamentalna analiza da bude pored nje", desc: "Bez znanja o realnim pokretačima marketa, nikada nećete imati ispravan pogled na chart! Prave čari uspešnog trgovanja počinju tek kada savladate fundamentalnu analizu!" },
  { icon: <Shield className="h-8 w-8 text-gold" />, title: "Sentimentalna analiza", desc: "Upoznavanje sa psihologijom mase i njihovim pozicijama otkriva ti smernice da budeš pametniji investitor i da trgujes poput onih 5% tradera koji rade suprotno od mase!" },
  { icon: <Target className="h-8 w-8 text-gold" />, title: "Psihologija trgovanja", desc: "Možete imati sjajnu strategiju, medjutim bez adekvatne psihologije u ovom svetu berzanskog trgovanja, može jako skupo da vas košta! Kako je potrebno razumeti market, tako isto je potrebno razumeti sebe kako funkcionišemo." },
  { icon: <Users className="h-8 w-8 text-gold" />, title: "Live trading", desc: "Jednostavnost i lepota online rada na marketu je u tome što možete pratiti iskusnije od sebe i ljude koji trguju nekoliko godina i prateći njihove odluke i korake, možete uvećavati sebi kapital i dok učite!" },
  { icon: <Zap className="h-8 w-8 text-gold" />, title: "Benefiti naše zajednice", desc: "Biti deo istomišljenika koji su orjentisani na jedini pravi i ispravan put u trgovanju je najveća privilegija! U svetu velikih laži i manipulacija, Trading University bira svoje članove i gradi elitnu zajednicu tradera! Postani deo nas još danas!" },
];

const colors = [
  "#3b82f6",     // muted blue          (živahan ali ne neon)
  "#6366f1",     // indigo/violet       (mekši od tvog originala)
  "#8b5cf6",     // purple              (živ, ali ne kriči)
  "#a855f7",     // violet-purple
  "#c084fc",     // light violet        (najsvetlija, ali još uvek tamna)
  "#60a5fa",     // sky blue            (osvežavajuća varijacija)
];
const FeaturesSection = () => (
  <section className="container mx-auto px-4 py-20">
    <div className="text-center mb-12">
      <Badge variant="secondary" className="mb-4 text-gold">Naše usluge</Badge>
      <h2 className="text-3xl font-bold md:text-4xl">Sve što ti treba za trading</h2>
      <p className="mt-3 text-muted-foreground max-w-lg mx-auto">Kompletna platforma za učenje i usavršavanje trading veština</p>
    </div>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
      {features.map((f, i) => {
        const color = colors[i % colors.length];
        const colorDark = `${color}cc`; // ~80% opacity

        return (
          <Card
            key={f.title}
            className={`
          group relative overflow-hidden rounded-2xl border border-white/10
          transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        `}
            style={{
              background: `linear-gradient(to bottom, ${color}1a, ${color}33, #0f172a 70%)`,
              // ili alternativno:
              // background: `linear-gradient(to bottom, ${color}26, transparent 60%), #0f172a`,
            }}
          >
            {/* suptilni highlight na vrhu */}
            <div
              className="absolute inset-x-0 top-0 h-20 pointer-events-none"
              style={{
                background: `linear-gradient(to bottom, ${color}33, transparent)`,
              }}
            />

            <CardContent className="relative p-6 pb-8">
              {/* Ikona sa bojom iz niza */}
              <div
                className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl transition-colors group-hover:scale-110"
                style={{
                  backgroundColor: `${color}26`, // ~15% opacity
                  color: color,
                }}
              >
                {f.icon}
              </div>

              <h3 className="mb-3 text-xl font-semibold text-white tracking-tight">
                {f.title}
              </h3>

              <p className="text-sm text-zinc-300 leading-relaxed">
                {f.desc}
              </p>

            </CardContent>

            {/* Tamniji fade na dnu */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950/90 to-transparent pointer-events-none" />
          </Card>
        );
      })}
    </div>
  </section>


);

export default FeaturesSection;
