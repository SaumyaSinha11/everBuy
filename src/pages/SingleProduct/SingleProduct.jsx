import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import "./SingleProduct.css";
import { useUser } from "../../App";
import ToBuy from "../../Components/BuyNow/ToBuy";
import MerchantList from "./MerchantList";

const SingleProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const abhishekIp = "10.65.1.185";
  const productPort = "8095";

  const saumyaIp = "10.65.1.76";
  const userPort = "8080";
  const cartPort = "8081";

  const navigate = useNavigate();
  const { login } = useUser();

  const handleBuy = async () => {
    console.log("Buy Now button clicked");
    if (!login) {
      navigate("/user");
    } else {
      const userEmail= localStorage.getItem("userEmail");

      if (!userEmail) {
        console.error("No userEmail found in local storage.");
        return;
      }

      const userId = await fetchUserId(userEmail, saumyaIp, userPort);

      if (!userId) {
        console.error("User ID could not be fetched.");
        return;
      }

      console.log("User ID:", userId);
      console.log("Product ID:", productId); // Check if this is the correct product ID
      console.log("Quantity:", quantity);

      const productMap = [
        {
          pid: productId,
          quantity: quantity,
        },
      ];

      console.log("Product map:", productMap);
      const productDetails = [
        {
          productId: parseInt(productId),
          productName: product.name,
          price: parseFloat(product.price),
          totalPrice: parseFloat(product.price * quantity),
          quantity: quantity,
        },
      ];

      console.log("productDetails", productDetails);
      console.log("Navigating with state:", {
        userId,
        userEmail,
        productMap,
        productDetails,
      });


      navigate("/product/buy", {
        state: { userId, userEmail, productMap, productDetails },
      });
    }
  };

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
      const response = await fetch(
        `http://${saumyaIp}:${userPort}/user/id/${email}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user ID");
      }

      const userId = await response.json();
      return userId;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
  };


  const AddToCart = async () => {
    try {
      // Retrieve session data
      const userEmail = localStorage.getItem("userEmail");
      console.log("Add to cart function:", userEmail);

      if (!userEmail) {
        // User is not logged in, store product in localStorage
        const cartItems = JSON.parse(localStorage.getItem("guestCart")) || [];

        const existingProduct = cartItems.find(item => item.productId === productId);
        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          cartItems.push({ productId, quantity });
        }

        localStorage.setItem("guestCart", JSON.stringify(cartItems));
        console.log("Added to guest cart:", cartItems);
        alert("Item added to cart!");
        return;
      }

      // User is logged in, proceed with API call
      const userId = await fetchUserId(userEmail, saumyaIp, userPort);

      if (!userId) {
        console.error("User ID could not be fetched.");
        return;
      }

      console.log("User ID:", userId);
      await addItemToCart(userId, productId, quantity);
    } catch (error) {
      console.error("Error in AddToCart:", error);
    }
  };


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://${abhishekIp}:${productPort}/products/product/${productId}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();
        setProduct(data);
        console.log(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError(
          "We are experiencing technical difficulties. Please try again later."
        );
        setLoading(false);
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
          <p>
            <strong>Brand:</strong> {product.brand}
          </p>
          <p>
            <strong>Category:</strong> {product.category}
          </p>
          <p>
            <strong>Price:</strong> ${product.price}
          </p>
          <p>
            <strong>Rating:</strong> ⭐ 4.5/5
          </p>
          <p>
            <strong>Stock:</strong>{" "}
            {product.stock > 0 ? (
              `${product.stock} available`
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </p>

          {/* Quantity Controls - Disable if Out of Stock */}
          <div className="quantity-controls">
            <button
              className="quantity-btn"
              onClick={decreaseQuantity}
              disabled={product.stock === 0}
            >
              -
            </button>
            <span className="quantity">{quantity}</span>
            <button
              className="quantity-btn"
              onClick={increaseQuantity}
              disabled={product.stock === 0}
            >
              +
            </button>
          </div>

          {/* Buttons - Disable if Out of Stock */}
          <div className="button-sin-pro">
            <button
              className="add-to-cart-btn"
              onClick={AddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
            <button
              className="add-to-cart-btn"
              onClick={handleBuy}
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="product-description">
        <h3>Description</h3>
        <p>
          {product.descriptionId}
        </p>
      </div>
      <MerchantList/>
    </div>
  );
};

export default SingleProduct;