import React from "react";
import { Card, CardContent, Grid, Typography, CardMedia } from "@mui/material";
import { styled } from "@mui/system";

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

const OrderCard = ({ item }) => {
  return (
    <StyledCard key={item.id}>
      <Grid container>
        <Grid item xs={12} sm={4}>
          <ProductImage
            component="img"
            image={item.image}
            alt={item.name}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <CardContent>
            <Typography variant="h6" noWrap>
              {item.name}
            </Typography>
            <Typography variant="h5" color="primary" sx={{ my: 2 }}>
              ${(item.price * item.quantity).toFixed(2)}
            </Typography>
            <Typography>{item.quantity}</Typography>
          </CardContent>
        </Grid>
      </Grid>
    </StyledCard>
  );
};

export default OrderCard;
