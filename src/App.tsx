import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Regulamento from "./pages/Regulamento";
import { VerifyRegistration } from "./pages/VerifyRegistration";
import Ingressos from "./pages/Ingressos";
import IngressoSucesso from "./pages/IngressoSucesso";
import Cursos from "./pages/Cursos";
import CursoSucesso from "./pages/CursoSucesso";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component using Supabase Auth session
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;
  return authenticated ? children : <Navigate to="/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/regulamento" element={<Regulamento />} />
          <Route path="/verificar" element={<VerifyRegistration />} />
          <Route path="/ingressos" element={<Ingressos />} />
          <Route path="/ingresso-sucesso" element={<IngressoSucesso />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/curso-sucesso" element={<CursoSucesso />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
