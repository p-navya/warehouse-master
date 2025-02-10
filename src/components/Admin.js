import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaUser, FaPowerOff } from 'react-icons/fa';
import { Link } from "react-router-dom";

function Admin() {
  const [products, setProducts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [alertMessages, setAlertMessages] = useState([]);
  const [rackBins, setRackBins] = useState({});
  const navigate = useNavigate();

  const fetchProducts = () => {
    fetch('http://localhost:5000/products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        checkExpiry(data);
      })
      .catch((error) => console.error('Error fetching products:', error));
  };

  const checkExpiry = (products) => {
    const today = new Date();
    const alerts = products.filter((product) => {
      const expiryDate = new Date(product.expiry_date);
      const diffDays = (expiryDate - today) / (1000 * 60 * 60 * 24);
      return diffDays <= 15 && diffDays >= 0;
    });

    if (alerts.length > 0) {
      setAlertMessages(alerts.map((product) => `${product.name} expires on ${product.expiry_date}`));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRackBinChange = (productId, value) => {
    setRackBins((prev) => ({ ...prev, [productId]: value }));
  };

  const allocateRackBin = async (productId) => {
    const rackBin = rackBins[productId];
    if (!rackBin) return alert("Please enter a Rack Bin");

    const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rack_bin: rackBin }),
    });

    if (response.ok) {
      alert("Rack Bin allocated successfully");
      fetchProducts();
    } else {
      alert("Error allocating Rack Bin");
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-48 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-center font-bold text-lg mb-4">Admin Panel</h2>
        <button
          onClick={() => navigate("/Dashboard")}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded"
        >
          Dashboard
        </button>

        {/* Admin Profile (Bottom Left) */}
        <div className="mt-auto flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-700 rounded" onClick={handleLogout}>
          <FaUser size={20} />
          <span className="text-sm">Admin</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Admin</h2>

          {/* Notification Bell & Logout Button */}
          <div className="flex gap-4">
            {/* Notification Bell */}
            <button onClick={() => setShowAlerts(!showAlerts)} className="relative">
              <FaBell size={24} />
              {alertMessages.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-2">
                  {alertMessages.length}
                </span>
              )}
            </button>

            {/* Logout (Power Button) */}
            <Link to="/">
              <button onClick={handleLogout} className="text-black">
                <FaPowerOff size={20} />
              </button>
            </Link>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Product List</h3>
          <div className="overflow-auto max-h-[400px]">
            <table className="min-w-full bg-white border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {["ID", "Name", "No. of Units", "Place of Origin", "Manufactured Date", "Expiry Date", "Starting Delivery", "Estimated Delivery", "Rack Bin", "Actions", "Current Status", "Suggested Mart"].map((header) => (
                    <th key={header} className="py-2 px-2 border text-left">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="border">
                      <td className="py-1 px-2 border">{product.id}</td>
                      <td className="py-1 px-2 border">{product.name}</td>
                      <td className="py-1 px-2 border">{product.quantity}</td>
                      <td className="py-1 px-2 border">{product.place_of_origin || 'N/A'}</td>
                      <td className="py-1 px-2 border">{product.manufacturing_date}</td>
                      <td className="py-1 px-2 border">{product.expiry_date}</td>
                      <td className="py-1 px-2 border">{product.starting_delivery || 'N/A'}</td>
                      <td className="py-1 px-2 border">{product.estimated_delivery || 'N/A'}</td>
                      <td className="py-1 px-2 border">
                        <input
                          type="text"
                          placeholder="Enter Rack Bin"
                          value={rackBins[product.id] || ""}
                          onChange={(e) => handleRackBinChange(product.id, e.target.value)}
                          className="border p-1"
                        />
                      </td>
                      <td className="py-1 px-2 border">
                        <button
                          onClick={() => allocateRackBin(product.id)}
                          className="bg-green-500 text-white px-4 py-1 rounded"
                        >
                          Allocate
                        </button>
                      </td>
                      <td className="py-1 px-2 border">{product.current_status}</td>
                      <td className="py-1 px-2 border">{product.suggested_mart}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="py-3 text-center">No products available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expiry Alerts Modal */}
        {showAlerts && alertMessages.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-md w-80">
              <h3 className="text-lg font-semibold mb-2">Expiring Products</h3>
              <ul>
                {alertMessages.map((message, index) => (
                  <li key={index} className="text-red-500 mb-1">{message}</li>
                ))}
              </ul>
              <button
                onClick={() => setShowAlerts(false)}
                className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
