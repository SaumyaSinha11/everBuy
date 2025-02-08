import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  TextField,
  IconButton,
  Button,
  Box,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import { useUser } from "../../App";

const UserProfileCard = () => {
  // const [login, setLogin] = useState(false);
  const { login, toggleLogin } = useUser();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    phoneCountryCode: "",
    errors: {},
  });
  const [alert, setAlert] = useState(false);
  const [edit, setEdit] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const [change, setChange] = useState(true);
  const [error, setError] = useState(false);

  const saumyaIp = "10.65.1.76";
  const userPort = "8080";

  const handleClose = () => {
    setAlert(false);
    setError(false);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (login) {
        const userEmail = localStorage.getItem("userEmail");
        try {
          const response = await fetch(
            `http://${saumyaIp}:${userPort}/users/${userEmail}`
          );
          if (response.ok) {
            const data = await response.json();
            console.log("Profile fetched:", data);
            setUser(data);
          } else {
            console.log("Failed to fetch profile");
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
    };

    fetchUserProfile();
  }, [login]);

  const validateName = (name) => {
    if (
      /^[\x41-\x7A\u00C0-\uD7FB\ \']+([\-])*[.]{0,1}$/.test(name) &&
      name.length < 50 &&
      name.length != 0
    )
      return true;
    return false;
  };

  const validatePhone = (phone) => {
    if (/^[0-9]{10}$/.test(phone)) return true;
    return false;
  };

  const validateCode = (code) => {
    if (Number(code) < 999 && Number(code) > 0) return true;
    return false;
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!validateName(user.name)) errors.name = "Invalid name";
    if (!validatePhone(user.phone)) errors.phone = "Invalid phone number";
    if (!validateCode(user.phoneCountryCode))
      errors.phoneCountryCode = "Invalid country code";
    setUser((prev) => ({ ...prev, errors }));
    if (Object.keys(errors).length === 0) {
      const formattedData = {
        name: user.name,
        email: user.email,
        password: "",
        phoneNumber: user.phone,
        phoneCountryCode: Number(user.phoneCountryCode),
      };
      try {
        const response = await fetch(
          `http://${saumyaIp}:${userPort}/users/${user.email}`,
          {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formattedData),
            cache: "default",
          }
        );
        if (!response.ok) {
          setError(true);
          const errorText = await response.text();
          throw new Error(`HTTP error! : ${errorText}`);
        }
        const responseData = await response.json();
        setEdit(true);
        setAlert(true);
        console.log("Response from server:", responseData);
      } catch (error) {
        console.log(JSON.stringify(formattedData));
        console.log("Error in fetching data:", error);
      }
    }
  };

  const handleEditChange = useCallback(
    (field) => (e) => {
      let value = e.target.value;

      if (field === "phoneCountryCode") {
        // Ensure it always starts with "+"
        value = value.replace(/\D/g, ""); // Remove non-numeric characters
        setUser((prev) => ({
          ...prev,
          [field]: value, // Store only numbers
          errors: { ...prev.errors, [field]: "" },
        }));
      } else {
        setUser((prev) => ({
          ...prev,
          [field]: value,
          errors: { ...prev.errors, [field]: "" },
        }));
      }
    },
    []
  );

  const handleDelete = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm(
      "Are you sure, you want to delete this account"
    );
    if (!confirmed) return;
    try {
      await fetch(`http://${saumyaIp}:${userPort}/users/${user.email}`, {
        method: "DELETE",
      });
      console.log("account deleted");
      toggleLogin();
      sessionStorage.removeItem("user");
      setEdit(false);
      setAlert(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!login ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            marginTop: "30vh",
            textAlign: "center",
          }}
        >
          <p>Oops! You are logged out. Please log in to view your profile.</p>
          <Link
            to="/user"
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            Log In
          </Link>
        </div>
      ) : (
        <Card
          sx={{
            maxWidth: 400,
            mx: "auto",
            mt: 5,
            p: 2,
            boxShadow: 3,
            borderRadius: 3,
          }}
        >
          <CardContent>
            <TextField
              fullWidth
              label="Name"
              variant="standard"
              value={user.name}
              onChange={change ? undefined : handleEditChange("name")}
              error={!!user.errors?.name}
              helperText={user.errors?.name}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              variant="standard"
              value={user.email}
              margin="normal"
              disabled
            />

            <Box sx={{ display: "flex", gap: "1", mt: 4 }}>

              <TextField
                label="Country Code"
                variant="standard"
                value={
                  user.phoneCountryCode ? `+${user.phoneCountryCode}` : "+"
                }
                onChange={
                  change ? undefined : handleEditChange("phoneCountryCode")
                }
                error={!!user.errors?.phoneCountryCode}
                helperText={user.errors?.phoneCountryCode}
                sx={{ maxWidth: 120, marginRight: "5px" }}
              />

              {/* Phone Number Input */}
              <TextField
                fullWidth
                label="Phone Number"
                variant="standard"
                value={user.phone}
                onChange={change ? undefined : handleEditChange("phone")}
                error={!!user.errors?.phone}
                helperText={user.errors?.phone}
              />
            </Box>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                marginTop: "2rem",
                gap: 5,
              }}
            >
              {change ? (
                <>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => {
                        setDelete(true);
                        setChange(false);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Edit">
                    <IconButton
                      variant="contained"
                      onClick={() => {
                        setDelete(false);
                        setChange(false);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setChange(true);
                    }}
                  >
                    Cancel
                  </Button>
                  {isDelete ? (
                    <Button variant="contained" onClick={handleDelete}>
                      Delete
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={handleEdit}>
                      Submit
                    </Button>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      <Snackbar
        open={alert}
        autoHideDuration={3000}
        onClose={handleClose}
        message={edit ? "Edit successful" : "Delete successful"}
      />

      <Snackbar
        open={error}
        autoHideDuration={3000}
        onClose={handleClose}
        message={"invalid credential"}
      />
    </>
  );
};

export default UserProfileCard;
