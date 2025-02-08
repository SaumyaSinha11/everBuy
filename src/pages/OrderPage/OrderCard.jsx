
import React from 'react';
import { Card, CardContent, Grid, Typography, CardMedia, Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345, 
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
  transition: '0.3s',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)' 
  },
}));

const ProductImage = styled(CardMedia)({
  height: 140, 
});

const OrderCard = ({ product, quantity, placeTime }) => {
  const productImage = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls[0]
    : 'placeholder-image.jpg'; // Your placeholder image path

  const formattedPrice = (parseFloat(product.price) * parseInt(quantity, 10)).toFixed(2);

  // Format placeTime (assuming it's in ISO format)
  const formattedPlaceTime = placeTime ? new Date(placeTime).toLocaleDateString() : 'N/A';

  return (
    <StyledCard>
      <ProductImage
        component='img'
        image={productImage}
        alt={product.name}
      />
      <CardContent>
        <Box sx={{ height: 70 }}> {/* Adding a Box to constrain the height for consistency */}
          <Typography gutterBottom variant='h6' noWrap>
            {product.name}
          </Typography>
        </Box>
        <Typography variant='h5' color='primary' noWrap>
          ${formattedPrice}
        </Typography>
        <Typography color='textSecondary'>
          Quantity: {quantity}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default OrderCard;