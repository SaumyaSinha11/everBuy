
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import "./SingleProduct.css";
import { useUser } from "../../App";

const SingleProduct = () => {
  const { productId } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // State for quantity

  const abhishekIp = "10.65.1.185";
  const productPort="8095";

  const saumyaIp="10.65.1.76";
  const userPort = "8080";
  const cartPort ="8081";

  const navigate = useNavigate()
  const {login} = useUser();

  const handleBuy = () =>{
    if(!login){navigate("/user")}
    else{navigate("/product/buy")}
  }

    // Handle quantity increase
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Handle quantity decrease
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addItemToCart = async (userId, productId, quantity) => {
    try {
      const response = await fetch(`http://${saumyaIp}:${userPort}/user/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const result = await response.json();
      console.log("Item added to cart successfully:", result);
      alert("Item added to cart successfully!");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("Failed to add item to cart.");
    }
  };

  const fetchUserId = async (email, saumyaIp, userPort) => {
    try {
      const response = await fetch(`http://${saumyaIp}:${userPort}/user/id/${email}`);
  
      if (!response.ok) {
        throw new Error("Failed to fetch user ID");
      }
  
      const userId = await response.json();
      
      const sessionData = sessionStorage.getItem("user");
    
      if (sessionData) {
        const user = JSON.parse(sessionData);
        // Add the userId to the user data
        user.userId = userId;
        
        // Update sessionStorage with the new user data
        sessionStorage.setItem("user", JSON.stringify(user));
      }
      
      return userId; // Returning the user ID
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
  };
  
  const AddToCart = async () => {
    try {
      // Retrieve session data
      const sessionData = sessionStorage.getItem("user");
  
      if (!sessionData) {
        console.error("No user data found in session storage.");
        return;
      }
  
      // Parse session data
      const user = JSON.parse(sessionData);
      const email = user.email;
  
      console.log("User Email:", email);
  
      // Fetch user ID
      const userId = await fetchUserId(email, saumyaIp, userPort);
  
      if (!userId) {
        console.error("User ID could not be fetched.");
        return;
      }
  
      console.log("User ID:", userId);

      await addItemToCart(userId, productId , quantity);
      

    } catch (error) {
      console.error("Error in AddToCart:", error);
    }
  };
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://${abhishekIp}:${productPort}/products/product/${productId}`);

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();
        setProduct(data); 
        setLoading(false);  
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("We are experiencing technical difficulties. Please try again later.");  
        setLoading(false);  // Stop loading even if there's an error
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading && !error) return <div>Loading product details...</div>;

  if (error) return <div className="error-message">{error}</div>;

  if (!product) return <div>Product not found</div>; 

  return (
    <div>
      <div className="product-details">
        <div className="image-container">
          <img src={product.imageUrls[0]} alt={product.name} />
        </div>
        <div className="details-container">
          <h2>{product.name}</h2>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Rating:</strong> ⭐ {product.rating}/5</p>
          <p><strong>Stock:</strong> {product.stock} available</p>
          <div className="quantity-controls">
             <button className="quantity-btn" onClick={decreaseQuantity}>-</button>
            <span className="quantity">{quantity}</span>
             <button className="quantity-btn" onClick={increaseQuantity}>+</button>
          </div>
          <div className="button-sin-pro">
          <button className="add-to-cart-btn" 
          onClick={()=>{
            AddToCart();
          }}
          >Add to Cart</button>
          <button className="add-to-cart-btn" onClick={handleBuy}>Buy Now</button>
          </div>
        </div>
      </div>

      <div className="product-description">
        <h3>Description</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inceptos sociosqu sodales erat, nam est habitasse. Suspendisse enim molestie duis lacinia; interdum ante posuere. Libero aptent curae hac dis vulputate lobortis eleifend dui parturient.
          orem ipsum dolor sit amet, consectetur adipiscing elit. Inceptos sociosqu sodales erat, nam est habiorem ipsum dolor sit amet, consectetur adipiscing elit. Inceptos sociosqu sodales erat, nam est habiorem ipsum dolor sit amet, consectetur adipiscing elit. Inceptos sociosqu sodales erat, nam est habiorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inceptos sociosqu sodales erat, nam est habitasse. Suspendisse enim molestie duis lacinia; interdum ante posuere. Libero aptent curae hac dis vulputate lobortis eleifend dui parturient.
         orem ipsum dolor sit amet, consectetur adipiscing elit. Inceptos sociosqu sodales erat, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inceptos sociosqu sodales erat, nam est habitasse. Suspendisse enim molestie duis lacinia; interdum ante posuere. Libero aptent curae hac dis vulputate lobortis eleifend dui parturient.
         orem ipsum dolor sit amet, consectetur adipiscing elit. Inceptos sociosqu sodales erat, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inceptos sociosqu sodales erat, nam est habitasse. Suspendisse enim molestie duis lacinia; interdum ante posuere. Libero aptent curae hac dis vulputate lobortis eleifend dui parturient.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                orem ipsum dolor sit amet, consectetur adipiscing elit. Inceptos sociosqu sodales erat, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inceptos sociosqu sodales erat, nam est habitasse. Suspendisse enim molestie duis lacinia; interdum ante posuere. Libero aptent curae hac dis vulputate lobortis eleifend dui parturient.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               orem ipsum dolor sit amet, consectetur adipiscing elit. Inceptos sociosqu sodales erat, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inceptos sociosqu sodales erat, nam est habitasse. Suspendisse enim molestie duis lacinia; interdum ante posuere. Libero aptent curae hac dis vulputate lobortis eleifend dui parturient.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       orem ipsum dolor sit amet, consectetur adipiscing elit. Inceptos sociosqu sodales erat, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inceptos sociosqu sodales erat, nam est habitasse. Suspendisse enim molestie duis lacinia; interdum ante posuere. Libero aptent curae hac dis vulputate lobortis eleifend dui parturient.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          orem ipsum dolor sit amet, consectetur adipiscing elit. Inceptos sociosqu sodales erat,  Inceptos sociosqu sodales erat, nam est habi
        </p>
      </div>
    </div>
  );
};

export default SingleProduct;


