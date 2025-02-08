// validation.js

export const validateForm = (formValues) => {
    const errors = {};
  
    // Name validation
    if (!/^[\x41-\x7A\u00C0-\uD7FB\ \']+([\-])*[.]{0,1}$/.test(formValues.fullName) || formValues.fullName.length === 0 || formValues.fullName.length >= 50) {
      errors.fullName = "Full name must contain letters only";
    }
  
    // Email validation
    // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email) || formValues.email.length > 50) {
    //   errors.email = "Please enter a valid email address";
    // }

    if (!/^[a-zA-Z0-9_]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formValues.email) ||  
        /\.{2,}/.test(formValues.email) || // Prevents consecutive dots
        /([a-zA-Z]{2,})\.\1$/.test(formValues.email) || // Prevents repeated TLDs like '.com.com', '.in.in'
        formValues.email.length > 50) {
        errors.email = "Please enter a valid email address";
    }
  
    // Password validation
    if (formValues.password.length < 8 || formValues.password.length > 15) {
      errors.password = "Password must be between 8 to 15 characters";
    }
    
    if (formValues.password !== formValues.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    // Phone number validation
    if (!/^[0-9]{10}$/.test(formValues.phone)) {
      errors.phone = "Phone number must be 10 digits";
    }
  
    // Country code validation
    // if (/^[0-9]$/.test(formValues.countryCode) && formValues.countryCode <= 0 || formValues.countryCode >= 999) {
    //   errors.countryCode = " country code must be in numbers";
    // }

    if (!formValues.countryCode) {
      errors.countryCode = "Country code is required";
    } else if (!/^\d{1,4}$/.test(formValues.countryCode)) {
      errors.countryCode = "country code must be in numbers and length must be one to four ";
    }
  
    return errors;
  };
  