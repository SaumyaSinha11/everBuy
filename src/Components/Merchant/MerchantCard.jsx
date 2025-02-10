import React from "react";
import { Card, CardContent, CardHeader, CardActions, Typography, Button } from "@mui/material";
import { Phone, Email, Language, Storefront } from "@mui/icons-material";

const MerchantCard = ({ merchant }) => {
  if (!merchant) return null; // Don't render if merchant is null

  return (
    <Card sx={{ width: 250, p: 2, boxShadow: 3, borderRadius: 2, border: "1px solid #ddd" , marginLeft:7}}>
      <CardHeader
        title={
          <Typography variant="subtitle1" fontWeight="bold" display="flex" alignItems="center" gap={1}>
            <Storefront fontSize="small" /> {merchant.shopName} ({merchant.name})
          </Typography>
        }
      />
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {merchant.isoCertificate && (
          <Typography variant="body2" color="success.main" fontWeight="medium">
            ✅ ISO Certified: {merchant.isoCertificate} (Exp: {merchant.isoCertificateExpiry})
          </Typography>
        )}
        <Typography variant="body2">
          🏷️ Selling Since: {new Date(merchant.createdAt).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" display="flex" alignItems="center" gap={1}>
          <Phone fontSize="small" /> +{merchant.countryCode} {merchant.phoneNumber}
        </Typography>
        <Typography variant="body2" display="flex" alignItems="center" gap={1}>
          <Email fontSize="small" /> {merchant.email}
        </Typography>
        {merchant.sellerWebsiteLink && (
          <Typography variant="body2" display="flex" alignItems="center" gap={1}>
            <Language fontSize="small" />
            <a href={merchant.sellerWebsiteLink} target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "none" }}>
              Visit Website
            </a>
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MerchantCard;