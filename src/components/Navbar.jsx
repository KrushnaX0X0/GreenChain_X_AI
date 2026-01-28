import React, { useEffect ,useState} from "react";
import { Link } from "react-router-dom";
import bg from "../assets/bg.png";


const Navbar = () => {


   const [cartCount, setCartCount] = useState(0);

  const loadCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    setCartCount(count);
  };

  useEffect(() => {
    loadCartCount();

    
    window.addEventListener("cartUpdated", loadCartCount);

    return () => {
      window.removeEventListener("cartUpdated", loadCartCount);
    };
  }, []);
  return (
    <div id="navbar" className="h-15 w-screen  fixed top-0 z-[9999]  backdrop-blur-sm  ">
      <div className="flex items-center justify-between mt-2 px-4">
     
        <div className="flex items-center gap-2 ml-14">
          <div className="h-10">
            <img src={bg} className="h-full object-fill" />
          </div>
          <h1 className="font-bold text-xl font ">GreenChain</h1>
        </div>

  
        <div>
          <ul className="flex w-[40vw] justify-evenly font-medium">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/shop">Shop</Link>
            </li>
             <li>
              <Link to="/services">Services</Link>
            </li>
            <li className="h-10 relative " >
              <Link to="/cart"><i className="ri-shopping-cart-2-line text-xl "></i></Link>
              <div className="bg-green-500 h-4 w-4 rounded-full flex justify-center items-center absolute top-[-6px] right-[-5px] text-[0.7em] ">{cartCount}</div>
            </li>
           
           
            <li>
              <Link to="/login">Login</Link>
            </li> 
            <li className="bg-green-600 h-8 w-20 flex justify-center items-center rounded-sm text-white">
              <Link to="/signup">Sign Up</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
