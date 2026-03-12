import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

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

const TestimonialsSection = () => (
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
);

export default TestimonialsSection;
