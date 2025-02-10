import { useUser } from "../../App";
import React, { useState, useEffect } from "react";
import { Container, Grid, Typography } from "@mui/material";
import OrderCard from "./OrderCard";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const [orderProducts, setOrderProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { login } = useUser();
  const navigate = useNavigate();

  const abhishekIp = "10.65.1.185";
  const orderPort = "8098";
  const saumyaIp = "10.65.1.76";
  const userPort = "8080";

  const fetchJsonSafe = async (response) => {
    try {
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  };

  const fetchUserId = async (email) => {
    try {
      const response = await fetch(`http://${saumyaIp}:${userPort}/user/id/${email}`);
      if (!response.ok) throw new Error("Failed to fetch user ID");

      const userId = await fetchJsonSafe(response);
      if (!userId) return null;

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
      const customerId = await fetchUserId(userEmail);

      if (!customerId) {
        console.error("Invalid customer ID");
        setIsLoading(false);
        return;
      }

      try {
        const orderResponse = await fetch(`http://${abhishekIp}:${orderPort}/orders/${customerId}`);
        if (!orderResponse.ok) throw new Error(`HTTP error! Status: ${orderResponse.status}`);

        const orders = await fetchJsonSafe(orderResponse);
        if (!orders || !Array.isArray(orders)) throw new Error("Received invalid orders data");

        const completeOrders = await Promise.all(
          orders.map(async (order) => {
            // Fetch placetime separately
            const placetimeResponse = await fetch(`http://${abhishekIp}:${orderPort}/orders/${order.oid}/placetime`);
            const placetime = await fetchJsonSafe(placetimeResponse);

            const itemsResponse = await fetch(`http://${abhishekIp}:${orderPort}/orders/items/${order.oid}`);
            const orderItems = await fetchJsonSafe(itemsResponse);
            if (!orderItems) return [];

            return Promise.all(
              orderItems.map(async (item) => {
                const productResponse = await fetch(`http://${abhishekIp}:8095/products/product/${item.productId}`);
                const product = await fetchJsonSafe(productResponse);
                return product
                  ? { ...product, quantity: item.quantity, orderDate: placetime } // ✅ Include placetime
                  : null;
              })
            );
          })
        );

        setOrderProducts(completeOrders.flat().filter(Boolean));
      }  catch (error) {
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
      {orderProducts.length === 0 ? (
        <Typography variant="h5" textAlign="center">
          No orders found.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {orderProducts.map((product, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <OrderCard product={product} quantity={product.quantity} orderDate = {product.orderDate}/>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default OrderPage;