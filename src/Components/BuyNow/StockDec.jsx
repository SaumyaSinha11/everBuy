const StockDec = async (productMap) => {
    console.log("StockDec function called");
    const abhishekIp = "10.65.1.185";
    const productPort = "8095";

    try {
        console.log("Updating stock for:", productMap);

        // Process all stock updates concurrently
        await Promise.all(
            productMap.map(async (product) => {
                const { pid, quantity } = product;
                console.log("Updating stock for Product ID:", pid, "Quantity:", quantity);

                const response = await fetch(
                    `http://${abhishekIp}:${productPort}/products/decStock/${pid}/${quantity}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Stock update failed for product ${pid}`);
                }
            })
        );

        console.log("Stock updated successfully for all products.");
        // alert("Stock decreased successfully!");
    } catch (error) {
        console.error("Error updating stock:", error);
        alert("Failed to update stock.");
    }
};

export default StockDec;
