import { useState, useEffect, useCallback } from "react";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";

import hungary1 from "@/assets/teambuilding/hungary-1.jpg";
import hungary2 from "@/assets/teambuilding/hungary-2.jpg";
import hungary3 from "@/assets/teambuilding/hungary-3.jpg";
import austria1 from "@/assets/teambuilding/austria-1.jpg";
import austria2 from "@/assets/teambuilding/austria-2.jpg";
import austria3 from "@/assets/teambuilding/austria-3.jpg";
import montenegro1 from "@/assets/teambuilding/montenegro-1.jpg";
import montenegro2 from "@/assets/teambuilding/montenegro-2.jpg";
import montenegro3 from "@/assets/teambuilding/montenegro-3.jpg";

const galleries = [
  {
    location: "Mađarska, Budimpešta",
    flag: "🇭🇺",
    images: [hungary1, hungary2, hungary3],
  },
  {
    location: "Austrija, Beč",
    flag: "🇦🇹",
    images: [austria1, austria2, austria3],
  },
  {
    location: "Crna Gora, Budva",
    flag: "🇲🇪",
    images: [montenegro1, montenegro2, montenegro3],
  },
];

function GalleryRow({ location, flag, images }: (typeof galleries)[0]) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % images.length),
    [images.length]
  );
  const prev = () =>
    setCurrent((c) => (c - 1 + images.length) % images.length);

  useEffect(() => {
    if (isHovered) return;
    const id = setInterval(next, 3000);
    return () => clearInterval(id);
  }, [next, isHovered]);

  return (
    <div className="space-y-3">
      {/* Location label */}
      <div className="flex items-center gap-2">
        <span className="text-xl">{flag}</span>
        <MapPin className="h-4 w-4 text-gold" />
        <span className="font-semibold text-foreground">{location}</span>
      </div>

      {/* Image viewer */}
      <div
        className="relative group overflow-hidden rounded-xl aspect-[4/3] bg-secondary"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${location} - ${i + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
          />
        ))}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

        {/* Nav buttons */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/60 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="h-4 w-4 text-foreground" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/60 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="h-4 w-4 text-foreground" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current
                  ? "w-6 bg-gold"
                  : "w-1.5 bg-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const TeamBuildingSection = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold md:text-4xl mb-3">
          Team <span className="text-gold">Building</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Naš tim redovno organizuje putovanja i druženja širom Evrope.
          Pogledaj neke od naših dosadašnjih destinacija.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {galleries.map((g) => (
          <GalleryRow key={g.location} {...g} />
        ))}
      </div>
    </div>
  </section>
);

export default TeamBuildingSection;
