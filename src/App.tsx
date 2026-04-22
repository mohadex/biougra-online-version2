import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Directory from "./pages/Directory.tsx";
import BusinessDetail from "./pages/BusinessDetail.tsx";
import Pharmacy from "./pages/Pharmacy.tsx";
import Weather from "./pages/Weather.tsx";
import PrayerTimes from "./pages/PrayerTimes.tsx";
import IslamicQuiz from "./pages/IslamicQuiz.tsx";
import Souq from "./pages/Souq.tsx";
import Restaurants from "./pages/Restaurants.tsx";
import Community from "./pages/Community.tsx";
import Contact from "./pages/Contact.tsx";
import Advertise from "./pages/Advertise.tsx";
import Auth from "./pages/Auth.tsx";
import Admin from "./pages/Admin.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/business/:id" element={<BusinessDetail />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/duty-pharmacy" element={<Pharmacy />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/prayer-times" element={<PrayerTimes />} />
          <Route path="/islamic-quiz" element={<IslamicQuiz />} />
          <Route path="/souq" element={<Souq />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/home-food" element={<Restaurants />} />
          <Route path="/support-centers" element={<Directory />} />
          <Route path="/car-rental" element={<Directory />} />
          <Route path="/community" element={<Community />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
