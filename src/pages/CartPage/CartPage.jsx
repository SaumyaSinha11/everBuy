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
import ToBuy from "../../Components/BuyNow/ToBuy";
import { useUser } from "../../App";


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

  // Fetch product details
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
      console.log("userEmail:",userEmail);
      return userEmail ;
    };

    // const getCartItemsFromLocalStorage = () =>{
    //    const cartItem = localStorage.getItem("guestCart");
    //    console.log(cartItem);
    //    return cartItem;
    // }

    const getCartItems = async (userId) => {
      // setCartItems(getCartItemsFromLocalStorage);
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
            const productDetails = await fetchProductDetails(
              cartItem.productId
            );
            console.log(productDetails);
            console.log("cartItems",cartItems);
            return { ...cartItem, ...productDetails };
          })
        );
        setCartItems(cartItemsWithDetails);
        console.log(cartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    const email = getUserEmail();
    if (email) {
      setUserEmail(email);
      fetchUserId(email, saumyaIp, userPort).then((userId) => {
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
    const item = cartItems.find((item) => item.productId === productId);
    if (item && quantity > item.stock) {
      alert(`Cannot update quantity. Only ${item.stock} items are in stock.`);
      return false;
    }
    return true;
  };

  // Update item quantity and backend
  const editQuantity = async (cartId, quantity, productId) => {
    if (!checkStockBeforeUpdate(productId, quantity)) {
      return;
    }

    try {
      const response = await fetch(
        `http://${saumyaIp}:${cartPort}/user/cart/${cartId}/${quantity}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({ quantity }),
        }
      );

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
      const response = await fetch(
        `http://${saumyaIp}:${cartPort}/user/cart/${cartId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remove the deleted item from the cartItems state
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.cartId !== cartId)
        );
      } else {
        console.error("Failed to delete item from the cart");
      }
    } catch (error) {
      console.error("Error deleting item from the cart:", error);
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
      alert("User not identified.");
      return;
    }
    // Create a map of productId -> quantity
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
       cartId:item.cartId,
    }));

 
    console.log("Email:", userEmail);
    console.log("UserId:", userId);
    console.log("Product Map:", productMap);
    console.log("Product Details:", productDetails);
    try {
      // for (const item of cartItems) {
      //   await removeItem(item.cartId); 
      // }
      console.log("email of user:",userEmail);
      console.log("Navigating with state:", { userId, userEmail, productMap, productDetails });
      navigate("/product/buy", {
        state:{userId,userEmail ,productMap, productDetails ,cartIdList },
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


// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Container,
//   Grid,
//   Typography,
//   Button,
//   Card,
//   CardContent,
//   Stack,
//   CircularProgress,
// } from "@mui/material";
// import { FiShoppingCart } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import CartItem from "../../Components/Cart/Card";
// import { useUser } from "../../App";

// const CartPage = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userEmail, setUserEmail] = useState(null);
//   const [userId, setUserId] = useState(null);

//   const navigate = useNavigate();
//   const saumyaIp = "10.65.1.76";
//   const userPort = "8080";
//   const cartPort = "8081";
//   const abhishekIp = "10.65.1.185";
//   const productPort = "8095";
//   const { login } = useUser();

//   // Fetch user ID
//   const fetchUserId = async (email) => {
//     try {
//       const response = await fetch(`http://${saumyaIp}:${userPort}/user/id/${email}`);
//       if (!response.ok) throw new Error("Failed to fetch user ID");
//       return await response.json();
//     } catch (error) {
//       console.error("Error fetching user ID:", error);
//       return null;
//     }
//   };

//   // Fetch product details
//   const fetchProductDetails = async (productId) => {
//     try {
//       const response = await fetch(`http://${abhishekIp}:${productPort}/products/product/${productId}`);
//       if (!response.ok) throw new Error("Failed to fetch product details");
//       return await response.json();
//     } catch (error) {
//       console.error(`Error fetching product details for productId: ${productId}`, error);
//       return null;
//     }
//   };

//   // Load cart items from backend
//   const getCartItemsFromBackend = async (userId) => {
//     try {
//       const cartResponse = await fetch(`http://${saumyaIp}:${cartPort}/user/cart/${userId}`);
//       if (!cartResponse.ok) throw new Error("Failed to fetch cart items");

//       const cartData = await cartResponse.json();
//       const cartItemsWithDetails = await Promise.all(
//         cartData.map(async (cartItem) => {
//           const productDetails = await fetchProductDetails(cartItem.productId);
//           return productDetails ? { ...cartItem, ...productDetails } : null;
//         })
//       );
//       return cartItemsWithDetails.filter((item) => item !== null);
//     } catch (error) {
//       console.error("Error fetching cart items from backend:", error);
//       return [];
//     }
//   };

//   // Load cart items from local storage
//   const getCartItemsFromLocalStorage = async () => {
//     const storedCart = JSON.parse(localStorage.getItem("guestCart")) || [];
//     const cartItemsWithDetails = await Promise.all(
//       storedCart.map(async (item) => {
//         const productDetails = await fetchProductDetails(item.productId);
//         return productDetails ? { ...item, ...productDetails } : null;
//       })
//     );
//     return cartItemsWithDetails.filter((item) => item !== null);
//   };

//   // Load cart items based on login status
//   useEffect(() => {
//     const loadCartItems = async () => {
//       setLoading(true);
//       let email = localStorage.getItem("userEmail");
//       let localCartItems = await getCartItemsFromLocalStorage();

//       if (email) {
//         setUserEmail(email);
//         const userId = await fetchUserId(email);
//         if (userId) {
//           setUserId(userId);
//           const backendCartItems = await getCartItemsFromBackend(userId);

//           // Merge local and backend cart items
//           const mergedCartItems = mergeCarts(localCartItems, backendCartItems);
//           setCartItems(mergedCartItems);
//           localStorage.removeItem("guestCart"); // Clear local cart after merging
//         } else {
//           setCartItems(localCartItems);
//         }
//       } else {
//         setCartItems(localCartItems);
//       }
//       setLoading(false);
//     };

//     loadCartItems();
//   }, []);

//   // Merge local cart and backend cart, increasing quantity for duplicate products
//   const mergeCarts = (localCart, backendCart) => {
//     const mergedCart = [...backendCart];

//     localCart.forEach((localItem) => {
//       const existingItem = mergedCart.find((item) => item.productId === localItem.productId);
//       if (existingItem) {
//         existingItem.quantity += localItem.quantity;
//       } else {
//         mergedCart.push(localItem);
//       }
//     });

//     return mergedCart;
//   };

//   // Update quantity
//   const editQuantity = async (cartId, quantity, productId) => {
//     try {
//       const response = await fetch(`http://${saumyaIp}:${cartPort}/user/cart/${cartId}/${quantity}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (response.ok) {
//         setCartItems((prevItems) =>
//           prevItems.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
//         );
//       } else {
//         console.error("Failed to update quantity in cart");
//       }
//     } catch (error) {
//       console.error("Error updating quantity:", error);
//     }
//   };

//   // Remove item from cart
//   const removeItem = async (cartId) => {
//     try {
//       const response = await fetch(`http://${saumyaIp}:${cartPort}/user/cart/${cartId}`, { method: "DELETE" });
//       if (response.ok) {
//         setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));
//       } else {
//         console.error("Failed to delete item from cart");
//       }
//     } catch (error) {
//       console.error("Error deleting cart item:", error);
//     }
//   };

//   const handleBuy = () => {
//     if (!userId || !userEmail) {
//       alert("Please login to proceed.");
//       navigate("/login");
//       return;
//     }

//     const productDetails = cartItems.map((item) => ({
//       productId: item.productId,
//       productName: item.name,
//       price: parseFloat(item.price),
//       totalPrice: parseFloat(item.price * item.quantity),
//       quantity: item.quantity,
//     }));

//     navigate("/product/buy", {
//       state: { userId, userEmail, productDetails },
//     });
//   };

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
//         Shopping Cart
//       </Typography>
//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", height: "50vh" }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Grid container spacing={4}>
//           <Grid item xs={12} md={8}>
//             <Stack spacing={3}>
//               {cartItems.length === 0 ? (
//                 <Typography>Your cart is empty.</Typography>
//               ) : (
//                 cartItems.map((item) => (
//                   <CartItem key={item.cartId} item={item} updateQuantity={editQuantity} removeItem={removeItem} />
//                 ))
//               )}
//             </Stack>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <Card sx={{ position: "sticky", top: 20 }}>
//               <CardContent>
//                 <Typography variant="h6">Cart Summary</Typography>
//                 <Typography variant="h5">Total: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</Typography>
//                 <Button variant="contained" onClick={handleBuy} disabled={cartItems.length === 0}>
//                   Buy Now
//                 </Button>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       )}
//     </Container>
//   );
// };

// export default CartPage;
