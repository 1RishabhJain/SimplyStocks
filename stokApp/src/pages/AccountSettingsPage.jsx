import React, { useState, useEffect } from "react";
import axios from "axios";

const ServiceRegistryPage = () => {
  const [services, setServices] = useState({});
  const [serviceName, setServiceName] = useState("");
  const [serviceUrl, setServiceUrl] = useState("");

  // Fetch services from the backend on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5002/services");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const addService = async () => {
    if (serviceName && serviceUrl) {
      try {
        await axios.post("http://127.0.0.1:5002/services", {
          name: serviceName,
          url: serviceUrl,
        });
        setServiceName("");
        setServiceUrl("");
        fetchServices(); // Refresh the list
      } catch (error) {
        console.error("Error adding service:", error);
      }
    } else {
      alert("Please enter both service name and URL.");
    }
  };

  const removeService = async (name) => {
    try {
      await axios.delete(`http://127.0.0.1:5002/services/${name}`);
      fetchServices(); // Refresh the list
    } catch (error) {
      console.error("Error removing service:", error);
    }
  };

  const openService = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl text-violet-500 text-center mb-5">Service Registry</h1>
      <div className="mb-5">
        <input
          type="text"
          placeholder="Service Name"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Service URL"
          value={serviceUrl}
          onChange={(e) => setServiceUrl(e.target.value)}
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <button
          onClick={addService}
          className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Add Service
        </button>
      </div>
      <ul className="border border-gray-300 rounded p-3">
        {Object.entries(services).map(([name, url]) => (
          <li
            key={name}
            className="flex justify-between items-center border-b border-gray-200 py-2"
          >
            <span>{name}</span>
            <div>
              <button
                onClick={() => openService(url)}
                className="mr-2 p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Open
              </button>
              <button
                onClick={() => removeService(name)}
                className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceRegistryPage;