
// const DirectOrder = async (cid, aid, orderItems) => {

//     const abhishekIp = "10.65.1.185";
//     const productPort="8095";
//     const orderPort ="8098";

//     console.log("DirectOrder function called");
//     console.log("Order Items:", orderItems);
//     console.log("cid",cid);
//     console.log("aid",aid);

//     // Check if the orderItems array is valid
//     if (!Array.isArray(orderItems) || orderItems.length === 0) {
//         console.error("No items to process.");
//         alert("Invalid order details.");
//         return;
//     }
//     try {
//         for (let item of orderItems) {
//             // Fetch the merchant ID from the ProductService microservice
//             console.log("Item:", item);
//             const midResponse = await fetch(`http://${abhishekIp}:${productPort}/getmidFrompid/${item.pid}`);
// //             const midResponse = await fetch(`http://localhost:8095/getmidFrompid/{item.pid}`);
//             if (!midResponse.ok) {
//                 throw new Error(`Failed to retrieve merchant ID for product ID: ${item.pid}`);
//             }
//             const mid = await midResponse.json(); // Extract the MID from the response

//             // Proceed to create the direct order with the retrieved MID
//             const orderResponse = await fetch(`http://${abhishekIp}:${orderPort}/direct`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     cid: cid,
//                     pid: item.pid,
//                     quantity: item.quantity,
//                     mid: mid, // Use the merchant ID obtained from the ProductService
//                     aid: aid,
//                 }),
//             });

//             if (!orderResponse.ok) {
//                 throw new Error("Failed to create direct order. Please try again later.");
//             }

//             // If desired, process the response from creating the order.
//             const orderResult = await orderResponse.json();
//             StockDec(productId , quantity);
//             console.log("Direct order created successfully:", orderResult);

//         }

//         // Notify the user after all orders are created
//         alert("All orders created successfully.");
//     } catch (error) {
// //         console.error("Error creating direct orders:", error);
//         alert("An error occurred while creating orders. Please try again.");
//     }
// };

// export { DirectOrder };


const DirectOrder = async (cid, aid, orderItems) => {
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

export { DirectOrder };
