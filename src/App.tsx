import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/use-auth";
import Index from "./pages/Index";
import DiseaseSearch from "./pages/DiseaseSearch";
import Appointments from "./pages/Appointments";
import Medicines from "./pages/Medicines";
import DoctorVisit from "./pages/DoctorVisit";
import AIAssistant from "./pages/AIAssistant";
import Teleconsultation from "./pages/Teleconsultation";
import VideoCall from "./pages/VideoCall";
import HealthDashboard from "./pages/HealthDashboard";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/search" element={<DiseaseSearch />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/doctor-visit" element={<DoctorVisit />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/teleconsultation" element={<Teleconsultation />} />
            <Route path="/video-call/:appointmentId" element={<VideoCall />} />
            <Route path="/health-dashboard" element={<HealthDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;