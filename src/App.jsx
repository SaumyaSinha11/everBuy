import React, { createContext, useState, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/NavBar/NavBar";
import TrendingProducts from "./pages/Products/TrendingProduct";
import SingleProduct from "./pages/SingleProduct/SingleProduct";
import AuthPage from "./Components/User/AuthPage";
import MerchantProduct from "./pages/MerchantProducts/MerchantProduct";
import CustomerProfile from "./Components/User/CustomerProfile";
import Cart from "./pages/CartPage/CartPage";
import OrderPage from "./pages/OrderPage/OrderPage";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./Theme/LightTheme";
import Address from "./pages/Address";


// Create the UserContext
const UserContext = createContext();

export const useUser = () => useContext(UserContext); 

// Create a provider to wrap the app and pass down user state
export const UserProvider = ({ children }) => {
  const [login, setLogin] = useState(() => {
    const userEmail = localStorage.getItem("userEmail");
    return userEmail ? true : false;
  });
  const toggleLogin = () => setLogin(!login);
  return (
    <UserContext.Provider value={{ login, toggleLogin }}>
      {children}
    </UserContext.Provider>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
    <UserProvider>
      {" "}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<TrendingProducts />} />
          <Route path="/product/:productId" element={<SingleProduct />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/user/profile" element={<CustomerProfile />} />
          <Route path="/merchant" element={<MerchantProduct />} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/order" element={<OrderPage/>} />

          <Route path="/product/buy" element={<Address/>} />
          <Route path="*" element={<TrendingProducts/>}  />

        </Routes>
      </Router>
    </UserProvider>
    </ThemeProvider>
  );
}

export default App;
