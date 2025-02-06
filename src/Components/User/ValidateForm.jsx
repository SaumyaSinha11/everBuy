// validation.js

export const validateForm = (formValues) => {
    const errors = {};
  
    // Name validation
    if (!/^[\x41-\x7A\u00C0-\uD7FB\ \']+([\-])*[.]{0,1}$/.test(formValues.fullName) || formValues.fullName.length === 0 || formValues.fullName.length >= 50) {
      errors.fullName = "Invalid full name";
    }
  
    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email) || formValues.email.length > 50) {
      errors.email = "Invalid email format";
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
    if (/^[0-9]$/.test(formValues.countryCode) && formValues.countryCode <= 0 || formValues.countryCode >= 999) {
      errors.countryCode = "Invalid country code";
    }
  
    return errors;
  };
  