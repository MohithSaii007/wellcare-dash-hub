import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/use-auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import DiseaseSearch from "./pages/DiseaseSearch";
import Appointments from "./pages/Appointments";
import Medicines from "./pages/Medicines";
import DoctorVisit from "./pages/DoctorVisit";
import AIAssistant from "./pages/AIAssistant";
import Teleconsultation from "./pages/Teleconsultation";
import VideoCall from "./pages/VideoCall";
import HealthDashboard from "./pages/HealthDashboard";
import RefillManagement from "./pages/RefillManagement";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import PrescriptionModule from "./pages/PrescriptionModule";

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
            
            {/* Protected Routes */}
            <Route path="/search" element={<ProtectedRoute><DiseaseSearch /></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
            <Route path="/medicines" element={<ProtectedRoute><Medicines /></ProtectedRoute>} />
            <Route path="/doctor-visit" element={<ProtectedRoute><DoctorVisit /></ProtectedRoute>} />
            <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
            <Route path="/teleconsultation" element={<ProtectedRoute><Teleconsultation /></ProtectedRoute>} />
            <Route path="/video-call/:appointmentId" element={<ProtectedRoute><VideoCall /></ProtectedRoute>} />
            <Route path="/health-dashboard" element={<ProtectedRoute><HealthDashboard /></ProtectedRoute>} />
            <Route path="/refills" element={<ProtectedRoute><RefillManagement /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/prescription-ai" element={<ProtectedRoute><PrescriptionModule /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;