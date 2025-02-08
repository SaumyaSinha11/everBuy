import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

   const [userEmail , setUserEmail] = useState("");
   const [loggedIn , SetLoggedIn] = useState(false);
   const [refresh , setRefresh] =useState(true);

   useEffect(() => {

    const storedEmail = localStorage.getItem('userEmail');
    console.log("Retrieved email from localStorage:", storedEmail);

    if (storedEmail) {
      setUserEmail(storedEmail);
      console.log("Fetching merchant ID from API for email:", storedEmail);

      axios
        .get(`http://localhost:8080/api/merchants/getId/${storedEmail}`)
        .then((response) => {
          console.log("API Response:", response);

          const merchantId = response.data;
          console.log("Merchant ID fetched:", merchantId);

          if (merchantId) {
            setMerchantId(merchantId);
            setIsLoggedIn(true);
            console.log("Merchant authenticated. Logged in:", true);
          } else {
            setIsLoggedIn(false);
            console.log("Merchant ID not found. Logged in:", false);
          }
        })
        .catch((error) => {
          console.error("Error fetching merchant ID:", error);
          setIsLoggedIn(false);
        })
        .finally(() => {
          console.log("Finished fetching merchant ID. Setting loading to false.");
          setLoading(false);
        });
    } else {
      console.log("No email found in localStorage. Setting loading to false.");
      setLoading(false); 
    }
  }, [refresh]);
}
