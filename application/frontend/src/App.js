import { Routes,Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Products from "./pages/Products";
import Blogs from "./pages/Blogs";
import About from "./pages/About";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/products' element={<Products/>}></Route>
        <Route path='/blogs' element={<Blogs/>}></Route>
        <Route path='/aboutus' element={<About/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
