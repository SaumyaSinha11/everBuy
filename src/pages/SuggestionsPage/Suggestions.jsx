import React, { useState, useEffect } from "react";
// import "./TrendingProduct.css";
import { useNavigate, useLocation } from "react-router-dom";

const Suggestions = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error message
  const navigate = useNavigate();
  const location = useLocation();

  const abhishekIp = "10.65.1.185";
  const productPort = "8095";
  const suggestion = location.state?.suggestions || [];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Suggestions being sent:", suggestion);

        const response = await fetch(`http://${abhishekIp}:${productPort}/products/by-names`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(suggestion), // Pass the suggestions as the body
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [suggestion]); // Ensure to re-fetch if suggestions change

  const handleProductClick = (pid) => {
    navigate(`/product/${pid}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="trending-section">
      <div className="product-container">
        {products.map((product) => (
          <div key={product.pid} className="product-card" onClick={() => handleProductClick(product.pid)}>
            {product.imageUrls && product.imageUrls.length > 0 && (
              <img src={product.imageUrls[0]} alt={product.name} className="product-image" />
            )}

            <div className="product-info">
              <p className="product-name">{product.name}</p>
              <p className="product-brand">{product.brand}</p>
              <p className="product-price">
                <span className="price">${product.price}</span>
              </p>
              <p className="product-rating">⭐ {product.rating}/5</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
