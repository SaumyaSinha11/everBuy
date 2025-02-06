// const StockDec = async (productId, quantity) => {
//     const abhishekIp = "10.65.1.185";
//     const productPort = "8095";
//     console.log("AtStock:", productId, quantity);

//     try {
//         const response = await fetch(`http://${abhishekIp}:${productPort}/products/decStock/${productId}/${quantity}`, {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });

//         // Log the response status and body for debugging
//         if (!response.ok) {
//             const errorData = await response.json();
//             console.error("Error response from server:", errorData);
//             throw new Error("Failed to update stock");
//         }

//         const data = await response.json();
//         console.log("Stock updated:", data);
//         alert("Stock decreased successfully!");
//     } catch (error) {
//         console.error("Error:", error);
//         alert("Failed to update stock.");
//     }
// };

// export default StockDec;


const StockDec = async (productMap) => {
    const abhishekIp = "10.65.1.185";
    const productPort = "8095";

    console.log("AtStock:", productMap);

    try {
        // Convert productMap to an array of Promises
        const stockUpdatePromises = Object.entries(productMap).map(async ([productId, quantity]) => {
            const response = await fetch(`http://${abhishekIp}:${productPort}/products/decStock/${productId}/${quantity}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.error(`Failed to update stock for product ${productId}`);
                throw new Error(`Stock update failed for product ${productId}`);
            }

            return response.json(); // Return response for logging/debugging
        });

        // Wait for all stock update requests to complete
        await Promise.all(stockUpdatePromises);
        
        console.log("Stock updated successfully for all products.");
        alert("Stock decreased successfully!");

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response from server:", errorData);
            throw new Error("Failed to update stock");
        }

        const data = await response.json();
        console.log("Stock updated:", data);
        // alert("Stock decreased successfully!");
    } catch (error) {
        console.error("Error updating stock:", error);
        alert("Failed to update stock.");
    }
};

export default StockDec;
