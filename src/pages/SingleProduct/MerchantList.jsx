import React, { useEffect, useState } from "react";
import MerchantCard from "../../components/merchant/MerchantCard";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";

const MerchantList = () => {
  const [merchants, setMerchants] = useState([]);
  const { productId } = useParams();
  console.log(productId);

  const productPort = "8095";

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const response = await fetch(
          `http://10.65.1.185:${productPort}/products/search/${productId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        let data = await response.json();
        if (!data || !Array.isArray(data)) {
          data = []; // Ensure data is always an array
        }
        const validMerchants = data.filter((merchant) => merchant !== null); // Remove null merchants
        setMerchants(validMerchants);
      } catch (error) {
        console.error("Error fetching merchants:", error);
        setMerchants([]); // Set empty array on error
      }
    };

    fetchMerchants();
  }, [productId]);

  const hasValidMerchants = merchants.length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Show heading only if there are valid merchants */}
      {hasValidMerchants && (
        <Typography
          variant="h6"
          fontWeight="bold"
          textAlign="center"
          mb={2}
          className="col-span-full"
        >
          Top Merchants Selling This Product
        </Typography>
      )}

      {/* Show merchant cards if available, otherwise show nothing */}
      {hasValidMerchants ? (
        merchants.map((merchant, index) => (
          <MerchantCard key={index} merchant={merchant} />
        ))
      ) : null}
    </div>
  );
};

export default MerchantList;