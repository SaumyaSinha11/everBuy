//   const createDirectOrder = async (userId, map<productId,quantity>, merchantId,addressId) => {
//       console.log("userId:", userId, "merchantId:", merchantId,"productId",productId);
//
//           // Ensure userId and merchantId are valid
//           if (!userId || !merchantId) {
//               console.error("Invalid userId or merchantId");
//               alert("Invalid order details.");
//               return;
//           }
//       try {
//           const response = await fetch(`http://localhost:8098/direct?cid=${userId}&pid=${productId}&quantity=${quantity}&mid=${merchantId}`, {
//               method: "POST",
//               headers: {
//                   "Content-Type": "application/json",
//               },
//           });
//
//           if (!response.ok) {
//               throw new Error("Failed to create direct order");
//           }
//
//           const order = await response.json();
//           console.log("Order created successfully:", order);
//           alert("Order placed successfully! Redirecting to checkout...");
//           // Redirect to checkout page or show order details
//       } catch (error) {
//           console.error("Error creating order:", error);
//           alert("Failed to place the order.");
//       }
//   };

import StockDec from './StockDec';


const DirectOrder = async (cid, aid, orderItems) => {
    console.log("DirectOrder function called");
      console.log("Order Items:", orderItems);
    const abhishekIp = "10.65.1.185";
      const productPort="8095";
    // Check if the orderItems array is valid
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
        console.error("No items to process.");
        alert("Invalid order details.");
        return;
    }
    try {
        for (let item of orderItems) {
            // Fetch the merchant ID from the ProductService microservice
            console.log("Item:", item);
            const midResponse = await fetch(`http://localhost:8095/getmidFrompid/${item.pid}`);
//             const midResponse = await fetch(`http://localhost:8095/getmidFrompid/{item.pid}`);
            if (!midResponse.ok) {
                throw new Error(`Failed to retrieve merchant ID for product ID: ${item.pid}`);
            }
            const mid = await midResponse.json(); // Extract the MID from the response

            // Proceed to create the direct order with the retrieved MID
            const orderResponse = await fetch('http://localhost:8098/direct', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cid: cid,
                    pid: item.pid,
                    quantity: item.quantity,
                    mid: mid, // Use the merchant ID obtained from the ProductService
                    aid: aid,
                }),
            });

            if (!orderResponse.ok) {
                throw new Error("Failed to create direct order. Please try again later.");
            }

            // If desired, process the response from creating the order.
            const orderResult = await orderResponse.json();
            StockDec(productId , quantity);
            console.log("Direct order created successfully:", orderResult);

        }

        // Notify the user after all orders are created
        alert("All orders created successfully.");
    } catch (error) {
//         console.error("Error creating direct orders:", error);
        alert("An error occurred while creating orders. Please try again.");
    }
};

export { DirectOrder };
