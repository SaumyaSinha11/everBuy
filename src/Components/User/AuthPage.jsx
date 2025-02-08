import React, { useState, useCallback } from "react";
import {
  Alert, Snackbar, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Stack, TextField, Typography, styled, Link
} from "@mui/material";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaPhoneAlt, FaPlus } from "react-icons/fa";
import { validateForm } from "./ValidateForm";
import { useUser } from "../../App";
import  {useNavigate} from "react-router-dom";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  width: "100%",
  padding: theme.spacing(3),
    margin: "auto",
  boxShadow: theme.shadows[3],
}));

const AuthPage = () => {

    const { login, toggleLogin } = useUser();

  const [showAlert, setShowAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [error, setError] = useState(false)
  const navigate = useNavigate();

  const saumyaIp = "10.65.1.76";
  const userPort="8080";

  const handleClose =()=>{setError(false)}

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    errors: {}
  });

  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    countryCode: "",
    phone: "",
    password: "",
    confirmPassword: "",
    errors: {}
  });
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateEmail = (email) => {
    if (!email || email.length === 0 || email.length > 50) return false;

    // Improved regex
    if (!/^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) ||  
        /\.{2,}/.test(email) || // Prevents consecutive dots
        /([a-zA-Z]{2,})\.\1$/.test(email) || // Prevents repeated TLDs like '.com.com', '.in.in'
        email.includes("..@") || // Prevents "..@" (invalid format)
        email.match(/^\.|\.$/) // Prevents leading or trailing dot
    ) {
        return false;
    }

    return true;
   };

  const validatePassword = (password) => {
    if (password.length >= 8 && password.length <= 15) return true;
    return false;
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!validateEmail(loginForm.email)) errors.email = "Please enter a valid email address ";
    if (!validatePassword(loginForm.password)) errors.password = "Password must be at least 8 characters";
    setLoginForm((prev) => ({ ...prev, errors }));
    if (Object.keys(errors).length === 0) {
      const formattedData = {
        email: loginForm.email,
        password: loginForm.password,
      };

      // console.log("Sending data:", JSON.stringify(formattedData)); 

      try {
        const response = await fetch(`http://${saumyaIp}:${userPort}/users/login`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formattedData),
          cache: 'default'
        });

        if (!response.ok) {
          setError(true)
          const errorText = await response.text();
          throw new Error(`HTTP error! : ${errorText}`);
        }


        const responseData = await response.json();
        // sessionStorage.setItem("user", JSON.stringify(responseData))
        localStorage.setItem("userEmail",responseData.email);

        console.log("Response from server:", responseData.email);
        console.log("Login successful");
        toggleLogin();
        navigate("/");

      } catch (error) {
        console.log("Error in fetching data:", error);
      }

    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(registerForm);
    setRegisterForm((prev) => ({ ...prev, errors }));

    if (Object.keys(errors).length === 0) {
      const formattedData = {
        name: registerForm.fullName,
        email: registerForm.email,
        password: registerForm.password,
        phoneNumber: registerForm.phone,
        phoneCountryCode: Number(registerForm.countryCode)
      };

      console.log("Sending data:", JSON.stringify(formattedData)); // Debugging

      try {
        const response = await fetch(`http://${saumyaIp}:${userPort}/users`, {
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
        localStorage.setItem("userEmail",responseData.email);

        console.log("Response from server:", responseData.email);
        console.log("Register successful");
        toggleLogin();
        navigate("/");

      } catch (error) {
        console.log("Error in fetching data:", error);
      }
    }
  };


  const handleLoginChange = useCallback((field) => (e) => {
    setLoginForm((prev) => ({
      ...prev,
      [field]: e.target.value,
      errors: { ...prev.errors, [field]: "" }
    }));
  }, []);

  const handleRegisterChange = useCallback((field) => (e) => {
    setRegisterForm((prev) => ({
      ...prev,
      [field]: e.target.value,
      errors: { ...prev.errors, [field]: "" }
    }));
  }, []);

  return (
    <>
      <Box
        sx={{
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <StyledCard>
          <CardContent>
            <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
              Login
            </Typography>

            <form onSubmit={handleLoginSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullwidth
                  label="Email"
                  value={loginForm.email}
                  onChange={handleLoginChange("email")}
                  error={!!loginForm.errors.email}
                  helperText={loginForm.errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaEnvelope />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullwidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={handleLoginChange("password")}
                  error={!!loginForm.errors.password}
                  helperText={loginForm.errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaLock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onMouseOver={() => setShowPassword(true)}
                          onMouseOut={()=>setShowPassword(false)}
                          edge="end"
                        >
                          {showPassword ? <FaEye/> : <FaEyeSlash />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {/* <Button onClick={() => setOpenRegister(false)}>Cancel</Button> */}

                <Button
                  fullwidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!loginForm.email || !loginForm.password}
                >
                  Login
                </Button>

                <Typography>
                  Don't have an account?
                  <Link
                    fullwidth
                    variant="outlined"
                    sx={{ cursor: "pointer" }}
                    onClick={() => setOpenRegister(true)}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Stack>
            </form>
          </CardContent>
        </StyledCard>

        <Dialog
          open={openRegister}
          onClose={() => { setShowAlert(false); setOpenRegister(false) }}
          maxWidth="sm"
          fullWidth
        >
          {showAlert && <Alert severity="success">Registration Successful.</Alert>}
          <DialogTitle>Register</DialogTitle>
          <DialogContent>
            <form onSubmit={handleRegisterSubmit}>
              <Stack spacing={3} sx={{ mt: 2 }}>
                <TextField
                  fullwidth="true"
                  label="Full Name"
                  value={registerForm.fullName}
                  onChange={handleRegisterChange("fullName")}
                  error={!!registerForm.errors.fullName}
                  helperText={registerForm.errors.fullName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaUser />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullwidth
                  label="Email"
                  value={registerForm.email}
                  onChange={handleRegisterChange("email")}
                  error={!!registerForm.errors.email}
                  helperText={registerForm.errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaEnvelope />
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ display: 'flex', gap: '1' }}>
                  <TextField
                    label="Country Code"
                    value={registerForm.countryCode}
                    onChange={handleRegisterChange("countryCode")}
                    error={!!registerForm.errors.countryCode}
                    helperText={registerForm.errors.countryCode}
                    sx={{ maxWidth: 120, marginRight: "5px" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaPlus />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Phone Number Input */}
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={registerForm.phone}
                    onChange={handleRegisterChange("phone")}
                    error={!!registerForm.errors.phone}
                    helperText={registerForm.errors.phone}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaPhoneAlt />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <TextField
                  fullwidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={registerForm.password}
                  onChange={handleRegisterChange("password")}
                  error={!!registerForm.errors.password}
                  helperText={registerForm.errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaLock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onMouseOver={() => setShowPassword(true)}
                          onMouseOut={()=>setShowPassword(false)}
                          edge="end"
                        >
                          {showPassword ? <FaEye/> : <FaEyeSlash  />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullwidth
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange("confirmPassword")}
                  error={!!registerForm.errors.confirmPassword}
                  helperText={registerForm.errors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaLock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onMouseOver={() => setShowConfirmPassword(true)}
                          onMouseOut={()=>setShowConfirmPassword(false)}
                          edge="end"
                        >
                          {showConfirmPassword ?<FaEye/> : <FaEyeSlash  />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRegister(false)}>Cancel</Button>
            <Button
              onClick={handleRegisterSubmit} variant="contained" color="primary"
            >
              Register
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Snackbar
        open={error}
        autoHideDuration={3000}
        onClose={handleClose}
        message={"user does not exist"}
      />
    </>
  );
};

export default AuthPage;
