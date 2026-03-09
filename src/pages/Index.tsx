import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { TrendingUp, BarChart3, BookOpen, Users, ArrowRight, Shield, Target, Zap, CheckCircle, Star, Play, GraduationCap, Clock, Globe, Quote } from "lucide-react";
import PropFirmsSection from "@/components/PropFirmsSection";
import PackagesSection from "@/components/PackagesSection";
import { useRanking } from "@/contexts/RankingContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import RankTitleBadge from "@/components/RankTitleBadge";
import MarketTicker from "@/components/MarketTicker";

const features = [
  { icon: <BarChart3 className="h-8 w-8 text-gold" />, title: "Tehnička Analiza", desc: "Naučite da čitate grafikone, prepoznajete paterne i donosite informisane odluke." },
  { icon: <BookOpen className="h-8 w-8 text-gold" />, title: "Fundamentalna analiza da bude pored nje", desc: "Bez znanja o realnim pokretačima marketa, nikada nećete imati ispravan pogled na chart! Prave čari uspešnog trgovanja počinju tek kada savladate fundamentalnu analizu!" },
  { icon: <Shield className="h-8 w-8 text-gold" />, title: "Sentimentalna analiza", desc: "Upoznavanje sa psihologijom mase i njihovim pozicijama otkriva ti smernice da budeš pametniji investitor i da trgujes poput onih 5% tradera koji rade suprotno od mase!" },
  { icon: <Target className="h-8 w-8 text-gold" />, title: "Psihologija trgovanja", desc: "Možete imati sjajnu strategiju, medjutim bez adekvatne psihologije u ovom svetu berzanskog trgovanja, može jako skupo da vas košta! Kako je potrebno razumeti market, tako isto je potrebno razumeti sebe kako funkcionišemo." },
  { icon: <Users className="h-8 w-8 text-gold" />, title: "Live trading", desc: "Jednostavnost i lepota online rada na marketu je u tome što možete pratiti iskusnije od sebe i ljude koji trguju nekoliko godina i prateći njihove odluke i korake, možete uvećavati sebi kapital i dok učite!" },
  { icon: <Zap className="h-8 w-8 text-gold" />, title: "Benefiti naše zajednice", desc: "Biti deo istomišljenika koji su orjentisani na jedini pravi i ispravan put u trgovanju je najveća privilegija! U svetu velikih laži i manipulacija, Trading University bira svoje članove i gradi elitnu zajednicu tradera! Postani deo nas još danas!" },
];

const stats = [
  { value: "1,200+", label: "Studenata", icon: <GraduationCap className="h-5 w-5" /> },
  { value: "5", label: "Mentora", icon: <Users className="h-5 w-5" /> },
  { value: "95%", label: "Zadovoljstvo", icon: <Star className="h-5 w-5" /> },
  { value: "3+", label: "Godina iskustva", icon: <Clock className="h-5 w-5" /> },
];

const testimonials = [
  { name: "Milan R.", text: "Zahvaljujući TradeAcademy, naučio sam da trgtujem forex za samo 3 meseca. Mentori su fantastični!", rating: 5 },
  { name: "Jovana M.", text: "Najbolja investicija u sebe. Live sesije su mi promenile pristup tradingu potpuno.", rating: 5 },
  { name: "Đorđe K.", text: "Zajednica je neverovatna. Uvek ima neko ko može da pomogne i odgovori na pitanja.", rating: 4 },
  { name: "Stefan P.", text: "Za 6 meseci sam prošao FTMO challenge zahvaljujući strategijama koje sam naučio ovde. Preporučujem svima!", rating: 5 },
  { name: "Ana V.", text: "Mentori su uvek dostupni i strpljivi. Kao potpuni početnik, sada imam funded račun od $100K.", rating: 5 },
  { name: "Marko T.", text: "Risk management lekcije su mi bukvalno spasile račun. Sada trgtujem disciplinovano i profitabilno.", rating: 5 },
  { name: "Nikola S.", text: "Signali su odlični — prate ih detaljne analize tako da uvek znam zašto ulazim u trade.", rating: 4 },
  { name: "Jelena D.", text: "Premium paket je vredeo svaki cent. Personalizovani plan mi je pomogao da nađem svoj stil tradinga.", rating: 5 },
  { name: "Lazar M.", text: "Prešao sam sa gubitaka na konzistentne profite za 4 meseca. Zajednica i mentori su ključ.", rating: 5 },
];

const steps = [
  { step: "01", title: "Faza Buđenja", desc: "Ovde prvi put stvarno ulaziš u svet tradinga i počinješ da trgovanje posmatraš kao profesiju. Učiš osnove, terminologiju, kako tržište diše i gradiš prvi ozbiljan mindset pobednika." },
  { step: "02", title: "Faza Izgradnje", desc: "Počinje razvijanje sistema, discipline i navike da se trguje po pravilima, a ne po emociji. Tu se gradi temelj: analiza, risk management, strpljenje i rutina ozbiljnog tradera." },
  { step: "03", title: "Faza Stabilizacije", desc: "Ovde više ne lutaš, ne skačeš sa strategije na strategiju i ne pucaš pod pritiskom. Rezultati postaju mirniji, konzistentniji i javlja se ono najvažnije — kontrola nad sobom i nad procesom." },
  { step: "04", title: "Faza Profitabilnosti", desc: "Ovde više ne tražiš sreću, nego izvodiš rezultat. Imaš sistem, identitet, disciplinu i jasnu strukturu, pa profit postaje posledica znanja, iskustva i mentalne snage." },
];

const Index = () => {
  const { users } = useRanking();
  const topMentors = [...users].sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-gold/5" />
        <div className="absolute top-20 -right-40 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-10 -left-40 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
        <div className="container relative mx-auto px-4 py-24 text-center md:py-36">
          <div className="animate-slide-up mx-auto inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <TrendingUp className="h-4 w-4 text-gold" />
            Akademija Tradinga — Uči od najboljih
          </div>
          <h1 className="animate-slide-up mx-auto max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl" style={{ animationDelay: '0.1s' }}>
            Postani uspešan{" "}
            <span className="bg-gradient-to-r from-gold to-yellow-500 bg-clip-text text-transparent">
              trader
            </span>
            {" "}uz naše mentore
          </h1>
          <p className="animate-slide-up mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl" style={{ animationDelay: '0.2s' }}>
            Nauči trading od iskusnih edukatora kroz struktuirane nivoe znanja i napredovanja, live sesije i podršku zajednice. Bez obzira da li si početnik ili napredni trader. Zaradi dok učiš, jer sve što trguju oni, trguj i ti - sve je transparentno.
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
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-gold" /> Besplatan početak</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-gold" /> Live podrška</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-gold" /> 1000+ studenata</span>
          </div>
        </div>
      </section>

      <section>
        <MarketTicker />
      </section>

      {/* Stats */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-14 md:grid-cols-4 stagger-children">
          {stats.map((s) => (
            <div key={s.label} className="animate-scale-fade-in text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                {s.icon}
              </div>
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
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

      {/* How it works */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 text-gold">Kako funkcioniše</Badge>
            <h2 className="text-3xl font-bold md:text-4xl">4 faze do tvoje profitabilnosti uz nas</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
            {steps.map((s) => (
              <div key={s.step} className="animate-slide-up text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 text-2xl font-bold text-gold animate-float">
                  {s.step}
                </div>
                <h3 className="mb-2 font-semibold text-lg">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Mentors Preview */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 text-gold">Top mentori</Badge>
          <h2 className="text-3xl font-bold md:text-4xl">Upoznaj naše najbolje</h2>
          <p className="mt-3 text-muted-foreground">Iskusni profesionalci koji će te voditi kroz svet tradinga</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3 max-w-3xl mx-auto stagger-children">
          {topMentors.map((mentor) => (
            <Card key={mentor.id} className="animate-scale-fade-in text-center transition-all hover:shadow-lg hover:border-gold/30">
              <CardContent className="p-6">
                <Avatar className="mx-auto h-20 w-20 mb-4">
                  <AvatarImage src={mentor.imageUrl} alt={mentor.name} />
                  <AvatarFallback>{mentor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{mentor.name}</h3>
                <Badge variant="secondary" className="mt-2 text-xs">{mentor.specialty}</Badge>
                <div className="mt-3 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> {mentor.students} studenata
                </div>
                <div className="mt-2 text-2xl font-bold text-gold">{mentor.score}</div>
                <RankTitleBadge score={mentor.score} className="mt-1" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/mentori">
            <Button variant="outline" size="lg">
              Pogledaj sve mentore <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 text-gold">Iskustva</Badge>
            <h2 className="text-3xl font-bold md:text-4xl">Šta kažu naši studenti</h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">Stvarna iskustva članova naše zajednice</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto stagger-children">
            {testimonials.map((t) => (
              <Card key={t.name} className="animate-slide-up transition-all hover:shadow-lg hover:border-gold/30">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5 fill-gold text-gold" />
                      ))}
                    </div>
                    <Quote className="h-4 w-4 text-gold/30" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">"{t.text}"</p>
                  <p className="font-semibold text-sm text-gold">{t.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <PackagesSection />

      <PropFirmsSection />

      {/* CTA */}
      <section>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-2xl rounded-2xl border bg-gradient-to-br from-gold/5 to-yellow-900/5 p-10 md:p-14">
            <Globe className="mx-auto h-12 w-12 text-gold mb-6" />
            <h2 className="text-3xl font-bold md:text-4xl">Spreman da počneš?</h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Pogledaj naše mentore, izaberi svog voditelja i započni trading putovanje već danas.
            </p>
            <Link to="/mentori">
              <Button size="lg" className="mt-8 bg-gold hover:bg-gold/90 text-gold-foreground h-12 px-8 text-base">
                Pogledaj mentore <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-gold" />
            <span className="font-semibold text-foreground">TradeAcademy</span>
          </div>
          © 2026 TradeAcademy. Sva prava zadržana.
        </div>
      </footer>
    </div>
  );
};

export default Index;