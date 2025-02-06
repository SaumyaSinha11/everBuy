import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SingleProduct.css";
import { useUser } from "../../App";

const SingleProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [error, setError] = useState(null);

  const abhishekIp = "10.65.1.185";
  const productPort = "8095";
  const saumyaIp = "10.65.1.76";
  const userPort = "8080";

  const navigate = useNavigate();
  const { login } = useUser();

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

  const handleBuy = () => {
    if (!login) {
      navigate("/user");
    } else {
      navigate("/product/buy");
    }
   
    

  };

  const addItemToCart = async (userId, productId, quantity = 1) => {
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
      alert("Item added to cart successfully!");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("Failed to add item to cart.");
    }
  };

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
      setError("We are experiencing technical difficulties. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
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
            <button className="add-to-cart-btn" onClick={handleBuy}>Buy Now</button>
            <button className="add-to-cart-btn" onClick={() => addItemToCart(product.id, quantity)}>Add to Cart</button>
          </div>
        </div>
      </div>
      <div className="product-description">
        <h3>Description</h3>
        <p>{product.description}</p>
      </div>
    </div>
  );
};

export default SingleProduct;
