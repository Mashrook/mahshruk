import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Trips from "./pages/Trips";
import TripDetails from "./pages/TripDetails";
import Hotels from "./pages/Hotels";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Support from "./pages/Support";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Activities from "./pages/Activities";
import Transport from "./pages/Transport";
import Payments from "./pages/Payments";
import Saudi from "./pages/Saudi";
import Study from "./pages/Study";
import Articles from "./pages/Articles";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Usage from "./pages/Usage";
import Cookies from "./pages/Cookies";
import Refund from "./pages/Refund";

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
            <Route path="/about" element={<About />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/trip/:id" element={<TripDetails />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/saudi" element={<Saudi />} />
            <Route path="/study" element={<Study />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/support" element={<Support />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/usage" element={<Usage />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
