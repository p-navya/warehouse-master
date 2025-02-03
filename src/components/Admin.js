import React, { useEffect, useState } from 'react';

function Admin() {
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    fetch('http://localhost:5000/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Product List</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              {["ID", "Name", "No. of Units", "Place of Origin", "Manufactured Date", "Expiry Date", "Starting Delivery", "Estimated Delivery", "Rack Bin", "Current Status", "Suggested Mart"].map((header) => (
                <th key={header} className="py-2 px-4 border">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="text-center border">
                  <td className="py-2 px-4 border">{product.id}</td>
                  <td className="py-2 px-4 border">{product.name}</td>
                  <td className="py-2 px-4 border">{product.quantity}</td>
                  <td className="py-2 px-4 border">{product.place_of_origin || 'N/A'}</td>
                  <td className="py-2 px-4 border">{product.manufacturing_date}</td>
                  <td className="py-2 px-4 border">{product.expiry_date}</td>
                  <td className="py-2 px-4 border">{product.starting_delivery || 'N/A'}</td>
                  <td className="py-2 px-4 border">{product.estimated_delivery || 'N/A'}</td>
                  <td className="py-2 px-4 border">{product.rack_bin}</td>
                  <td className="py-2 px-4 border">{product.current_status}</td>
                  <td className="py-2 px-4 border">{product.suggested_mart}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="py-4 text-center">No products available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
