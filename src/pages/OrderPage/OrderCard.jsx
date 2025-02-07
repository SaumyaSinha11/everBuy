// // // import React from "react";
// // // import { Card, CardContent, Grid, Typography, CardMedia } from "@mui/material";
// // // import { styled } from "@mui/system";
// // //
// // // const StyledCard = styled(Card)(({ theme }) => ({
// // //   transition: "transform 0.3s, box-shadow 0.3s",
// // //   "&:hover": {
// // //     transform: "translateY(-4px)",
// // //     boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
// // //   }
// // // }));
// // //
// // // const ProductImage = styled(CardMedia)({
// // //   height: 200,
// // //   objectFit: "cover",
// // //   transition: "transform 0.3s",
// // //   "&:hover": {
// // //     transform: "scale(1.05)"
// // //   }
// // // });
// // //
// // // const OrderCard = ({ item }) => {
// // //   return (
// // //     <StyledCard key={item.id}>
// // //       <Grid container>
// // //         <Grid item xs={12} sm={4}>
// // //           <ProductImage
// // //             component="img"
// // //             image={item.image}
// // //             alt={item.name}
// // //           />
// // //         </Grid>
// // //         <Grid item xs={12} sm={8}>
// // //           <CardContent>
// // //             <Typography variant="h6" noWrap>
// // //               {item.name}
// // //             </Typography>
// // //             <Typography variant="h5" color="primary" sx={{ my: 2 }}>
// // //               ${(item.price * item.quantity).toFixed(2)}
// // //             </Typography>
// // //             <Typography>{item.quantity}</Typography>
// // //           </CardContent>
// // //         </Grid>
// // //       </Grid>
// // //     </StyledCard>
// // //   );
// // // };
// // //
// // // export default OrderCard;
// //
// //
// //
// // import React from "react";
// // import { Card, CardContent, Grid, Typography, CardMedia } from "@mui/material";
// // import { styled } from "@mui/system";
// //
// // const StyledCard = styled(Card)(({ theme }) => ({
// //   transition: "transform 0.3s, box-shadow 0.3s",
// //   "&:hover": {
// //     transform: "translateY(-4px)",
// //     boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
// //   }
// // }));
// //
// // const ProductImage = styled(CardMedia)({
// //   height: 200,
// //   objectFit: "cover",
// //   transition: "transform 0.3s",
// //   "&:hover": {
// //     transform: "scale(1.05)"
// //   }
// // });
// // const OrderCard = ({ product, quantity }) => {
// //   const productImage = product.imageUrls?.[0] || 'placeholder-image.jpg';
// //
// //   // Ensure the price is in the correct format
// //   const formattedPrice = (parseFloat(product.price) * parseInt(quantity, 10)).toFixed(2);
// //
// //   return (
// // {/*     <StyledCard> */}
// // {/*       <Grid container> */}
// // {/*         <Grid item xs={12} sm={4}> */}
// // {/*           <ProductImage */}
// // {/*             component="img" */}
// // {/*             image={productImage} */}
// // {/*             alt={product.name || 'Product Image'} */}
// // {/*           /> */}
// // {/*         </Grid> */}
// // {/*         <Grid item xs={12} sm={8}> */}
// // {/*           <CardContent> */}
// // {/*             <Typography variant="h6" noWrap> */}
// // {/*               {product.name} */}
// // {/*             </Typography> */}
// // {/*             <Typography variant="h5" color="primary" sx={{ my: 2 }}> */}
// // {/*               ${formattedPrice} */}
// // {/*             </Typography> */}
// // {/*             <Typography>Quantity: {quantity}</Typography> */}
// // {/*           </CardContent> */}
// // {/*         </Grid> */}
// // {/*       </Grid> */}
// // {/*     </StyledCard> */}
// //     <StyledCard key={product.id}>
// //           <Grid container>
// //             <Grid item xs={12} sm={4}>
// //               <ProductImage
// //                 component="img"
// //                 image={productImage}
// //                 alt={item.name}
// //               />
// //             </Grid>
// //             <Grid item xs={12} sm={8}>
// //               <CardContent>
// //                 <Typography variant="h6" noWrap>
// //                   {product.name}
// //                 </Typography>
// //                 <Typography variant="h5" color="primary" sx={{ my: 2 }}>
// //                   ${(product.price * quantity).toFixed(2)}
// //                 </Typography>
// //                 <Typography>{quantity}</Typography>
// //               </CardContent>
// //             </Grid>
// //           </Grid>
// //         </StyledCard>
// //   );
// // };
// //
// // export default OrderCard;
//
//
//
// // // import React from "react";
// // // import { Card, CardContent, Grid, Typography, CardMedia } from "@mui/material";
// // // import { styled } from "@mui/system";
// // //
// // // const StyledCard = styled(Card)(({ theme }) => ({
// // //   transition: "transform 0.3s, box-shadow 0.3s",
// // //   "&:hover": {
// // //     transform: "translateY(-4px)",
// // //     boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
// // //   }
// // // }));
// // //
// // // const ProductImage = styled(CardMedia)({
// // //   height: 200,
// // //   objectFit: "cover",
// // //   transition: "transform 0.3s",
// // //   "&:hover": {
// // //     transform: "scale(1.05)"
// // //   }
// // // });
// // //
// // // const OrderCard = ({ item }) => {
// // //   return (
// // //     <StyledCard key={item.id}>
// // //       <Grid container>
// // //         <Grid item xs={12} sm={4}>
// // //           <ProductImage
// // //             component="img"
// // //             image={item.image}
// // //             alt={item.name}
// // //           />
// // //         </Grid>
// // //         <Grid item xs={12} sm={8}>
// // //           <CardContent>
// // //             <Typography variant="h6" noWrap>
// // //               {item.name}
// // //             </Typography>
// // //             <Typography variant="h5" color="primary" sx={{ my: 2 }}>
// // //               ${(item.price * item.quantity).toFixed(2)}
// // //             </Typography>
// // //             <Typography>{item.quantity}</Typography>
// // //           </CardContent>
// // //         </Grid>
// // //       </Grid>
// // //     </StyledCard>
// // //   );
// // // };
// // //
// // // export default OrderCard;
// //
// //
// //
// // import React from "react";
// // import { Card, CardContent, Grid, Typography, CardMedia } from "@mui/material";
// // import { styled } from "@mui/system";
// //
// // const StyledCard = styled(Card)(({ theme }) => ({
// //   transition: "transform 0.3s, box-shadow 0.3s",
// //   "&:hover": {
// //     transform: "translateY(-4px)",
// //     boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
// //   }
// // }));
// //
// // const ProductImage = styled(CardMedia)({
// //   height: 200,
// //   objectFit: "cover",
// //   transition: "transform 0.3s",
// //   "&:hover": {
// //     transform: "scale(1.05)"
// //   }
// // });
// // const OrderCard = ({ product, quantity }) => {
// //   const productImage = product.imageUrls?.[0] || 'placeholder-image.jpg';
// //
// //   // Ensure the price is in the correct format
// //   const formattedPrice = (parseFloat(product.price) * parseInt(quantity, 10)).toFixed(2);
// //
// //   return (
// // {/*     <StyledCard> */}
// // {/*       <Grid container> */}
// // {/*         <Grid item xs={12} sm={4}> */}
// // {/*           <ProductImage */}
// // {/*             component="img" */}
// // {/*             image={productImage} */}
// // {/*             alt={product.name || 'Product Image'} */}
// // {/*           /> */}
// // {/*         </Grid> */}
// // {/*         <Grid item xs={12} sm={8}> */}
// // {/*           <CardContent> */}
// // {/*             <Typography variant="h6" noWrap> */}
// // {/*               {product.name} */}
// // {/*             </Typography> */}
// // {/*             <Typography variant="h5" color="primary" sx={{ my: 2 }}> */}
// // {/*               ${formattedPrice} */}
// // {/*             </Typography> */}
// // {/*             <Typography>Quantity: {quantity}</Typography> */}
// // {/*           </CardContent> */}
// // {/*         </Grid> */}
// // {/*       </Grid> */}
// // {/*     </StyledCard> */}
// //     <StyledCard key={product.id}>
// //           <Grid container>
// //             <Grid item xs={12} sm={4}>
// //               <ProductImage
// //                 component="img"
// //                 image={productImage}
// //                 alt={item.name}
// //               />
// //             </Grid>
// //             <Grid item xs={12} sm={8}>
// //               <CardContent>
// //                 <Typography variant="h6" noWrap>
// //                   {product.name}
// //                 </Typography>
// //                 <Typography variant="h5" color="primary" sx={{ my: 2 }}>
// //                   ${(product.price * quantity).toFixed(2)}
// //                 </Typography>
// //                 <Typography>{quantity}</Typography>
// //               </CardContent>
// //             </Grid>
// //           </Grid>
// //         </StyledCard>
// //   );
// // };
// //
// // export default OrderCard;
//
//
//
// import React from 'react';
// import { Card, CardContent, Grid, Typography, CardMedia, Box } from '@mui/material';
// import { styled } from '@mui/system';
//
// const StyledCard = styled(Card)(({ theme }) => ({
//   maxWidth: 345, // Sets a maximum width for the card
//   boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // Subtle drop shadow
//   transition: '0.3s',
//   '&:hover': {
//     boxShadow: '0 8px 16px rgba(0,0,0,0.2)' // More pronounced drop shadow on hover
//   },
// }));
//
// const ProductImage = styled(CardMedia)({
//   height: 140, // Adjust height to better fit the images
// });
//
// const OrderCard = ({ product, quantity }) => {
//   const productImage = product.imageUrls && product.imageUrls.length > 0
//     ? product.imageUrls[0]
//     : 'placeholder-image.jpg'; // Your placeholder image path
//   const formattedPrice = (parseFloat(product.price) * parseInt(quantity, 10)).toFixed(2);
//
//   return (
//     <StyledCard>
//       <ProductImage
//         component='img'
//         image={productImage}
//         alt={product.name}
//       />
//       <CardContent>
//         <Box sx={{ height: 70 }}> {/* Adding a Box to constrain the height for consistency */}
//           <Typography gutterBottom variant='h6' noWrap>
//             {product.name}
//           </Typography>
//         </Box>
//         <Typography variant='h5' color='primary' noWrap>
//           ${formattedPrice}
//         </Typography>
//         <Typography color='textSecondary'>
//           Quantity: {quantity}
//         </Typography>
//       </CardContent>
//     </StyledCard>
//   );
// };
//
// export default OrderCard;


import React from 'react';
import { Card, CardContent, Grid, Typography, CardMedia, Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345, // Sets a maximum width for the card
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // Subtle drop shadow
  transition: '0.3s',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)' // More pronounced drop shadow on hover
  },
}));

const ProductImage = styled(CardMedia)({
  height: 140, // Adjust height to better fit the images
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
        <Typography color='textSecondary' sx={{ mt: 1, fontStyle: 'italic' }}>
          Order Received: {formattedPlaceTime}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default OrderCard;

