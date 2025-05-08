import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config.js";

const EditStockModal = ({ selectedStock, setIsEditStockOpen }) => {
  // initialise with the selected stock’s values
  const [formData, setFormData] = useState({
    ticker: "",
    company: "",
    price: "",
    volume: "",
    dayHigh: "",
    dayLow: "",
    dayStart: "",
    dayEnd: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (selectedStock) {
      setFormData({
        ticker: selectedStock.Ticker,
        company: selectedStock.CompanyName,
        price: selectedStock.CurrentPrice,
        volume: selectedStock.Volume,
        dayHigh: selectedStock.dayHigh,
        dayLow: selectedStock.dayLow,
        dayStart: selectedStock.dayStart,
        dayEnd: selectedStock.dayEnd,
      });
    }
  }, [selectedStock]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const id = selectedStock?.id;
    console.log("Submitting update with id:", id);
    console.log("Submitting update with data:", formData);
    

    if (!id) return setMessage("Missing stock ID.");

    try {
await axios.put(`${API_BASE_URL}/api/stock/${id}`, formData);
      setMessage("Stock updated!");
      setTimeout(() => setIsEditStockOpen(false), 800); // close after flash
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message); // good debug
      setMessage(
        err.response?.data?.error || "Update failed – please try again."
      );
    }
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Edit Stock</h2>
        <form onSubmit={handleSubmit} className="space-y-1">
          <div className="flex flex-col">
            <label htmlFor="ticker" className="mb-1 text-sm font-medium">
              Ticker
            </label>
            <input
              id="ticker"
              type="text"
              name="ticker"
              value={formData.ticker}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded text-black"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="company" className="mb-1 text-sm font-medium">
              Company
            </label>
            <input
              id="company"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded text-black"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="price" className="mb-1 text-sm font-medium">
              Current Price
            </label>
            <input
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded text-black"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="volume" className="mb-1 text-sm font-medium">
              Volume
            </label>
            <input
              id="volume"
              type="number"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded text-black"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="dayHigh" className="mb-1 text-sm font-medium">
              Day High
            </label>
            <input
              id="dayHigh"
              type="number"
              name="dayHigh"
              value={formData.dayHigh ?? ""}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded text-black"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="dayLow" className="mb-1 text-sm font-medium">
              Day Low
            </label>
            <input
              id="dayLow"
              type="number"
              name="dayLow"
              value={formData.dayLow ?? ""}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded text-black"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="dayStart" className="mb-1 text-sm font-medium">
              Day Start
            </label>
            <input
              id="dayStart"
              type="number"
              name="dayStart"
              value={formData.dayStart ?? ""}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded text-black"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="dayEnd" className="mb-1 text-sm font-medium">
              Day End
            </label>
            <input
              id="dayEnd"
              type="number"
              name="dayEnd"
              value={formData.dayEnd ?? ""}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded text-black"
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              className="w-full bg-zinc-500 text-white p-2 rounded hover:bg-zinc-600 mt-2"
              onClick={() => setIsEditStockOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-2"
            >
              Save
            </button>
          </div>
        </form>
        {message && (
          <p className="mt-4 text-center text-lg font-semibold text-green-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default EditStockModal;
