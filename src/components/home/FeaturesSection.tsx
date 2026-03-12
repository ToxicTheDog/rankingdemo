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

const FeaturesSection = () => (
  <section className="container mx-auto px-4 py-20">
    <div className="text-center mb-12">
      <Badge variant="secondary" className="mb-4 text-gold">Naše usluge</Badge>
      <h2 className="text-3xl font-bold md:text-4xl">Sve što ti treba za trading</h2>
      <p className="mt-3 text-muted-foreground max-w-lg mx-auto">Kompletna platforma za učenje i usavršavanje trading veština</p>
    </div>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
      {features.map((f) => (
        <Card key={f.title} className="animate-slide-up group transition-all hover:shadow-lg hover:border-gold/30">
          <CardContent className="p-6">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10 transition-colors group-hover:bg-gold/20">
              {f.icon}
            </div>
            <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

export default FeaturesSection;
