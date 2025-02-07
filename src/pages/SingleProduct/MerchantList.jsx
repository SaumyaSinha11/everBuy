

import React, { useEffect, useState } from "react";

const MerchantList = () => {
  const [products, setProducts] = useState([]);
  const pid = 12; 
  
  const saumyaIp = "10.65.1.76";
  const userPort = "8080";
  const productPort = "8095";
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://${saumyaIp}:${productPort}/products/search/${pid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setProducts(data); // Store fetched data
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [pid]);

  return (
    <div>
      <h2>Merchant List</h2>
      <pre>{JSON.stringify(products, null, 2)}</pre> {/* Display fetched data */}
    </div>
  );
};

export default MerchantList;
