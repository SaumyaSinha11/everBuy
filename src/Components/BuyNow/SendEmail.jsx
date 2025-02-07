
 const sendEmail = async (productDetails, email) => {
  try {

    const saumyaIp = "10.65.1.76"; 
    const userPort = "8080"; 
   console.log("email in sendEmail fun:",email);
   console.log("proDetails in sendEmailfun:",JSON.stringify(productDetails));
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
    alert("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    alert("Failed to send email.");
  }
};

export default sendEmail;