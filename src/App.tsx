
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Battle1Screen from "./pages/Battle1Screen";
import Victory1Screen from "./pages/Victory1Screen";
import SelectScreen from "./pages/SelectScreen";
import Battle2Screen from "./pages/Battle2Screen";
import EndingAScreen from "./pages/EndingAScreen";
import EndingBScreen from "./pages/EndingBScreen";
import EndingCScreen from "./pages/EndingCScreen";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/battle1" element={<Battle1Screen />} />
            <Route path="/victory1" element={<Victory1Screen />} />
            <Route path="/select" element={<SelectScreen />} />
            <Route path="/battle2" element={<Battle2Screen />} />
            <Route path="/endingA" element={<EndingAScreen />} />
            <Route path="/endingB" element={<EndingBScreen />} />
            <Route path="/endingC" element={<EndingCScreen />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
