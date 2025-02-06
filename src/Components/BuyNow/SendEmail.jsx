
const sendEmail = async (productDetails, email) => {
    try {
      // Define the server endpoint for sending email
      const serverIp = "10.65.1.76";  // Replace with your server's IP
      const serverPort = "8082"; // Replace with your email service API port
  
      const response = await fetch(`http://${serverIp}:${serverPort}/sendEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          products: productDetails,  // Pass the array of product details here
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to send email");
      }
  
      const data = await response.json();
      console.log("Email sent successfully:", data);
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
    }
  };
  