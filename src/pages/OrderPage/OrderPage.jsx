import React, { useState } from "react";
import { Container, Grid, Typography, Stack } from "@mui/material";
import OrderCard from "./OrderCard";

const OrderPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 299.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      maxQuantity: 5
    },
    {
      id: 2,
      name: "Smart Watch Series 5",
      price: 399.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
      maxQuantity: 3
    },
    {
      id: 3,
      name: "Ultra HD Camera",
      price: 899.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
      maxQuantity: 2
    }
  ]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Orders
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Stack spacing={3}>
            {cartItems.map((item) => (
              <OrderCard
                key={item.id}
                item={item}
              />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderPage;
