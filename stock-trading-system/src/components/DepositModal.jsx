import React, { useState } from "react";
import axios from "axios";

const DepositModal = ({ isDepositModalOpen, setIsDepositModalOpen }) => {
  const [depositAmount, setDepositAmount] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);

    if (!amount || amount <= 0) {
      return setMessage("Error: enter a positive number.");
    }
    if (!user?.userID) {
      return setMessage("Error: user not found (log in again).");
    }

    setBusy(true);
    setMessage("");

    try {
      const res = await axios.post("/api/deposit", {
        userID: user.userID,
        amount,
      });

      if (user.CashBalance !== undefined) {
        user.CashBalance = res.data.balance;
        localStorage.setItem("user", JSON.stringify(user));
      }

      setMessage(`Success! New balance: $${res.data.balance}`);
      setDepositAmount("");
    } catch (err) {
      const msg =
        err.response?.data?.error || "Server error processing deposit.";
      setMessage(`Error: ${msg}`);
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = () => {
    setDepositAmount("");
    setMessage("");
    setIsDepositModalOpen(false);
  };

  if (!isDepositModalOpen) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-md mx-auto p-4 bg-white dark:bg-zinc-800 shadow-md rounded space-y-3">
        <h1 className="text-2xl font-bold text-center">Deposit Funds</h1>

        <input
          type="number"
          min="0"
          step="0.01"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="Enter deposit amount"
          className="w-full px-4 py-2 border border-gray-300 rounded text-black"
        />

        <div className="flex space-x-2">
          <button
            className="w-full bg-slate-400 py-2 px-4 rounded hover:bg-slate-500 transition"
            onClick={handleCancel}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            className="w-full bg-[#6362E7] text-white dark:text-black py-2 px-4 rounded hover:bg-[#4747e9] transition"
            onClick={handleDeposit}
            disabled={busy}
          >
            Deposit
          </button>
        </div>

        {message && (
          <p
            className={`mt-2 text-center ${
              message.startsWith("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default DepositModal;
