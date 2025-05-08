import React, { useState } from "react";

const DeleteStock = ({
  setIsDeleteStockOpen,
  selectedStock,
  setSelectedStock,
}) => {
  const [message, setMessage] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(
        `http://3.90.131.54/api/deleteStock/${selectedStock.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setIsDeleteStockOpen(false);
    } catch (err) {
      setMessage("Error: Unable to delete stock. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-center text-black dark:text-white">
          Delete {selectedStock.CompanyName} ({selectedStock.Ticker})
        </h1>

        <p className="text-center text-gray-700 dark:text-gray-300">
          Are you sure you want to delete this stock?
        </p>

        <form onSubmit={handleDelete} className="space-y-4">
          <div className="flex space-x-3">
            <button
              type="button"
              className="w-full bg-zinc-500 text-white py-2 rounded hover:bg-zinc-600"
              onClick={() => setIsDeleteStockOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Delete Stock
            </button>
          </div>
        </form>

        {message && (
          <p
            className={`text-center font-medium ${
              message.startsWith("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default DeleteStock;
