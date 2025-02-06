

import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Typography, Button, Card, CardContent, Stack, CircularProgress } from "@mui/material";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import CartItem from "../../Components/Cart/Card";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();
  const saumyaIp = "10.65.1.76";
  const userPort = "8080";
  const cartPort = "8081";
  const abhishekIp = "10.65.1.185";
  const productPort="8095";

  // Fetch user ID
  const fetchUserId = async (email, saumyaIp, userPort) => {
    try {
      const response = await fetch(`http://${saumyaIp}:${userPort}/user/id/${email}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user ID: ${response.status} ${response.statusText}`);
      }
      const userId = await response.json();
      return userId;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
  };

  // Fetch product details
  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(`http://${abhishekIp}:${productPort}/products/product/${productId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product details: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching product details for pid: ${productId}`, error);
      return null;
    }
  };

  // Get cart items
  useEffect(() => {
    const getUserEmail = () => {
      const sessionData = sessionStorage.getItem("user");
      return sessionData ? JSON.parse(sessionData).email : null;
    };

    const getCartItems = async (userId) => {
      setLoading(true);
      try {
        const cartResponse = await fetch(`http://${saumyaIp}:${cartPort}/user/cart/${userId}`);
        if (!cartResponse.ok) {
          throw new Error(`Failed to fetch cart items: ${cartResponse.status} ${cartResponse.statusText}`);
        }
        const cartData = await cartResponse.json();
         
        const cartItemsWithDetails = await Promise.all(
          cartData.map(async (cartItem) => {
            const productDetails = await fetchProductDetails(cartItem.productId);
            console.log(productDetails);
            return { ...cartItem, ...productDetails }; 
          })
        );
        setCartItems(cartItemsWithDetails);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    const email = getUserEmail();
    if (email) {
      setUserEmail(email);
      fetchUserId(email, saumyaIp, userPort)
        .then((userId) => {
          if (userId) {
            setUserId(userId);
            getCartItems(userId);
          } else {
            setLoading(false); 
          }
        });
    } else {
      setLoading(false); 
    }
  }, []);

const checkStockBeforeUpdate = (productId, quantity) => {
  const item = cartItems.find(item => item.productId === productId);
  if (item && quantity > item.stock) {
    alert(`Cannot update quantity. Only ${item.stock} items are in stock.`);
    return false;
  }
  return true;
};

  // Update item quantity and backend
  const editQuantity = async (cartId, quantity , productId) => {

   if (!checkStockBeforeUpdate(productId, quantity)) {
    return;
    }

    try {
      const response = await fetch(`http://${saumyaIp}:${cartPort}/user/cart/${cartId}/${quantity}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ quantity }),
      });
      
      if (response.ok) {
        // Update local state after successful backend update
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.cartId === cartId ? { ...item, quantity } : item
          )
        );
      } else {
        console.error("Failed to update quantity in the cart");
      }
    } catch (error) {
      console.error("Error updating quantity in the cart:", error);
    }
  };

  // Remove item from cart
  const removeItem = async (cartId) => {
    try {
      const response = await fetch(`http://${saumyaIp}:${cartPort}/user/cart/${cartId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted item from the cartItems state
        setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));
      } else {
        console.error("Failed to delete item from the cart");
      }
    } catch (error) {
      console.error("Error deleting item from the cart:", error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleContinueShopping = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Shopping Cart
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {cartItems.length === 0 ? (
                <Typography variant="body1">Your cart is empty.</Typography>
              ) : (
                cartItems.map((item) => (
                  <CartItem 
                    key={item.cartId} 
                    item={item} 
                    updateQuantity={editQuantity} 
                    removeItem={removeItem} 
                  />
                ))
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ position: "sticky", top: 20 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cart Summary
                </Typography>
                <Box sx={{ my: 2 }}>
                  <Typography variant="body1">
                    Total Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 2 }}>
                    Total: ${getTotalPrice().toFixed(2)}
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <Button variant="contained" size="large" startIcon={<FiShoppingCart />}>
                    Buy Now
                  </Button>
                  <Button variant="outlined" size="large" onClick={handleContinueShopping}>
                    Continue Shopping
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default CartPage;
