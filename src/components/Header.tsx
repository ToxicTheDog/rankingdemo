import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, TrendingUp, LogOut, LogIn } from "lucide-react";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <TrendingUp className="h-6 w-6 text-gold" />
          <span>TradeAcademy</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link to="/">
            <Button variant={location.pathname === "/" ? "secondary" : "ghost"} size="sm">
              Početna
            </Button>
          </Link>
          <Link to="/mentori">
            <Button variant={location.pathname === "/mentori" ? "secondary" : "ghost"} size="sm">
              Mentori
            </Button>
          </Link>

          {isAdmin && (
            <Link to="/admin">
              <Button variant={location.pathname === "/admin" ? "secondary" : "ghost"} size="sm">
                Admin
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {isLoggedIn ? (
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="mr-1 h-4 w-4" />
              Odjavi se
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">
                <LogIn className="mr-1 h-4 w-4" />
                Prijavi se
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
