import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { RankingProvider } from "@/contexts/RankingContext";

import Index from "./pages/Index";

const Mentori = lazy(() => import("./pages/Mentori"));
const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));
const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Payment = lazy(() => import("./pages/Payment"));
const Network = lazy(() => import("./pages/pyramidVisualizer"));

const queryClient = new QueryClient();

const PageLoader = () => <div className="flex items-center justify-center min-h-screen">Učitavanje...</div>;

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <RankingProvider>
              <TooltipProvider>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/mentori" element={<Mentori />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/network" element={<Network />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>

                <Toaster />
                <Sonner />
              </TooltipProvider>
            </RankingProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;