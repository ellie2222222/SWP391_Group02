import { Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Products from "./pages/Products";
import Blogs from "./pages/Blogs";
import About from "./pages/About";
import Details from "./pages/Details";
import Signup from "./pages/Signup";
import JewelryDashboard from "./pages/JewelryDashboard";
import UsersDashboard from "./pages/UsersDashboard";
import StaffsDashboard from './pages/StaffsDashboard';
import BlogContents from "./pages/BlogContents";
import BlogCreate from "./pages/BlogCreate";
import Warranty from './pages/Warranty'; // Import the new page
import WarrantyList from "./pages/WarrantyList";
import { AdminRoute, AuthRoute, UserRoute } from "./routes/routes";
import useAuth from "./hooks/useAuthContext";
import Profile from "./pages/Profile";
import Requests from "./pages/Requests";
import RequestDashboard from "./pages/RequestDashboard";
import CustomRequest from "./pages/CustomRequest";
import QuotedRequest from "./pages/QuotedRequest";
import Payment from "./pages/Payment";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Gemstones from "./pages/Gemstones";
import Material from "./pages/Material";
import WarrantyPolicy from "./pages/WarrantyPolicy";
import ExchangePolicy from "./pages/ExchangePolicy";
import GoldPrice from "./pages/GoldPrice";
import Dashboard from "./pages/Dashboard";
import InvoiceDashboard from "./pages/InvoiceDashboard";
import WarrantyDashboard from "./pages/WarrantyDashboard";
import Collection from './pages/Collection';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />}></Route>

        <Route path='/products' element={<Products />} />
        <Route path='/products/:id' element={<Details />} />

        <Route path='/blogs' element={<Blogs />}></Route>
        <Route path='/blog/:id' element={<BlogContents />} />

        <Route path='/about-us' element={<About />} />

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset/:id/:token" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/warranties/create" element={<Warranty />} />
        <Route path="/warranties" element={<WarrantyList />} />
        <Route path="/warranty-policy" element={<WarrantyPolicy />} />
        <Route path="/exchange-policy" element={<ExchangePolicy />} />
        <Route path="/gold-price" element={<GoldPrice />} />
        <Route path="/collections" element={<Collection />} />
        

        <Route element={<AdminRoute />}>
          <Route path="/management" element={<JewelryDashboard />} />
          <Route path="/management/users" element={<UsersDashboard />} />
          <Route path="/management/staffs" element={<StaffsDashboard />} />
          <Route path="/management/requests" element={<RequestDashboard />} />
          <Route path="/management/quote-request" element={<QuotedRequest />} />
          <Route path="/management/warranty-request" element={<WarrantyDashboard />} />
          <Route path="/management/gemstones" element={<Gemstones />}></Route>
          <Route path="/management/materials" element={<Material />}></Route>
          <Route path="/management/dashboard" element={<Dashboard />} />
          <Route path="/management/invoices" element={<InvoiceDashboard />} />
          <Route path='/management/blogs' element={<BlogCreate />}></Route>
        </Route>

        <Route element={<UserRoute />}>
          <Route path="/requests" element={<Requests />} />
          <Route path="/request" element={<CustomRequest />} />
          <Route path='/products/:id/payment-status' element={<Payment />} />
          <Route path='/profile/:id' element={<Profile />} />
        </Route>
        
      </Routes>
    </div>
  );
}

export default App;


