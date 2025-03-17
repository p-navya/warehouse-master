const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const db = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "root",
    database: "arti",
});

// Fetch all products
app.get("/products", (req, res) => {
    const query = "SELECT * FROM products1";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Database Fetch Error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.json(results);
    });
});

// Insert new product
app.post("/products", (req, res) => {
    const {
        productId, productName, noOfUnits, placeOfOrigin, expiryDate,
        manufacturedDate, estimatedDelivery, startingDelivery, rackBin
    } = req.body;

    // Ensure rackBin has a default value if not provided
    const finalRackBin = rackBin || "Default Bin";

    const query = `
        INSERT INTO products1
        (id, name, manufacturing_date, expiry_date, rack_bin, quantity, 
        current_status, suggested_mart, starting_delivery, estimated_delivery, place_of_origin) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        productId, productName, manufacturedDate, expiryDate, finalRackBin,
        noOfUnits, "Available", "Default Mart", startingDelivery, estimatedDelivery, placeOfOrigin
    ], (err, results) => {
        if (err) {
            console.error("Database Insert Error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.status(201).json({ message: "Product added", id: results.insertId });
    });
});

// Update product details
app.put("/products/:id", (req, res) => {
    const { 
        productName, noOfUnits, placeOfOrigin, expiryDate, 
        manufacturedDate, estimatedDelivery, startingDelivery, rackBin 
    } = req.body;

    const query = `
        UPDATE products1 SET 
            name = ?, manufacturing_date = ?, expiry_date = ?, rack_bin = ?, 
            quantity = ?, place_of_origin = ?, starting_delivery = ?, estimated_delivery = ? 
        WHERE id = ?
    `;

    db.query(query, [
        productName, manufacturedDate, expiryDate, rackBin, 
        noOfUnits, placeOfOrigin, startingDelivery, estimatedDelivery, req.params.id
    ], (err, results) => {
        if (err) {
            console.error("Database Update Error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        if (results.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product updated successfully" });
    });
});

// Delete a product
app.delete("/products/:id", (req, res) => {
    const query = "DELETE FROM products1 WHERE id = ?";
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error("Database Delete Error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        if (results.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product deleted successfully" });
    });
});

// Fetch recommendations based on products that have not expired yet
app.get("/recommendations", (req, res) => {
    const query = `
        SELECT id, name AS product, manufacturing_date, expiry_date, 
               quantity, rack_bin, place_of_origin, 
               TIMESTAMPDIFF(DAY, NOW(), expiry_date) AS remaining_days,
               suggested_mart AS recommended_mart
        FROM products1 
        WHERE expiry_date > NOW() 
        ORDER BY expiry_date ASC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Database Recommendation Error:", err);
            return res.status(500).json({ error: "Database query failed", details: err });
        }
        res.json(results);
    });
});

// Update task status when a resource completes the task
app.put("/products/:id/status", (req, res) => {
    const { current_status } = req.body;

    const query = `
        UPDATE products1 SET current_status = ? WHERE id = ?
    `;

    db.query(query, [current_status, req.params.id], (err, results) => {
        if (err) {
            console.error("Database Status Update Error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        if (results.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product status updated successfully" });
    });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
