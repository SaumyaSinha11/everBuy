
import React, { useState, useCallback, useEffect } from "react";
import { Box, Button, Card, CardContent, Stack, TextField, Typography, List, styled, ListItem, IconButton, ListItemText, Divider } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 400,
    width: "100%",
    padding: theme.spacing(3),
    boxShadow: theme.shadows[3],
}));

export default function Buy() {
    const navigate = useNavigate();
    const saumyaIp = "10.65.1.76";
    const userPort = "8080";
    const cartPort = "8081";
    const abhishekIp = "10.65.1.185";
    const productPort = "8095";


    const location = useLocation();
    const { userId, userEmail, productMap, productDetails, cartIdList } = location.state || {};
    const [addresses, setAddresses] = useState([]);
    const [edit, setEdit] = useState(false)
    const [submittedAddress, setSubmittedAddress] = useState(false)
    const [addressId, setAddressId] = useState()
    const [addDelete, setDelete] = useState(false)

    useEffect(() => {
        if (!userEmail) return;

        const fetchAddresses = async () => {
            const fetchedAddresses = await getAddress(userEmail);
            setAddresses(fetchedAddresses);
        };

        fetchAddresses();
    }, [userEmail, addDelete]);

    const [formData, setFormData] = useState({
        homeName: "",
        street: "",
        city: "",
        state: "",
        country: "",
        pin: "",
        errors: {},
    });

    const getAddress = async (email) => {
        try {
            const response = await fetch(`http://${saumyaIp}:${userPort}/users/address/${email}`);
            const data = await response.json();
            console.log("Fetched addresses:", data);
            return data;
        } catch (error) {
            console.log("Error fetching address:", error.message);
            return [];
        }
    };

    const setCurrentAddress = (address) => {
        setAddressId(address.addressId);
        setFormData(prev => ({
            ...prev,
            homeName: address.homeName,
            street: address.street,
            city: address.city,
            state: address.state,
            country: address.country,
            pin: address.pinCode,
            errors: {},
        }));
    };

    const editAddress = async (e, address) => {
        e.preventDefault();
        setCurrentAddress(address);
        setSubmittedAddress(true);
        setEdit(true);
        console.log(edit)
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const formattedData = {
            addressId: addressId,
            customerId: userId,
            homeName: formData.homeName,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            pinCode: formData.pin,
        };
        try {
            const response = await fetch(`http://${saumyaIp}:${userPort}/users/address/${userEmail}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                throw new Error(`Failed to update: ${await response.text()}`);
            }

            if(response.ok){setEdit(false)}
        } catch (error) {
            console.log("Error updating address:", error.message);
        }
    };

    const handleDelete = async (e, address) => {
        e.preventDefault();

        const addressId = address.addressId

        const confirmDelete = window.confirm("Are you sure you want to delete this address?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://${saumyaIp}:${userPort}/users/address/${addressId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete: ${await response.text()}`);
            }
            setDelete(prev => !prev);
            console.log("Address deleted successfully!");
        } catch (error) {
            console.log("Error deleting address:", error.message);
        }
    };

    const validateName = (name) => {
        if (/^[a-zA-Z0-9\s,.-]{3,100}$/.test(name) && name.length < 150 && name.length != 0) return true;
        return false;
    };

    const validatePin = (pin) => {
        if (/^[0-9]{4,15}$/.test(pin)) return true;
        return false;
    }

    const validateArea = (area) => {
        if (/^[\x41-\x7A\u00C0-\uD7FB\ \']+([\-])*$/.test(area) && area.length < 50 && area.length >2) return true;
        return false;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!submittedAddress) {
            const errors = {};

            if (!validateName(formData.homeName)) errors.homeName = "Invalid value";
            if (!validateName(formData.street)) errors.street = "Invalid value";
            if (!validateArea(formData.state)) errors.state = "Invalid value";
            if (!validateArea(formData.city)) errors.city = "Invalid value";
            if (!validateArea(formData.country)) errors.country = "Invalid value";
            if (!validatePin(formData.pin)) errors.pin = "Invalid value";

            setFormData((prev) => ({ ...prev, errors }));

            if (Object.keys(errors).length > 0) return;

            try {
                // Ensure userId is fetched
                // const userId = await fetchUserId(email); // Uncomment if needed
                if (!userId) {
                    console.error("Failed to fetch customer ID");
                    return;
                }

                console.log("customer id - ", userId);

                const formattedData = {
                    customerId: userId,
                    homeName: formData.homeName,
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    pinCode: formData.pin,
                };

                console.log("Sending data:", JSON.stringify(formattedData));

                const response = await fetch(`http://${saumyaIp}:${userPort}/users/address`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formattedData),
                    cache: "default",
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! : ${errorText}`);
                }

                const confirmOrder = window.confirm("Should we proceed with your Order?");

                if (!confirmOrder) {
                    navigate(-1);
                    return;
                }

                const responseData = await response.json();
                console.log("email just before sending :", userEmail);
                console.log("productDetails", productDetails);
                stockDec(productMap, responseData);

            } catch (error) {
                console.log("Error in fetching data:", error);
            }
        } else {
            const confirmOrder = window.confirm("Should we proceed with your Order?");

            if (!confirmOrder) {
                navigate(-1);
                return;
            }

            console.log("email just before sending :", userEmail);
            console.log("productDetails", productDetails);
            stockDec(productMap, submittedAddress.addressId);
        }
    };



    const directOrder = async (cid, aid, orderItems) => {
        const abhishekIp = "10.65.1.185";
        const productPort = "8095";
        const orderPort = "8098";

        console.log("DirectOrder function called");
        console.log("Order Items:", orderItems);
        console.log("Customer ID (cid):", cid);
        console.log("Address ID (aid):", aid);

        if (!Array.isArray(orderItems) || orderItems.length === 0) {
            alert("Invalid order details.");
            return;
        }

        try {
            for (let item of orderItems) {
                console.log("Processing item:", item);

                // Fetch Merchant ID for the product
                let mid;
                try {
                    const midResponse = await fetch(`http://${abhishekIp}:${productPort}/getmidFrompid/${item.pid}`);
                    if (!midResponse.ok) {
                        const errorText = await midResponse.text();
                        throw new Error(`Failed to retrieve merchant ID for product ${item.pid}: ${errorText}`);
                    }
                    const midData = await midResponse.json();
                    mid = midData.mid || midData; // Ensure correct extraction
                } catch (error) {
                    console.error(error.message);
                    continue; // Skip this product and proceed with others
                }

                // Proceed with order creation
                try {
                    const orderResponse = await fetch(`http://${abhishekIp}:${orderPort}/direct`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            cid: cid,
                            pid: item.pid,
                            quantity: item.quantity,
                            mid: mid,
                            aid: aid,
                        }),
                    });

                    if (!orderResponse.ok) {
                        const errorText = await orderResponse.text();
                        throw new Error(`Failed to create order for ${item.pid}: ${errorText}`);
                    }

                    const orderResult = await orderResponse.json();
                    console.log("Order created successfully:", orderResult);


                } catch (orderError) {
                    console.error(orderError.message);
                }
            }

            // alert("All orders processed successfully.");
        } catch (error) {
            alert("An unexpected error occurred while creating orders.");
            console.error("Unexpected error:", error);
        }
    };

    const sendEmail = async (email) => {

        try {

            const saumyaIp = "10.65.1.76";
            const userPort = "8080";
            console.log("email in sendEmail fun:", email);
            console.log("proDetails in sendEmailfun:", JSON.stringify(productDetails));
            //  console.log
            const response = await fetch(`http://${saumyaIp}:${userPort}/user/order/${email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productDetails),
            });

            if (!response.ok) {
                throw new Error("Failed to send email");
            }

            const data = await response.json();
            console.log("Email sent successfully:", data);
            alert("Order placed successfully! Check your email.");
            navigate('/order');
            // alert("Email sent successfully!");
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Failed to send email.");
        }
    };

    const stockDec = async (productMap, addressAid) => {
        console.log("StockDec function called");
        const abhishekIp = "10.65.1.185";
        const productPort = "8095";

        try {
            console.log("Updating stock for:", productMap);

            // Process all stock updates concurrently
            await Promise.all(
                productMap.map(async (product) => {
                    const { pid, quantity } = product;
                    console.log("Updating stock for Product ID:", pid, "Quantity:", quantity);

                    const response = await fetch(
                        `http://${abhishekIp}:${productPort}/products/decStock/${pid}/${quantity}`,
                        {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                        }
                    );

                    if (!response.ok) {
                        alert("Product is out of stock !!!!!!!!!");
                        throw new Error(`Stock update failed for product ${pid}`);
                    } else {
                        directOrder(userId, addressAid, productMap);

                        if (cartIdList && cartIdList.length > 0) {
                            for (const item of cartIdList) {
                                await removeItem(item.cartId);
                            }
                        }

                      sendEmail(userEmail);
                      navigate('/order');
                    }

                })
            );

            console.log("Stock updated successfully for all products.");
            // alert("Stock decreased successfully!");
        } catch (error) {
            console.error("Error updating stock:", error);
            alert("Failed to update stock.");
        }
    };

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
                // setCartItems((prevItems) =>
                //   prevItems.filter((item) => item.cartId !== cartId)
                // );
            } else {
                console.error("Failed to delete item from the cart");
            }
        } catch (error) {
            console.error("Error deleting item from the cart:", error);
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
            <stack>
                <StyledCard>
                    <CardContent>
                        <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
                            Add Details
                        </Typography>

                        <form>
                            <Stack spacing={3}>
                                <TextField
                                    fullwidth
                                    label="Home Number"
                                    value={formData.homeName}
                                    onChange={handleDataChange("homeName")}
                                    error={!!formData.errors?.homeName}
                                    helperText={formData.errors?.homeName}
                                />

                                <TextField
                                    fullwidth
                                    label="Street"
                                    value={formData.street}
                                    onChange={handleDataChange("street")}
                                    error={!!formData.errors?.street}
                                    helperText={formData.errors?.street}
                                />
                            </Stack>

                            <Stack direction="row" spacing={2} sx={{ mb: 3, mt: 3 }}>

                                <TextField
                                    fullWidth
                                    label="Country"
                                    value={formData.country}
                                    onChange={handleDataChange("country")}
                                    error={!!formData.errors?.country}
                                    helperText={formData.errors?.country}
                                />
                                <TextField
                                    fullWidth
                                    label="State"
                                    value={formData.state}
                                    onChange={handleDataChange("state")}
                                    error={!!formData.errors?.state}
                                    helperText={formData.errors?.state}
                                />
                            </Stack>

                            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>

                                <TextField
                                    fullWidth
                                    label="City"
                                    value={formData.city}
                                    onChange={handleDataChange("city")}
                                    error={!!formData.errors?.city}
                                    helperText={formData.errors?.city}
                                />
                                <TextField
                                    fullWidth
                                    label="PIN Code"
                                    value={formData.pin}
                                    onChange={handleDataChange("pin")}
                                    error={!!formData.errors?.pin}
                                    helperText={formData.errors?.pin}
                                />
                            </Stack>

                            {/* <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                Submit
                            </Button> */}

                            <div style={{ display: 'flex', justifyContent: 'end', marginTop: '2rem', gap: 5 }}>
                                {!edit ?
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </Button>
                                    : <>
                                        <Button onClick={() => { setEdit(false) }}>Cancel</Button>
                                        <Button variant="contained" onClick={handleEditSubmit}>Submit</Button>

                                    </>
                                }
                            </div>


                        </form>
                    </CardContent>
                </StyledCard>
                <Box
                    sx={{
                        maxWidth: 500,
                        maxHeight: 300,
                        overflowY: "auto",
                        mt: 4,
                        p: 2,
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        backgroundColor: "#f9f9f9",
                    }}
                >
                    <Typography variant="h6">Saved Addresses</Typography>

                    <List>
                        {addresses.map((address) => (
                            <div key={address.addressId}>
                                <ListItem
                                    secondaryAction={
                                        <>
                                            <IconButton edge="end" onClick={(e) => editAddress(e, address)}>
                                                <Edit />
                                            </IconButton>

                                            <IconButton edge="end" onClick={(e) => handleDelete(e, address)}>
                                                <Delete />
                                            </IconButton>
                                        </>
                                    }
                                >
                                    <ListItemText
                                        primary={`${address.homeName}, ${address.street}, ${address.city}`}
                                        secondary={`${address.state}, ${address.country}, ${address.pinCode}`}
                                        onClick={() => setCurrentAddress(address)}
                                    />
                                </ListItem>
                                <Divider />
                            </div>
                        ))}
                    </List>

                </Box>
            </stack>
        </Box>
    );
}