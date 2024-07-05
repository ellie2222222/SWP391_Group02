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
import BlogContents from "./pages/BlogContents";
import Warranty from './pages/Warranty'; // Import the new page
import WarrantyList from "./pages/WarrantyList";
import { AdminRoute, AuthRoute, ManagerOrSaleRoute, UserRoute } from "./routes/routes";
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
function App() {
  const { user } = useAuth()

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />}></Route>

        <Route path='/products' element={<Products />} />
        <Route path='/products/:id' element={<Details />} />

        <Route path='/blogs' element={<Blogs />}></Route>
        <Route path='/blog/:id' element={<BlogContents />}></Route>

        <Route path='/aboutus' element={<About />}></Route>
        <Route path='/profile/:id' element={<Profile />} />

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset/:id/:token" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/warranties/create" element={<Warranty />} />
        <Route path="/warranties" element={<WarrantyList />} />
        <Route path="/warranty-policy" element={<WarrantyPolicy />} />
        <Route path="/exchange-policy" element={<ExchangePolicy />} />
        <Route path="/gold-price" element={<GoldPrice />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<JewelryDashboard />} />
          <Route path="/admin/users" element={<UsersDashboard />} />
          <Route path="/admin/requests" element={<RequestDashboard />} />
          <Route path="/admin/quotedRequest" element={<QuotedRequest />}></Route>
          <Route path="/admin/gemstones" element={<Gemstones />}></Route>
          <Route path="/admin/materials" element={<Material />}></Route>
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<UserRoute />}>
          <Route path="/requests" element={<Requests />} />
          <Route path='/products/:id/payment-status' element={<Payment />} />
        </Route>

        <Route element={<AuthRoute />}>
          <Route path="/request" element={<CustomRequest />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;


