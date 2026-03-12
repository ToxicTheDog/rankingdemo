import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, ArrowRight } from "lucide-react";

const CTASection = () => (
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
);

export default CTASection;
