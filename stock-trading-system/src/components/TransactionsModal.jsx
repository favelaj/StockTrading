import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config"; // ✅ Add this

const TransactionsModal = ({
  isTransactionsModalOpen,
  setIsTransactionsModalOpen,
}) => {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!isTransactionsModalOpen || !user?.userID) return;
    axios
      .get(`${API_BASE_URL}/api/transactions?userID=${user.userID}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTransactions(res.data);
        } else {
          console.error("Unexpected transactions response:", res.data);
          setTransactions([]);
        }
      })
      .catch((err) => console.error(err));
  }, [isTransactionsModalOpen, user?.userID]); // Close useEffect properly

  const handleCancel = async (tx) => {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/transactions/cancel`, {
        transactionID: tx.TransactionID,
      });
      setTransactions((prev) =>
        prev.map((t) =>
          t.TransactionID === tx.TransactionID
            ? { ...t, TransactionStatus: res.data.newStatus || "CANCELLED" }
            : t
        )
      );
      setMessage(`Transaction ${tx.TransactionID} cancelled.`);
    } catch (err) {
      const errMsg =
        err.response?.data?.error || "Server error cancelling transaction.";
      setMessage(`Error: ${errMsg}`);
    } finally {
      setBusy(false);
    }
  };

  if (!isTransactionsModalOpen) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-2xl mx-auto p-4 bg-white dark:bg-zinc-800 shadow-md rounded space-y-4 overflow-y-auto max-h-[80vh]">
        <h1 className="text-2xl font-bold text-center">Transactions</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-2 text-left text-sm font-medium">ID</th>
                <th className="px-3 py-2 text-left text-sm font-medium">StockID</th>
                <th className="px-3 py-2 text-left text-sm font-medium">Type</th>
                <th className="px-3 py-2 text-right text-sm font-medium">Qty</th>
                <th className="px-3 py-2 text-right text-sm font-medium">Price</th>
                <th className="px-3 py-2 text-left text-sm font-medium">Time</th>
                <th className="px-3 py-2 text-left text-sm font-medium">Status</th>
                <th className="px-3 py-2 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((tx) => (
                <tr key={tx.TransactionID}>
                  <td className="px-3 py-2 text-sm">{tx.TransactionID}</td>
                  <td className="px-3 py-2 text-sm">{tx.StockID}</td>
                  <td className="px-3 py-2 text-sm">{tx.TransactionType}</td>
                  <td className="px-3 py-2 text-sm text-right">{tx.Quantity}</td>
                  <td className="px-3 py-2 text-sm text-right">
                       {tx.Price != null ? `$${parseFloat(tx.Price).toFixed(2)}` : "-"}
                  </td>

                  <td className="px-3 py-2 text-sm">
                    {new Date(tx.Timestamp).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-sm">{tx.TransactionStatus}</td>
                  <td className="px-3 py-2 text-sm">
                    {tx.TransactionStatus.toUpperCase() === "PENDING" && (
                      <button
                        onClick={() => handleCancel(tx)}
                        disabled={busy}
                        className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-3 py-4 text-center text-sm text-gray-500"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {message && (
          <p
            className={`text-center ${
              message.startsWith("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex justify-center">
          <button
            className="px-4 py-2 bg-gray-400 dark:text-black rounded hover:bg-gray-500"
            onClick={() => setIsTransactionsModalOpen(false)}
            disabled={busy}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsModal;
