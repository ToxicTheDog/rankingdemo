import { useEffect, useRef } from "react";

/*
  MarketTicker.jsx
  ─────────────────────────────────────────────────────────────────
  Koristi ZVANIČNI TradingView Ticker Tape widget (embed-widget-ticker-tape.js)
  → Iste live cene koje vidiš na crofxtrading.com i sličnim sajtovima
  → Klik na simbol otvara TradingView stranicu za taj instrument
  → Besplatno, bez API ključeva, bez CORS problema
  
  INSTALACIJA:
    1. Kopiraj MarketTicker.jsx u src/components/
    2. Importuj u App.jsx: import MarketTicker from './components/MarketTicker'
    3. Stavi na vrh: <MarketTicker />
  ─────────────────────────────────────────────────────────────────
*/

const TICKER_CONFIG = {
  symbols: [
    { proName: "BINANCE:BTCUSDT",   description: "Bitcoin"  },
    { proName: "BINANCE:ETHUSDT",   description: "Ethereum" },
    { proName: "TVC:GOLD",          description: "XAU/USD"  },
    { proName: "TVC:SILVER",        description: "XAG/USD"  },
    { proName: "FX:GBPUSD",         description: "GBP/USD"  },
    { proName: "FX:EURUSD",         description: "EUR/USD"  },
    { proName: "FOREXCOM:NSXUSD",   description: "US 100"   },
    { proName: "FOREXCOM:SPXUSD",   description: "S&P 500"  },
    { proName: "FX:GBPJPY",         description: "GBP/JPY"  },
    { proName: "FX:USDJPY",         description: "USD/JPY"  },
  ],
  showSymbolLogo: true,
  isTransparent: true,       // <-- proziran bg, naslediće tvoj tamni dizajn
  displayMode: "adaptive",   // "regular" | "compact" | "adaptive"
  colorTheme: "dark",
  locale: "en",
  // utm parametri — TradingView ih koristi za tracking (vidljivo u crofxtrading URL-u)
  // zameni "yoursite.com" sa tvojim domenom
  utm_source: "yoursite.com",
  utm_medium: "widget",
  utm_campaign: "ticker-tape",
};

export default function MarketTicker() {
  const containerRef = useRef(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!containerRef.current || scriptLoaded.current) return;
    scriptLoaded.current = true;

    // Očisti pre montiranja (React Strict Mode pokreće effect dvaput)
    containerRef.current.innerHTML = "";

    // Napravi div koji će TradingView widget popuniti
    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    containerRef.current.appendChild(widgetDiv);

    // Ubaci script sa konfiguracijom kao inline JSON (jedini podržani način)
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify(TICKER_CONFIG);
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      scriptLoaded.current = false;
    };
  }, []);

  return (
    <>
      <style>{`
        /* ── Wrapper koji skriva TradingView branding i stilizuje traku ── */
        .mk-ticker-root {
          width: 100%;
          position: relative;
          overflow: hidden;
          background: #07090e;
          border-bottom: 1px solid #141b28;
          /* Gornja svetleća linija */
        }
        .mk-ticker-root::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            #1e3a5f 20%,
            #3b82f6 50%,
            #1e3a5f 80%,
            transparent 100%);
          opacity: 0.55;
          z-index: 10;
        }

        /* Fade ivice levo/desno */
        .mk-ticker-root::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg,  #07090e 0px, transparent 80px),
            linear-gradient(270deg, #07090e 0px, transparent 80px);
          pointer-events: none;
          z-index: 5;
        }

        /* LIVE badge */
        .mk-live {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 6px;
          background: #0c1118;
          border: 1px solid #1e2d40;
          border-radius: 6px;
          padding: 4px 10px;
          pointer-events: none;
        }
        .mk-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 9px #22c55e;
          animation: mkPulse 2s ease-in-out infinite;
        }
        .mk-label {
          font-family: 'DM Mono', 'Courier New', monospace;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: #22c55e;
        }
        @keyframes mkPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }

        /* Sakrivanje TV copyright linka (opcionalno — možeš ostaviti) */
        .tradingview-widget-copyright {
          display: none !important;
        }

        /* TradingView widget container */
        .tradingview-widget-container {
          width: 100%;
        }
      `}</style>

      <div className="mk-ticker-root">
        {/* LIVE indikator */}
        <div className="mk-live">
          <span className="mk-dot" />
          <span className="mk-label">LIVE</span>
        </div>

        {/* TradingView Ticker Tape */}
        <div
          ref={containerRef}
          className="tradingview-widget-container"
        />
      </div>
    </>
  );
}
