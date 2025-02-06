const StockDec = async (productId, quantity) => {
    const abhishekIp = "10.65.1.185";
    const productPort = "8095";
    console.log("AtStock:", productId, quantity);

    try {
        const response = await fetch(`http://${abhishekIp}:${productPort}/products/decStock/${productId}/${quantity}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Log the response status and body for debugging
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response from server:", errorData);
            throw new Error("Failed to update stock");
        }

        const data = await response.json();
        console.log("Stock updated:", data);
        alert("Stock decreased successfully!");
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to update stock.");
    }
};

export default StockDec;
