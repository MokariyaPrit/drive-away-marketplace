
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CarsListing from "./pages/cars/CarsListing";
import CarDetail from "./pages/cars/CarDetail";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import UserRequests from "./pages/user/UserRequests";
import UserListings from "./pages/user/UserListings";
import ListCar from "./pages/user/ListCar";
import SubmitCar from "./pages/user/SubmitCar";
import ManagerListings from "./pages/manager/ManagerListings";
import ManagerRequests from "./pages/manager/ManagerRequests";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CarSubmissions from "./pages/admin/CarSubmissions";
import Users from "./pages/admin/Users";
import Profile from "./pages/user/Profile";
import RequestListing from "./pages/user/RequestListing";
import ListingRequests from "./pages/manager/ListingRequests";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResendOtp from "./pages/auth/ResendOtp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/cars" element={<CarsListing />} />
            <Route path="/cars/:id" element={<CarDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/resend-otp" element={<ResendOtp />} />

            
            {/* User routes */}
            <Route path="/user/requests" element={<UserRequests />} />
            <Route path="/user/listings" element={<UserListings />} />
            <Route path="/user/list-car" element={<ListCar />} />
            <Route path="/user/submit-car" element={<SubmitCar />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/request-listing" element={<RequestListing />} />
            
            {/* Manager routes */}
            <Route path="/manager/listings" element={<ManagerListings />} />
            <Route path="/manager/requests" element={<ManagerRequests />} />
            <Route path="/manager/listing-requests" element={<ListingRequests />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/car-submissions" element={<CarSubmissions />} />
            <Route path="/admin/users" element={<Users />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
