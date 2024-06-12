import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Products from "./pages/Products";
import Blogs from "./pages/Blogs";
import About from "./pages/About";
import Details from "./pages/Details";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
<<<<<<< HEAD
import Order from "./pages/Order";
import BlogContents from "./pages/BlogContents";
import AdminRoute from "./routes/routes";
=======
import BlogContents from "./pages/BlogContents";
import Request from "./pages/Request";
>>>>>>> c30390d3048cf0f7831d422f8063e229542b56a8
function App() {
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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
<<<<<<< HEAD
        <Route path="/admin" element={<AdminRoute></AdminRoute>} >
        <Route path="/admin" element={<Admin/>} ></Route>
        </Route>
        <Route path="/order/:id" element={<Order />} />
=======
        <Route path="/admin" element={<Admin />} />
        <Route path="/request" element={<Request />} />
>>>>>>> c30390d3048cf0f7831d422f8063e229542b56a8
      </Routes>
    </div>
  );
}

export default App;
