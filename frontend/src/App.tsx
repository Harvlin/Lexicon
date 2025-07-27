import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/providers/AuthProvider";
import Layout from "@/components/layout/Layout";
import ModernHeroSection from "@/components/hero/ModernHeroSection";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Onboarding from "@/pages/auth/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Library from "@/pages/Library";
import LessonViewer from "@/pages/LessonViewer";
import Chat from "@/pages/Chat";
import StudyPlan from "@/pages/StudyPlan";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<ModernHeroSection />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="onboarding" element={<Onboarding />} />
              <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
              <Route path="lesson/:id" element={<ProtectedRoute><LessonViewer /></ProtectedRoute>} />
              <Route path="chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="study-plan" element={<ProtectedRoute><StudyPlan /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
