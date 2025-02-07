// import React, { useState } from "react";
// import { Container, Grid, Typography, Stack } from "@mui/material";
// import OrderCard from "./OrderCard";
//
// const OrderPage = () => {
//   const [cartItems, setCartItems] = useState([
//     {
//       id: 1,
//       name: "Premium Wireless Headphones",
//       price: 299.99,
//       quantity: 1,
//       image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
//       maxQuantity: 5
//     },
//     {
//       id: 2,
//       name: "Smart Watch Series 5",
//       price: 399.99,
//       quantity: 1,
//       image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
//       maxQuantity: 3
//     },
//     {
//       id: 3,
//       name: "Ultra HD Camera",
//       price: 899.99,
//       quantity: 1,
//       image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
//       maxQuantity: 2
//     }
//   ]);
//
//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
//         Orders
//       </Typography>
//
//       <Grid container spacing={4}>
//         <Grid item xs={12}>
//           <Stack spacing={3}>
//             {cartItems.map((item) => (
//               <OrderCard
//                 key={item.id}
//                 item={item}
//               />
//             ))}
//           </Stack>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };
//
// export default OrderPage;



import React, { useState, useEffect } from "react";
import { Container, Grid, Typography } from "@mui/material";
import OrderCard from "./OrderCard";

const OrderPage = ({ customerId }) => {
  const [orderProducts, setOrderProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8098/orders/1`) // Make sure this matches your backend endpoint
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((orders) => {
              if (!Array.isArray(orders)) {
                throw new Error("Received data is not an array");
              }
              // Initiate the fetching of order items and product details
              return Promise.all(
                orders.map((order) =>
                  fetch(`http://localhost:8098/orders/items/${order.oid}`)
                    .then(res => res.json())
                    .then(orderItems =>
                      Promise.all(orderItems.map(item =>
                        fetch(`http://localhost:8095/products/product/${item.productId}`)
                          .then(res => res.json())
                          .then(product => {
                            // Log each product fetched by pid for debug purposes
                            console.log(`Product fetched for pid ${item.pid}:`, product);
                            return {
                              ...product,
                              quantity: item.quantity,
                            };
                          })
                      ))
                    )
                )
              );
            })
      .then(completeOrders => {
        setOrderProducts(completeOrders.flat());
      })
      .catch(error => {
        console.error('Error fetching order data:', error);
      })
      .finally(() => setIsLoading(false));
  }, [customerId]);

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
