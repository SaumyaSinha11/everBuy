import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { FaSearch, FaUser, FaShoppingBag } from "react-icons/fa";
import { useUser } from "../../App";
<<<<<<< HEAD
import { Menu, MenuItem, IconButton ,Tooltip } from "@mui/material";
import { useNavigate ,useLocation} from "react-router-dom";
=======
import { Menu, MenuItem, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
>>>>>>> 181a78da99372caa3b2c5bf57ca92d80ffd46e76

const Navbar = () => {
  const { login } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
<<<<<<< HEAD
  const location = useLocation();

  const hideSearchBar = ["/login"].includes(location.pathname);

  const abhishekIp = "10.65.1.185";
  const productPort = "8095";

  const saumyaIp = "10.65.1.76";
  const userPort = "8080";
  const cartPort = "8081";
=======
>>>>>>> 181a78da99372caa3b2c5bf57ca92d80ffd46e76

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate("/user/profile");
    setAnchorEl(null);
  };

  const handleLogin = () => {
<<<<<<< HEAD
    navigate("/login");
  };

  const handleLogout = () => {
    // sessionStorage.removeItem("user");
    localStorage.removeItem('userEmail');
    navigate("/login");
    window.location.reload();
  };

  // 🔍 Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      console.log("Query in fetchSuggestions:", query);
      if (query.length > 0) {
        try {
          const response = await fetch(
            `http://${abhishekIp}:${productPort}/products/suggestions/${query}`
          );
          if (!response.ok) throw new Error("Failed to fetch suggestions");
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query]);

  // 🔍 Handle search and navigation
  const handleSearch = async (searchQuery = null) => {
    const finalQuery = searchQuery || query; // ✅ Use `searchQuery` if provided, otherwise use `query`

    if (!finalQuery.trim()) {
      alert("Product cannot be empty");
      console.error("❌ Invalid search query:", finalQuery);
      return;
    }

    try {
      const response = await fetch(
        `http://${abhishekIp}:${productPort}/products/getpidwithidentifier/${finalQuery}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product IDs");
      }

      const pids = await response.json();
      console.log("Fetched PIDs:", pids);

      if (!Array.isArray(pids) || pids.length === 0) {
        alert("❌ Product not found.");
        return;
      }

      const firstPid = pids[0];
      console.log("Navigating to product:", firstPid);

      // ✅ Clear search bar and suggestions before navigation
      setQuery("");
      setSuggestions([]);

      navigate(`/product/${firstPid}`);
    } catch (error) {
      console.error("Error fetching product ID:", error);
      alert("⚠️ An error occurred. Please try again later.");
    }
  };

=======
    navigate("/user");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/user");
    window.location.reload();
  };
>>>>>>> 181a78da99372caa3b2c5bf57ca92d80ffd46e76

  // 🔍 Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      console.log("Query in fetchSuggestions:", query);
      if (query.length > 0) {
        try {
          const response = await fetch(`http://localhost:8095/products/suggestions/${query}`);
          if (!response.ok) throw new Error("Failed to fetch suggestions");
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query]);

  // 🔍 Handle search and navigation
  const handleSearch = async (searchQuery = null) => {
    const finalQuery = searchQuery || query; // ✅ Use `searchQuery` if provided, otherwise use `query`

    if (!finalQuery.trim()) {
        alert("Product cannot be empty");
      console.error("❌ Invalid search query:", finalQuery);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8095/products/getpidwithidentifier/${finalQuery}`);

      if (!response.ok) {
        throw new Error("Failed to fetch product IDs");
      }

      const pids = await response.json();
      console.log("Fetched PIDs:", pids);

      if (!Array.isArray(pids) || pids.length === 0) {
               if(suggestions.length > 0){
                  console.log("🔗 Navigating to Suggestions Page");
                    console.log("Suggestions passed:", suggestions);

                    navigate("/suggestions", { state: { suggestions } });
                    setQuery("");
                    setSuggestions([]);
                    return ;
                    }
                else{
              alert("❌ Product not found.");
              return;
              }
            }

      const firstPid = pids[0];
      console.log("Navigating to product:", firstPid);

      // ✅ Clear search bar and suggestions before navigation
      setQuery("");
      setSuggestions([]);

      navigate(`/product/${firstPid}`);

    } catch (error) {
      console.error("Error fetching product ID:", error);
      alert("⚠️ An error occurred. Please try again later.");
    }
  };

  return (
    <nav className="navbar">
      {/* Logo & Search */}
      <div className="main-nav">
<<<<<<< HEAD
        <div className="logo" onClick={() => navigate("/")}>
          Ever Buy
        </div>

        {/* Search Bar */}
         
        {!hideSearchBar && (

                 <div className="search-bar" style={{ position: "relative" }}>
          
                 <input
                   type="text"
                   placeholder="What are you looking for today?"
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   onKeyPress={(e) => e.key === "Enter" && handleSearch()} // ✅ Search on Enter key
                 />
                 <button className="search-btn" onClick={() => handleSearch()}>
                   <FaSearch />
                 </button>
       
                 {/* 🔍 Search Suggestions Dropdown */}
                 {suggestions.length > 0 && (
                   <ul
                     style={{
                       position: "absolute",
                       top: "100%",
                       left: "0",
                       width: "100%",
                       backgroundColor: "white",
                       border: "1px solid #ccc",
                       listStyleType: "none",
                       padding: "5px",
                       margin: 0,
                       zIndex: 1000,
                     }}
                   >
                     {suggestions.map((product, index) => (
                       <li
                         key={index}
                         onClick={() => handleSearch(product)} // ✅ Pass product directly
                         style={{ padding: "8px", cursor: "pointer" }}
                       >
                         {product}
                       </li>
                     ))}
                   </ul>
                 )}
               </div>
               
         )}
      

        {/* User & Cart Icons */}
        <div className="user-cart">

          {/* <Tooltip title="My Profile"> */}
          <IconButton
            onClick={handleClick}
            sx={{
              color: "black",
            }}
          >
=======
        <div className="logo" onClick={() => navigate("/")}>Ever Buy</div>

        {/* Search Bar */}
        <div className="search-bar" style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="What are you looking for today?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()} // ✅ Search on Enter key
          />
          <button className="search-btn" onClick={() => handleSearch()}>
            <FaSearch />
          </button>

          {/* 🔍 Search Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                left: "0",
                width: "100%",
                backgroundColor: "white",
                border: "1px solid #ccc",
                listStyleType: "none",
                padding: "5px",
                margin: 0,
                zIndex: 1000,
              }}
            >
              {suggestions.map((product, index) => (
                <li
                  key={index}
                  onClick={() => handleSearch(product)} // ✅ Pass product directly
                  style={{ padding: "8px", cursor: "pointer" }}
                >
                  {product}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* User & Cart Icons */}
        <div className="user-cart">
          <IconButton onClick={handleClick}>
>>>>>>> 181a78da99372caa3b2c5bf57ca92d80ffd46e76
            <FaUser className="icon" />
          </IconButton>
          {/* </Tooltip> */}

          

<<<<<<< HEAD
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {login ? (
              <>
                <MenuItem onClick={handleProfile}>My Profile</MenuItem>
                <MenuItem onClick={() => navigate("/order")}>
                  My Orders
                </MenuItem>
=======
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            {login ? (
              <>
                <MenuItem onClick={handleProfile}>My Profile</MenuItem>
                <MenuItem onClick={() => navigate("/order")}>My Orders</MenuItem>
>>>>>>> 181a78da99372caa3b2c5bf57ca92d80ffd46e76
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
              </>
            ) : (
              <MenuItem onClick={handleLogin}>Login</MenuItem>
            )}
          </Menu>

<<<<<<< HEAD
          <Tooltip title="My Cart">
             <FaShoppingBag className="icon" onClick={() => navigate("/cart")} />
          </Tooltip>
=======
          <FaShoppingBag className="icon" onClick={() => navigate("/cart")} />
>>>>>>> 181a78da99372caa3b2c5bf57ca92d80ffd46e76
        </div>
      </div>
    </nav>
  );
};

<<<<<<< HEAD
export default Navbar;


=======
export default Navbar;
>>>>>>> 181a78da99372caa3b2c5bf57ca92d80ffd46e76
