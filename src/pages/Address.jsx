
import React, { useState, useCallback ,useEffect } from "react";
import {
    Alert, Snackbar, Box, Button, Card, CardContent, InputAdornment, Stack, TextField, Typography, styled
} from "@mui/material";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaPhone, FaPlus } from "react-icons/fa";

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 400,
    width: "100%",
    padding: theme.spacing(3),
    boxShadow: theme.shadows[3],
}));

export default function Buy() {
        useEffect(() => {
                const email = JSON.parse(sessionStorage.getItem("user"));
        }, [])

    const fetchUserId = async (email) => {
        try {
          const response = await fetch(`http://8080/user/id/${email}`);
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

    const [formData, setFormData] = useState({
        homeName: "",
        street: "",
        city: "",
        state: "",
        country: "",
        pin: "",
        errors: {},
    });

    const validateName = (name) => {
        if (/^[0-9\x41-\x7A\u00C0-\uD7FB\ \']+([\-])*[.]{0,1}$/.test(name) && name.length < 150 && name.length != 0) return true;
        return false;
    };

    const validatePin = (pin) => {
        if (/^[0-9]{4,15}$/.test(pin)) return true;
        return false;
    }

    const validateArea = (area) => {
        if (/^[\x41-\x7A\u00C0-\uD7FB\ \']+([\-])*$/.test(area) && area.length < 50 && area.length != 0) return true;
        return false;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};
        if (!validateName(formData.homeName)) errors.homeName = "Invalid value";
        if (!validateName(formData.street)) errors.street = "Invalid value";
        if (!validateArea(formData.state)) errors.street = "Invalid value";
        if (!validateArea(formData.city)) errors.city = "Invalid value";
        if (!validateArea(formData.country)) errors.country = "Invalid value";
        if (!validatePin(formData.pin)) errors.pin = "Invalid value";
        setFormData((prev) => ({ ...prev, errors }));
        if (Object.keys(errors).length === 0) {
            const formattedData = {
                customer: "",
                homeName: formData.homeName,
                street: formData.street,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                pinCode: formData.pinCode
            };

            console.log("Sending data:", JSON.stringify(formattedData)); // Debugging
            try {
                const response = await fetch('http://localhost:8080/users/address', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formattedData),
                    cache: 'default'
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! : ${errorText}`);
                }

                const responseData = await response.json();
                console.log("Response from server:", responseData);

            } catch (error) {
                console.log("Error in fetching data:", error);
            }
        }
    };

    const handleDataChange = useCallback((field) => (e) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
            errors: { ...prev.errors, [field]: "" }
        }));
    }, []);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
            }}
        >
            <StyledCard>
                <CardContent>
                    <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
                        Add Details
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                fullwidth
                                label="Home Number"
                                onChange={handleDataChange("homeName")}
                                error={!!formData.errors?.homeName}
                                helperText={formData.errors?.homeName}
                            />

                            <TextField
                                fullwidth
                                label="Street"
                                onChange={handleDataChange("street")}
                                error={!!formData.errors?.street}
                                helperText={formData.errors?.street}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2} sx={{ mb: 3, mt: 3 }}>
                            <TextField
                                fullWidth
                                label="City"
                                onChange={handleDataChange("city")}
                                error={!!formData.errors?.city}
                                helperText={formData.errors?.city}
                            />

                            <TextField
                                fullWidth
                                label="State"
                                onChange={handleDataChange("state")}
                                error={!!formData.errors?.state}
                                helperText={formData.errors?.state}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="Country"
                                onChange={handleDataChange("country")}
                                error={!!formData.errors?.country}
                                helperText={formData.errors?.country}
                            />

                            <TextField
                                fullWidth
                                label="PIN Code"
                                onChange={handleDataChange("pin")}
                                error={!!formData.errors?.pin}
                                helperText={formData.errors?.pin}
                            />
                        </Stack>

                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            Submit
                        </Button>
                    </form>
                </CardContent>
            </StyledCard>
        </Box>
    );
}