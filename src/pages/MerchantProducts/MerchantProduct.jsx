import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MerchantProducts.css";
import Navbar from "../../Components/NavBar/NavBar";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';



const MerchantProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addProductVisible, setAddProductVisible] = useState(false);
  const [editProductVisible, setEditProductVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    rating: "",
    brand: "",
    productIdentifier: "",
    descriptionId: "",
    imageUrls: [],
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const abhishekIp = "10.65.1.185";
  const productPort="8095";

  // Fetch products for merchant
  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://${abhishekIp}:${productPort}/products/5`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setOpenSnackbar(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };


  const handleImageUrlsChange = (e) => {
    const value = e.target.value ? e.target.value.split(",") : [];
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      imageUrls: value,
    }));
  };

  // Add a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form inputs
    if (
      !newProduct.name ||
      !newProduct.category ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.rating ||
      !newProduct.brand ||
      !newProduct.productIdentifier ||
      !newProduct.descriptionId ||
      !newProduct.imageUrls.length
    ) {
      setErrorMessage("Please fill all required fields.");
      setOpenSnackbar(true);  // Open Snackbar
      setLoading(false);
      return;
    }

    const product = { ...newProduct };

    try {
      const response = await fetch(`http://${abhishekIp}:${productPort}/addProduct/1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const addedProduct = await response.json();
        setProducts([addedProduct, ...products]);
        setNewProduct({
          name: "",
          category: "",
          price: "",
          stock: "",
          rating: "",
          brand: "",
          productIdentifier: "",
          descriptionId: "",
          imageUrls: [],
        });
        setAddProductVisible(false); // Hide the form
        setLoading(false);
      } else {
        setErrorMessage("Failed to add product. Please try again.");
        setOpenSnackbar(true); // Open Snackbar
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage("Failed to add product. Please try again.");
      setOpenSnackbar(true); // Open Snackbar
      setLoading(false);
    }
  };

  // Show the edit product form
  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditProductVisible(true);
    setAddProductVisible(false);
    setNewProduct({ ...product });
  };

  // Update the product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://${abhishekIp}:${productPort}/products/${newProduct.mid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error(`Failed to update product. Status: ${response.status}`);
      }

      // If response is empty, just proceed with updating UI
      const responseData = await response.text();
      if (responseData) {
        const updatedProduct = JSON.parse(responseData);
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.pid === updatedProduct.pid ? updatedProduct : product
          )
        );
        setEditProductVisible(false);
        fetchProducts();
        console.log("Product updated successfully.");
      } else {
        setLoading(false);
        console.log("Product updated, but no content was returned.");
        setEditProductVisible(false)
        fetchProducts();
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product. Please try again.");
      setLoading(false);
    }
  };


  // Delete the product
  const handleDelete = (product) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this Product?");
    if (!isConfirmed) return;

    try {
      fetch(`http://${abhishekIp}:${productPort}/products/${product.pid}/merchant/${product.mid}`, {
        method: "DELETE",
      })
        .then(() => {
          fetchProducts(); // Re-fetch products after deletion
        })
        .catch((err) => {
          setErrorMessage("Error deleting product.");
          setOpenSnackbar(true);
        });
    } catch (error) {
      setErrorMessage("Error deleting product.");
      setOpenSnackbar(true);
    }
  };

  return (
    <div className="merchant-products">
      <Navbar />
      <div className="merchant-header">
        <h2>Your Products</h2>
        <button
          className="add-product-btn"
          onClick={() => {
            setAddProductVisible(true);
            setEditProductVisible(false);
          }}
        >
          Add Product
        </button>
      </div>

      {/* Edit Product Form */}
      {editProductVisible && (
        <div className="edit-product-form">
          <h3>Edit Product</h3>
          <form onSubmit={handleUpdateProduct}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Category:</label>
              <input
                type="text"
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Price:</label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Stock:</label>
              <input
                type="number"
                name="stock"
                value={newProduct.stock}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Brand:</label>
              <input
                type="text"
                name="brand"
                value={newProduct.brand}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Image URL:</label>
              <input
                type="text"
                name="imageUrls"
                value={newProduct.imageUrls.join(",")}
                onChange={handleImageUrlsChange}
              />
            </div>
            <div>
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setEditProductVisible(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Product Form */}
      {addProductVisible && (
        <div className="add-product-form">
          <h3>Add New Product</h3>
          <form onSubmit={handleAddProduct}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                placeholder="Product name"
              />
            </div>
            <div>
              <label>Category:</label>
              <input
                type="text"
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                placeholder="Product category"
              />
            </div>
            <div>
              <label>Price:</label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                placeholder="Product price"
              />
            </div>
            <div>
              <label>Stock:</label>
              <input
                type="number"
                name="stock"
                value={newProduct.stock}
                onChange={handleInputChange}
                placeholder="Product stock"
              />
            </div>
            <div>
              <label>Rating:</label>
              <input
                type="number"
                name="rating"
                value={newProduct.rating}
                onChange={handleInputChange}
                placeholder="Product rating"
              />
            </div>
            <div>
              <label>Brand:</label>
              <input
                type="text"
                name="brand"
                value={newProduct.brand}
                onChange={handleInputChange}
                placeholder="Product brand"
              />
            </div>
            <div>
              <label>Product Identifier:</label>
              <input
                type="text"
                name="productIdentifier"
                value={newProduct.productIdentifier}
                onChange={handleInputChange}
                placeholder="Product identifier"
              />
            </div>
            <div>
              <label>Description ID:</label>
              <input
                type="text"
                name="descriptionId"
                value={newProduct.descriptionId}
                onChange={handleInputChange}
                placeholder="Description ID"
              />
            </div>
            <div>
              <label>Image URL</label>
              <input
                type="text"
                name="imageUrls"
                value={newProduct.imageUrls.join(",")}
                onChange={handleImageUrlsChange}
                placeholder="Image URL"
              />
            </div>
            <div>
              <button type="submit">Add Product</button>
              <button
                type="button"
                onClick={() => setAddProductVisible(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading & Error Messages */}
      {loading && !error ? (
        <p>Loading products...</p>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : (
        <div className="product-container">
          {products.map((product) => (
            <div key={product.pid} className="product-card">
              {product.imageUrls && product.imageUrls.length > 0 && (
                <img src={product.imageUrls[0]} alt={product.name} className="product-image" />
              )}
              <div className="product-info">
                <p className="product-name">{product.name}</p>
                <p className="product-price">${product.price}</p>
                <p className="product-category">{product.category}</p>
                <div className="buttonsDiv">
                  <button className="edit" onClick={() => handleEdit(product)}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(product)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Snackbar for error messages */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="error" onClose={() => setOpenSnackbar(false)}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MerchantProducts;
