import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Plant() {
    const navigate = useNavigate();
    const [productDetails, setProductDetails] = useState({
        productId: "",
        productName: "",
        noOfUnits: "",
        placeOfOrigin: "",
        expiryDate: "",
        manufacturedDate: "",
        estimatedDelivery: "",
        startingDelivery: "",
        rackBin: "", // Added missing field
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductDetails({
            ...productDetails,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productDetails),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Product added:", data);
                setProductDetails({
                    productId: "",
                    productName: "",
                    noOfUnits: "",
                    placeOfOrigin: "",
                    expiryDate: "",
                    manufacturedDate: "",
                    estimatedDelivery: "",
                    startingDelivery: "",
                    rackBin: "",
                });
                navigate("/Admin"); // Redirect to Admin page after submission
            })
            .catch((error) => console.error("Error:", error));
    };

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Product Details</h2>

                <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
                    {[
                        { label: "Product ID", name: "productId", type: "text", placeholder: "Enter Product ID" },
                        { label: "Product Name", name: "productName", type: "text", placeholder: "Enter Product Name" },
                        { label: "No. of Units", name: "noOfUnits", type: "number", placeholder: "Enter No. of Units" },
                        { label: "Place of Origin", name: "placeOfOrigin", type: "text", placeholder: "Enter Place of Origin" },
                        { label: "Expiry Date", name: "expiryDate", type: "date" },
                        { label: "Manufactured Date", name: "manufacturedDate", type: "date" },
                        { label: "Starting Date of Delivery", name: "startingDelivery", type: "datetime-local" },
                        { label: "Estimated Date of Delivery", name: "estimatedDelivery", type: "datetime-local" },
                        { label: "Rack Bin", name: "rackBin", type: "text", placeholder: "Enter Rack Bin" }, // Added missing field
                    ].map(({ label, name, type, placeholder }) => (
                        <div key={name} className="flex flex-col">
                            <label htmlFor={name} className="mb-1 font-semibold">{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={productDetails[name]}
                                onChange={handleChange}
                                id={name}
                                placeholder={placeholder}
                                className="border px-4 py-2"
                            />
                        </div>
                    ))}

                    <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-full mt-4 mx-auto">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Plant;
