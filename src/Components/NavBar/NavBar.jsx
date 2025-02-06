import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { FaSearch, FaUser, FaShoppingBag } from "react-icons/fa";
import { useUser } from "../../App";  // Access the useUser hook from App.js
import { Menu, MenuItem, IconButton } from "@mui/material"; // MUI components
import {useNavigate} from "react-router-dom"; // Import the useNavigate hook

const Navbar = () => {
  const { login } = useUser();
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for the dropdown
  const navigate = useNavigate(); // Navigate to different routes

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the dropdown menu
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the dropdown menu
  };

    const handleProfile = () => {
        navigate("/user/profile");
         setAnchorEl(null);// Navigate to the user profile page
        }

    const handleLogin = () => {
        navigate("/user")
        }

const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/user")
    window.location.reload();
}


  return (
    <nav className="navbar">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="left-links">
          <a href="#">About Us</a>
          <a href="#">Shipping & Returns</a>
        </div>
        <div className="right-links">
          <a href="#">Check out what’s on sale</a>
          <button className="help-btn">HELP CENTER</button>
        </div>
      </div>

      {/* Logo & Search */}
      <div className="main-nav">
        <div className="logo">Ever Buy</div>
        <div className="search-bar">
          <input type="text" placeholder="What are you looking for today?" />
          <button className="search-btn">
            <FaSearch />
          </button>
        </div>
        <div className="user-cart">
          {/* User Dropdown Trigger */}
          <IconButton onClick={handleClick}>
            <FaUser className="icon" />
          </IconButton>

          {/* MUI Dropdown Menu */}
          <Menu
            anchorEl={anchorEl} // Menu anchor element
            open={Boolean(anchorEl)} // Check if the menu should be open
            onClose={handleClose} // Close the menu when clicked outside
          >
            {login ? ( // If the user is logged in
              <>
                <MenuItem onClick={handleProfile}>My Profile</MenuItem>
                <MenuItem>My Orders</MenuItem>
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
              </>
            ) : ( // If the user is not logged in
              <MenuItem onClick={handleLogin}>Login</MenuItem>
            )}
          </Menu>

          <FaShoppingBag className="icon" onClick={()=>{
            navigate('/cart');
          }}/>
        </div>
      </div>

      {/* Bottom Navigation (commented out) */}
      {/* <div className="bottom-nav"> */}
      {/*   <a href="#">Shop All</a> */}
      {/*   <a href="#">Deals & Offers</a> */}
      {/*   <a href="#">DIY Projects & Ideas</a> */}
      {/*   <a href="#">Services</a> */}
      {/* </div> */}
    </nav>
  );
};

export default Navbar;
