import { Badge } from "@/components/ui/badge";

const steps = [
  { step: "01", title: "Faza Buđenja", desc: "Ovde prvi put stvarno ulaziš u svet tradinga i počinješ da trgovanje posmatraš kao profesiju. Učiš osnove, terminologiju, kako tržište diše i gradiš prvi ozbiljan mindset pobednika." },
  { step: "02", title: "Faza Izgradnje", desc: "Počinje razvijanje sistema, discipline i navike da se trguje po pravilima, a ne po emociji. Tu se gradi temelj: analiza, risk management, strpljenje i rutina ozbiljnog tradera." },
  { step: "03", title: "Faza Stabilizacije", desc: "Ovde više ne lutaš, ne skačeš sa strategije na strategiju i ne pucaš pod pritiskom. Rezultati postaju mirniji, konzistentniji i javlja se ono najvažnije — kontrola nad sobom i nad procesom." },
  { step: "04", title: "Faza Profitabilnosti", desc: "Ovde više ne tražiš sreću, nego izvodiš rezultat. Imaš sistem, identitet, disciplinu i jasnu strukturu, pa profit postaje posledica znanja, iskustva i mentalne snage." },
];

const HowItWorksSection = () => (
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
);

export default HowItWorksSection;
