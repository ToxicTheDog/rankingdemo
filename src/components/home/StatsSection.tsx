import { GraduationCap, Users, Star, Clock } from "lucide-react";

const stats = [
  { value: "1,200+", label: "Studenata", icon: <GraduationCap className="h-5 w-5" /> },
  { value: "5", label: "Mentora", icon: <Users className="h-5 w-5" /> },
  { value: "95%", label: "Zadovoljstvo", icon: <Star className="h-5 w-5" /> },
  { value: "3+", label: "Godina iskustva", icon: <Clock className="h-5 w-5" /> },
];

const StatsSection = () => (
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
);

export default StatsSection;
