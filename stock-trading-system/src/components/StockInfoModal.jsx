import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StockInfoModal = ({
  isStockInfoModalOpen,
  setIsStockInfoModalOpen,
  selectedStock,
  setSelectedStock, 
}) => {
  const [sharesInput, setSharesInput] = useState(1);
  const [message, setMessage] = useState("");
  const [cashBalance, setCashBalance] = useState(0);
  const [owned, setOwned] = useState(0);
  const [busy, setBusy] = useState(false);
  const [marketOpen, setMarketOpen] = useState(true);
  const [liveStock, setLiveStock] = useState(selectedStock);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    setCashBalance(parseFloat(u?.CashBalance) || 0);
  }, [isStockInfoModalOpen]);

  useEffect(() => {
    if (!isStockInfoModalOpen || !selectedStock || !user.userID) return;

    (async () => {
      try {
        const { data } = await axios.get(
          `http://3.90.131.54/api/portfolio/${user.userID}`
        );
        const entry = data.find((p) => p.Ticker === selectedStock.Ticker);
        setOwned(entry ? entry.Quantity : 0);
      } catch {
        setOwned(0);
      }
    })();
  }, [isStockInfoModalOpen, selectedStock, user.userID]);
  //Fetch market open status when modal opens
  useEffect(() => {
    if (!isStockInfoModalOpen) return;

    (async () => {
      try {
        const res = await axios.get("http://3.90.131.54/api/market-schedule");
        const data = res.data;

        const now = new Date();
        const [openH, openM] = (data.MarketOpen || "09:00").split(":");
        const [closeH, closeM] = (data.MarketClose || "17:00").split(":");

        const open = new Date();
        open.setHours(openH, openM, 0, 0);

        const close = new Date();
        close.setHours(closeH, closeM, 0, 0);
      // Adjust so Sunday=7, Monday=1
        let dayOfWeek = now.getDay();
        dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

        const openDays = (data.OpenDays || "")
          .split(",")
          .map(Number)
          .filter((d) => !isNaN(d));

        const isDayOpen = openDays.includes(dayOfWeek);
        const isTimeOpen = now >= open && now <= close;
        const isMarketOpen = (data.MarketStatus === 1) && isDayOpen && isTimeOpen;

        setMarketOpen(isMarketOpen);
      } catch (error) {
        console.error("Failed to fetch market status", error);
        setMarketOpen(true); // fallback to allow trading if API fails
      }
    })();
  }, [isStockInfoModalOpen]);

  useEffect(() => {
    if (!isStockInfoModalOpen || !selectedStock) return;

    setLiveStock(selectedStock);

    const fetchStock = async () => {
      try {
        const { data } = await axios.get("http://3.90.131.54/api/data");
        const updatedStock = data.find((s) => s.Ticker === selectedStock.Ticker);
        if (updatedStock) {
          setLiveStock((prev) => ({
            ...prev,
            ...updatedStock,
          }));
        }
      } catch (error) {
        console.error("Failed to refresh stock data", error);
      }
    };

    const interval = setInterval(fetchStock, 30000);

    return () => clearInterval(interval);
  }, [isStockInfoModalOpen, selectedStock]);

  if (!isStockInfoModalOpen || !liveStock) return null;

  const {
    CompanyName,
    Ticker,
    CurrentPrice,
    Volume,
    dayHigh,
    dayLow,
    dayStart,
    history = [],
  } = liveStock;

  const persistBalance = (bal) => {
    const u = { ...user, CashBalance: bal };
    localStorage.setItem("user", JSON.stringify(u));
    setCashBalance(parseFloat(bal));
  };

  const updateOwned = (newQty) => setOwned(newQty);

  const handleBuy = async () => {
    const cost = sharesInput * parseFloat(CurrentPrice);
    if (cost > cashBalance) return setMessage("Not enough cash.");

    setBusy(true);
    try {
      await axios.post("http://3.90.131.54/api/buy", {
        userID: user.userID,
        stockID: liveStock.id,
        shares: sharesInput,
        price: CurrentPrice,
      });
      persistBalance((cashBalance - cost).toFixed(2));
      updateOwned(owned + sharesInput);
      setMessage(`Bought ${sharesInput} share(s).`);
    } catch (e) {
      setMessage("Error: could not buy stock.");
    } finally {
      setBusy(false);
    }
  };

  const handleSell = async () => {
    if (sharesInput > owned)
      return setMessage(`You only own ${owned} share(s).`);

    setBusy(true);
    const proceeds = sharesInput * parseFloat(CurrentPrice);
    try {
      await axios.post("http://3.90.131.54/api/sell", {
        userID: user.userID,
        stockID: liveStock.id,
        shares: sharesInput,
        price: CurrentPrice,
      });
      persistBalance((cashBalance + proceeds).toFixed(2));
      updateOwned(owned - sharesInput);
      setMessage(`Sold ${sharesInput} share(s).`);
    } catch {
      setMessage("Error: could not sell stock.");
    } finally {
      setBusy(false);
    }
  };

  const gainLoss = (
    parseFloat(CurrentPrice) - parseFloat(dayStart || CurrentPrice)
  ).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold dark:text-white">
              {CompanyName} ({Ticker})
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              ${parseFloat(CurrentPrice).toFixed(2)} • Volume{" "}
              {Volume.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Cash Balance</p>
            <p className="text-xl font-semibold">${cashBalance.toFixed(2)}</p>
            <p className="text-sm text-gray-400 mt-1">
              You own&nbsp;<span className="font-semibold">{owned}</span>
              &nbsp;share(s)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm dark:text-white text-black">
          <div>Day Start: ${dayStart ?? "N/A"}</div>
          <div>Day High: ${dayHigh}</div>
          <div>Day Low: ${dayLow}</div>
          <div>
            Gain/Loss:{" "}
            <span className={gainLoss >= 0 ? "text-green-500" : "text-red-500"}>
              {gainLoss >= 0 ? "+" : ""}
              {gainLoss}
            </span>
          </div>
        </div>

        {history.length > 0 && (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={history.map((h) => ({
                  ...h,
                  price: parseFloat(h.price),
                }))}
              >
                <XAxis dataKey="time" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {!marketOpen && (
          <p className="text-center text-red-500 font-semibold">
            Market is closed. You cannot buy or sell right now.
          </p>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="1"
            value={sharesInput}
            onChange={(e) => setSharesInput(Number(e.target.value))}
            className="w-24 p-1 rounded border text-black"
          />
          <button
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-40"
            onClick={handleBuy}
            disabled={busy || !marketOpen}
          >
            Buy
          </button>
          <button
            className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-40"
            onClick={handleSell}
            disabled={busy || owned === 0 || !marketOpen}
          >
            Sell
          </button>
        </div>

        {message && (
          <p className="text-center text-sm mt-2 text-blue-500">{message}</p>
        )}

        <button
          onClick={() => setIsStockInfoModalOpen(false)}
          className="w-full mt-4 bg-zinc-300 dark:bg-zinc-700 py-2 rounded hover:bg-zinc-400 dark:hover:bg-zinc-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StockInfoModal;
