import { Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Products from "./pages/Products";
import Blogs from "./pages/Blogs";
import About from "./pages/About";
import Details from "./pages/Details";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import BlogContents from "./pages/BlogContents";
import { AdminRoute } from "./routes/routes";
import Request from "./pages/Request";
import useAuth from "./hooks/useAuthContext";
import Profile from "./pages/Profile";
import UserRequest from "./pages/UserRequest";
function App() {
  const { user } = useAuth()

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/products' element={<Products />}></Route>
        <Route path='/blogs' element={<Blogs />}></Route>
        <Route path='/blog/:id' element={<BlogContents />}></Route>
        <Route path='/aboutus' element={<About />}></Route>
        <Route path='/product/:id' element={<Details />}></Route>
        <Route path='/profile/:id' element={<Profile />} />
        <Route path='/profile/:id/requests' element={<UserRequest />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminRoute></AdminRoute>} >
          <Route path="/admin" element={<Admin/>} ></Route>
        </Route>
        <Route path="/admin" element={<Admin />} />
        <Route path="/request" element={user ? (<Request />) : (<Navigate to ="/login" />)} />
      </Routes>
    </div>
  );
}

export default App;
