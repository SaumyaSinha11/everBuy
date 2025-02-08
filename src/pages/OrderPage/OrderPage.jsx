
import { useUser } from "../../App";
import React, { useState, useEffect} from "react";
import { Container, Grid, Typography } from "@mui/material";
import OrderCard from "./OrderCard";
import { useNavigate } from "react-router-dom";

const OrderPage = ({ customerId }) => {
  const [orderProducts, setOrderProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { login } = useUser();
  const navigate = useNavigate();

  const abhishekIp = "10.65.1.185";
  const orderPort = "8098";
  const saumyaIp = "10.65.1.76";
  const userPort = "8080";

  const fetchUserId = async (email) => {
    try {
      const response = await fetch(`http://${saumyaIp}:${userPort}/user/id/${email}`);
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

  useEffect(() => {
    const fetchOrders = async () => {
      if (!login) {
        navigate("/user");
        return;
      }

      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        console.error("No userEmail found in local storage.");
        return;
      }
      const customerId = await fetchUserId(userEmail);

      if (!customerId) {
        console.error("Invalid customer ID");
        setIsLoading(false);
        return;
      }

      try {
        const orderResponse = await fetch(`http://${abhishekIp}:${orderPort}/orders/${customerId}`);
        if (!orderResponse.ok) {
          throw new Error(`HTTP error! Status: ${orderResponse.status}`);
        }
        const orders = await orderResponse.json();

        if (!Array.isArray(orders)) {
          throw new Error("Received data is not an array");
        }

        const completeOrders = await Promise.all(
          orders.map(async (order) => {
            const itemsResponse = await fetch(`http://${abhishekIp}:${orderPort}/orders/items/${order.oid}`);
            const orderItems = await itemsResponse.json();
            console.log("orderItems:",orderItems);
            return Promise.all(
              orderItems.map(async (item) => {
                const productResponse = await fetch(`http://${abhishekIp}:8095/products/product/${item.productId}`);

                if (!productResponse.ok) {
                    console.error(`Error: ${productResponse.status} - ${productResponse.statusText}`);
                    throw new Error(`Failed to fetch product: ${productResponse.status}`);
                }
                
                const text = await productResponse.text(); // Read response as text
                
                try {
                    const product = JSON.parse(text); // Parse manually
                    return { ...product, quantity: item?.quantity };
                    console.log(product);
                } catch (error) {
                    console.error("Invalid JSON response:", text);
                    // throw new Error("Received an invalid JSON response");
                } 
              })
            );
          })
        );

        setOrderProducts(completeOrders.flat());
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [login, navigate]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading your orders...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Your Orders
      </Typography>
      <Grid container spacing={4}>
        {orderProducts.map((product, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <OrderCard product={product} quantity={product.quantity} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default OrderPage;