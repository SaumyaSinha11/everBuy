

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
      const sessionData = sessionStorage.getItem("user");

      if (sessionData) {
        const user = JSON.parse(sessionData);
        user.userId = userId; // Update user data with userId
        sessionStorage.setItem("user", JSON.stringify(user));
      }

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

      const sessionData = sessionStorage.getItem("user");
      if (!sessionData) {
        console.error("No user data found in session storage.");
        return;
      }

      const user = JSON.parse(sessionData);
      const email = user.email;
      const customerId = await fetchUserId(email);

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
                const product = await productResponse.json();
                return { ...product, quantity: item.quantity };
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
