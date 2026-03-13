import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, Menu, X } from "lucide-react";
import logo from "@/assets/trading-university-logo.png";

const Header = () => {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Početna" },
    { to: "/mentori", label: "Mentori" },
    ...(isLoggedIn ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  console.log("Navbar vidi:", {
    isLoggedIn: isLoggedIn,
    isAdmin: isAdmin
  });

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Trading University" className="h-10 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to}>
              <Button variant={location.pathname === item.to ? "secondary" : "ghost"} size="sm">
                {item.label}
              </Button>
            </Link>
          ))}
          {isLoggedIn ? (
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="mr-1 h-4 w-4" /> Odjavi se
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">
                <LogIn className="mr-1 h-4 w-4" /> Prijavi se
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t bg-card px-4 py-3 sm:hidden animate-fade-in">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}>
                <Button variant={location.pathname === item.to ? "secondary" : "ghost"} className="w-full justify-start" size="sm">
                  {item.label}
                </Button>
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-2 border-t mt-2">
              {isLoggedIn ? (
                <Button variant="outline" size="sm" onClick={() => { logout(); setMobileOpen(false); }} className="flex-1">
                  <LogOut className="mr-1 h-4 w-4" /> Odjavi se
                </Button>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <LogIn className="mr-1 h-4 w-4" /> Prijavi se
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
