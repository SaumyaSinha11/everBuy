import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  CircularProgress,
} from "@mui/material";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import CartItem from "../../Components/Cart/Card";
import { useUser } from "../../App";


const CartPage = () => {
  const [guestCartItems, setGuestCart] = useState(() => {
    return JSON.parse(localStorage.getItem("guestCart")) || [];
  })
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [refresh, setRefresh] = useState(false)

  const navigate = useNavigate();
  const saumyaIp = "10.65.1.76";
  const userPort = "8080";
  const cartPort = "8081";
  const abhishekIp = "10.65.1.185";
  const productPort = "8095";
  const { login } = useUser();

  // Fetch user ID
  const fetchUserId = async (email, saumyaIp, userPort) => {
    try {
      const response = await fetch(
        `http://${saumyaIp}:${userPort}/user/id/${email}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch user ID: ${response.status} ${response.statusText}`
        );
      }
      const userId = await response.json();
      return userId;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
  };

  const syncGuestCart = async (userId) => {
    const cartItems = guestCartItems;
  
    if (login && userId && cartItems) {
      if (cartItems.length > 0) {
        localStorage.removeItem("guestCart");

        console.log("Syncing guest cart to server:", cartItems);
  
        const itemList = cartItems.map((item) => ({
          userId: userId, // Ensure correct userId usage
          productId: item.productId,
          quantity: item.quantity,
        }));
  
        try {
          const response = await fetch(
            `http://${saumyaIp}:${cartPort}/user/cart/list`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(itemList),
            }
          );
  
          if (!response.ok) {
            throw new Error("Failed to add items from localStorage to cart");
          }
  
          const result = await response.json();
          console.log("Items added to cart successfully:", result);
  
        } catch (error) {
          console.error("Error adding items from localStorage to cart:", error);
        }
      }
    }
  }; 

  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(
        `http://${abhishekIp}:${productPort}/products/product/${productId}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch product details: ${response.status} ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error(
        `Error fetching product details for pid: ${productId}`,
        error
      );
      return null;
    }
  };

  // Get cart items
  useEffect(() => {
    const getUserEmail = () => {
      const userEmail = localStorage.getItem("userEmail");
      console.log("userEmail:", userEmail);
      return userEmail;
    };
  
    const getCartItems = async (userId) => {
      setLoading(true);
      try {
        const cartResponse = await fetch(
          `http://${saumyaIp}:${cartPort}/user/cart/${userId}`
        );
        if (!cartResponse.ok) {
          throw new Error(
            `Failed to fetch cart items: ${cartResponse.status} ${cartResponse.statusText}`
          );
        }
        const cartData = await cartResponse.json();
  
        const cartItemsWithDetails = await Promise.all(
          cartData.map(async (cartItem) => {
            const productDetails = await fetchProductDetails(cartItem.productId);
            return { ...cartItem, ...productDetails };
          })
        );
  
        // Prevent overwriting latest state
        setCartItems((prev) => {
          return JSON.stringify(prev) !== JSON.stringify(cartItemsWithDetails) ? cartItemsWithDetails : prev;
        });
  
        console.log("Updated cartItems:", cartItemsWithDetails);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleGuestCart = async () => {
      if (!login) {
        const storedCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const itemDetails = await Promise.all(
          storedCart.map(async (item) => {
            const productDetails = await fetchProductDetails(item.productId);
            return { ...item, ...productDetails };
          })
        );
  
        setCartItems((prev) => {
          return JSON.stringify(prev) !== JSON.stringify(itemDetails) ? itemDetails : prev;
        });
      }
    };
  
    const initializeCart = async () => {
      const email = getUserEmail();
      if (email) {
        setUserEmail(email);
        const userId = await fetchUserId(email, saumyaIp, userPort);
        if (userId) {
          setUserId(userId);
          console.log("User ID fetched:", userId);
  
          await syncGuestCart(userId);
          await getCartItems(userId);
        } else {
          console.error("User ID is null, skipping cart sync.");
          setLoading(false);
        }
      } else {
        console.log("No email found, handling guest cart...");
        setLoading(false);
        await handleGuestCart();
      }
    };
  
    initializeCart();
  }, [login, refresh]);
  
  

  const checkStockBeforeUpdate = (productId, quantity) => {
    const item = cartItems.find((item) => item.productId === productId);
    if (item && quantity > item.stock) {
      alert(`Cannot update quantity. Only ${item.stock} items are in stock.`);
      return false;
    }
    return true;
  };

  const editQuantity = async (cartId, quantity, productId) => {
    if (!checkStockBeforeUpdate(productId, quantity)) return;
  
    const email = localStorage.getItem("userEmail");
  
    if (email && cartId) {
      try {
        const response = await fetch(
          `http://${saumyaIp}:${cartPort}/user/cart/${cartId}/${quantity}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          }
        );
  
        if (response.ok) {
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
    } else {
      let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
  
      guestCart = guestCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
  
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setCartItems(guestCart);
      // setTimeout(() => setRefresh((prev) => !prev), 50);
      setRefresh((prev)=>!prev)
    }
  };
  
  
  
  const removeItem = async (cartId, productId) => {
    console.log("Received cartId:", cartId);
    console.log("Received productId:", productId);
  
    if (!productId) {
      console.error("Error: productId is undefined!");
      return;
    }
  
    if (!login) {
      const guestCart = guestCartItems
      console.log("Before update:", guestCart);
  
      const updatedCart = guestCart.filter((item) => item.productId !== productId.toString( ));
      console.log("After update:", updatedCart);
  
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
      setGuestCart((prev)=> updatedCart)
      console.log(`Product ${productId} removed from local storage`);
      window.location.reload();
    } else {
      try {
        const response = await fetch(
          `http://${saumyaIp}:${cartPort}/user/cart/${cartId}`,
          { method: "DELETE" }
        );
  
        if (response.ok) {
          setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));
          console.log(`Item ${cartId} removed from server cart`);
        } else {
          console.error("Failed to delete item from the cart");
        }
      } catch (error) {
        console.error("Error deleting item from the cart:", error);
      }
    }
  };
  
  
  

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleBuy = async () => {
    if (!userId || !userEmail) {
      navigate('/login')
      return;
    }

    const productMap = cartItems.map((item) => ({
      pid: item.productId,
      quantity: item.quantity,
    }));

    const productDetails = cartItems.map((item) => ({
      productId: item.productId,
      productName: item.name,
      price: parseFloat(item.price),
      totalPrice: parseFloat(item.price * item.quantity),
      quantity: item.quantity,
    }));

    const cartIdList = cartItems.map((item) => ({
      cartId: item.cartId,
    }));


    console.log("Email:", userEmail);
    console.log("UserId:", userId);
    console.log("Product Map:", productMap);
    console.log("Product Details:", productDetails);
    try {
      // for (const item of cartItems) {
      //   await removeItem(item.cartId); 
      // }
      console.log("email of user:", userEmail);
      console.log("Navigating with state:", { userId, userEmail, productMap, productDetails });
      navigate("/product/buy", {
        state: { userId, userEmail, productMap, productDetails, cartIdList },
      });


    } catch (error) {
      console.error("Error during purchase:", error);
      alert("Failed to process the purchase.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Shopping Cart
      </Typography>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
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
                    productId={item.productId}
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
                    Total Items:{" "}
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 2 }}>
                    Total: ${getTotalPrice().toFixed(2)}
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<FiShoppingCart />}
                    onClick={handleBuy}
                    disabled={cartItems.length === 0}
                  >
                    Buy Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleContinueShopping}
                  >
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
