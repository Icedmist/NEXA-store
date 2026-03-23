 import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/context/AppContext";
import { ThemeProvider } from "next-themes";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Staff from "./pages/Staff";
import POS from "./pages/POS";
import Scanner from "./pages/Scanner";
import Labels from "./pages/Labels";
import Branches from "./pages/Branches";
import BranchManagement from "./pages/BranchManagement";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// A simple wrapper to read context
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { role } = useApp();
  if (!role) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  const host = window.location.hostname;
  const parts = host.split('.');
  
  // Logic to redirect subdomains securely to the login portal
  // We check if it's a subdomain (parts.length > 2) 
  // BUT we ensure it's NOT your main production domain on Vercel.
  const isStorePortal = (parts.length > 2 || (parts.length === 2 && host.includes('localhost') && parts[0] !== 'localhost')) 
    && host !== 'nexa-store-six.vercel.app'; 

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={isStorePortal ? <Navigate to="/login" replace /> : <Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
        <Route path="/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
        <Route path="/scanner" element={<ProtectedRoute><Scanner /></ProtectedRoute>} />
        <Route path="/labels" element={<ProtectedRoute><Labels /></ProtectedRoute>} />
        <Route path="/branches" element={<ProtectedRoute><Branches /></ProtectedRoute>} />
        <Route path="/branches/:id/manage" element={<ProtectedRoute><BranchManagement /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
