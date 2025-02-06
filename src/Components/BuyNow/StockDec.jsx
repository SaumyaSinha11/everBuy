const StockDec = async (productId, quantity) => {

    const abhishekIp = "10.65.1.185";
    const productPort="8095";
    
    try {
        const response = await fetch("http://your-api-url/decrease-stock", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId, quantity }),
        });

        if (!response.ok) {
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