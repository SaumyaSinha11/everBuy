import React, { useState, useEffect } from "react";
import "./TrendingProduct.css";
import { useNavigate } from "react-router-dom";

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // State for error message
  const navigate = useNavigate();

  const abhishekIp = "10.65.1.185";

  const productPort="8095";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://${abhishekIp}:${productPort}/products`
        );

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
  }, []);

  const handleProductClick = (pid) => {
    navigate(`/product/${pid}`);
  };

  return (
    <div className="trending-section">
      <div className="trending-header">
        <h2>TRENDING NOW</h2>
        {/* <button className="view-all-btn">VIEW ALL</button> */}
      </div>

      {loading && !error ? (
        <p>Loading products...</p>  // Show loading message while fetching
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default TrendingProducts;
