
import React from "react";
import { Box, Grid, Typography, IconButton, Rating, CardContent, Card, CardMedia } from "@mui/material";
import { styled } from "@mui/system";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
  }
}));

const ProductImage = styled(CardMedia)({
  height: 200,
  objectFit: "cover",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.05)"
  }
});

const QuantityButton = styled(IconButton)({
  border: "1px solid #e0e0e0",
  borderRadius: "50%",
  padding: "4px"
});

const CartItem = ({ item, updateQuantity, removeItem }) => {
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "#2e7d32";
    if (rating >= 3.5) return "#ed6c02";
    return "#d32f2f";
  };

  const handleQuantityChange = (increment) => {
    const newQuantity = increment ? item.quantity + 1 : item.quantity - 1;
    const email = localStorage.getItem("userEmail");
  
    if (email) {
      // Logged-in user: use cartId
      updateQuantity(item.cartId, newQuantity, item.productId);
    } else {
      // Guest user: use productId only
      updateQuantity(null, newQuantity, item.productId);
    }
  };
  

  return (
    <StyledCard key={item.cartId}>
      <Grid container>
        <Grid item xs={12} sm={4}>
          <ProductImage
            component="img"
            image={item.imageUrls ? item.imageUrls[0] : ""}
            alt={item.name}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1515343480029-43cdfe6b6aae"; // Fallback image
            }}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <CardContent>
            <Typography variant="h6" noWrap>
              {item.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Brand: {item.brand}
            </Typography>
            <Typography variant="h5" color="primary" sx={{ my: 2 }}>
              ${(item.price * item.quantity).toFixed(2)}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating
                value={item.rating??0}
                precision={0.5}
                readOnly
                sx={{
                  color: getRatingColor(item.rating)
                }}
              />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {item.rating}/5
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <QuantityButton
                onClick={() => handleQuantityChange(false)}
                disabled={item.quantity <= 1}
              >
                <FiMinus />
              </QuantityButton>
              <Typography>{item.quantity}</Typography>
              <QuantityButton
                onClick={() => handleQuantityChange(true)}
                disabled={item.quantity >= item.stock}
              >
                <FiPlus />
              </QuantityButton>
              <IconButton
                color="error"
                onClick={() => removeItem(item.cartId, item.pid)}
                sx={{ ml: "auto" }}
              >
                <FiTrash2 />
              </IconButton>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </StyledCard>
  );
};
export default CartItem;