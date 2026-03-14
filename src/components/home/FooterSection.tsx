import logo from "@/assets/trading-university-logo.png";
import kartice from "@/assets/Kartice_Logo.png";

const FooterSection = () => (
  <footer className="border-t py-10">
    <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
      <div className="flex items-center justify-center gap-2 mb-2">
        <img src={logo} alt="Trading University" className="h-8 w-auto" />
      </div>
      © 2026 Trading University. Sva prava zadržana.
    </div>
    <div className="flex items-center justify-center gap-2 mb-2">
      <img src={kartice} alt="Kartice" className="h-8 w-auto" />
    </div>
  </footer>
);

export default FooterSection;
