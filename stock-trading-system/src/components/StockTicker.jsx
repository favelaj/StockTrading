import React, { useState, useEffect } from "react";
import PaginationFooter from "./PaginationFooter";

const StockTicker = ({
  stocks,
  loading,
  isStockInfoModalOpen,
  setIsStockInfoModalOpen,
  setSelectedStock,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const st = stocks;
  const [currentPrices, setCurrentPrices] = useState({});
  const [totalGainLoss, setTotalGainLoss] = useState({
    value: 0,
    percentage: 0,
  });
  const [totalCurrentValue, setTotalCurrentValue] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: "gainLossPercentage",
    direction: "asc",
  });
  const [stocksPerPage, setStocksPerPage] = useState(5);

  // Sorting
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  // Calculate total gain/loss and current value
  useEffect(() => {
    if (stocks.length > 0) {
      let totalDayStartValue = 0;
      let totalValue = 0;

      stocks.forEach((stock) => {
        const dayStart =
          Number(stock.dayStart) || Number(stock.CurrentPrice) || 0;
        const volume = Number(stock.volume || stock.Volume) || 0;
        const currentPrice = Number(stock.CurrentPrice) || 0;

        totalDayStartValue += dayStart * volume;
        totalValue += currentPrice * volume;
      });

      const totalGainLossValue = totalValue - totalDayStartValue;
      const totalGainLossPercentage =
        (totalGainLossValue / totalDayStartValue) * 100;

      setTotalGainLoss({
        value: totalGainLossValue,
        percentage: totalGainLossPercentage,
      });
      setTotalCurrentValue(totalValue);
    }
  }, [stocks, currentPrices]);

  // Filtering and sorting stocks
  const filtered = stocks.filter(
    (stock) =>
      (stock.Ticker || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (stock.CompanyName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(stock.CurrentPrice || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(stock.Volume || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const sortedStocks = filtered
    .map((stock) => {
      const price = parseFloat(stock.CurrentPrice || 0);
      const volume = parseFloat(stock.Volume || 0);
      const dayHigh = parseFloat(stock.dayHigh || price);
      const dayLow = parseFloat(stock.dayLow || price);
      const marketCap = price * volume;

      const gainLossPercentage =
        ((price - (stock.purchasePrice || price)) /
          (stock.purchasePrice || 1)) *
        100;

      return {
        ...stock,
        CurrentPrice: Number(price.toFixed(2)),
        Volume: volume,
        marketCap: Number(marketCap.toFixed(2)),
        dayHigh: Number(dayHigh.toFixed(2)),
        dayLow: Number(dayLow.toFixed(2)),
        gainLossPercentage: Number(gainLossPercentage.toFixed(2)),
      };
    })
    .sort((a, b) => {
      const { key, direction } = sortConfig;
      const valA = a[key];
      const valB = b[key];

      if (typeof valA === "string") {
        return direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return direction === "asc" ? valA - valB : valB - valA;
      }
    });

  return (
    <div className="w-full mx-auto p-1 bg-white dark:bg-zinc-800 dark:text-white">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-7">
          <h2 className="ml-5 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
            Real-Time Stock Prices
          </h2>
          {stocks.length > 0 && (
            <input
              className="w-96 px-2 py-1 rounded border text-black"
              type="text"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
        </div>
        <div>
          <p
            className={`text-2xl font-bold ${
              totalGainLoss.value > 0.01
                ? "text-green-500"
                : totalGainLoss.value < -0.01
                ? "text-red-500"
                : "text-zinc-800 dark:text-white"
            }`}
          >
            {totalGainLoss.value > 0 ? "+" : ""}$
            {totalGainLoss.value.toFixed(2)} (
            {totalGainLoss.percentage.toFixed(2)}%)
          </p>
          <p className="text-lg text-zinc-800 dark:text-zinc-100 text-right">
            ${totalCurrentValue.toFixed(2)}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-zinc-600 dark:text-white">
          Loading stock data...
        </p>
      ) : (
        <>
          <table className="table-auto w-full border-collapse border border-zinc-300 dark:border-zinc-700 mb-5">
            <thead className="select-none cursor-pointer">
              <tr className="bg-zinc-200 dark:bg-zinc-700">
                <th
                  onClick={() => handleSort("Ticker")}
                  className="hover:bg-zinc-400 dark:hover:bg-zinc-800"
                >
                  {sortConfig.key === "Ticker" &&
                    (sortConfig.direction === "asc" ? "↑ " : "↓ ")}
                  Ticker
                </th>
                <th
                  onClick={() => handleSort("CompanyName")}
                  className="hover:bg-zinc-400 dark:hover:bg-zinc-800"
                >
                  {sortConfig.key === "CompanyName" &&
                    (sortConfig.direction === "asc" ? "↑ " : "↓ ")}
                  Company
                </th>
                <th
                  onClick={() => handleSort("CurrentPrice")}
                  className="hover:bg-zinc-400 dark:hover:bg-zinc-800"
                >
                  {sortConfig.key === "CurrentPrice" &&
                    (sortConfig.direction === "asc" ? "↑ " : "↓ ")}
                  Price
                </th>
                <th
                  onClick={() => handleSort("Volume")}
                  className="hover:bg-zinc-400 dark:hover:bg-zinc-800"
                >
                  {sortConfig.key === "Volume" &&
                    (sortConfig.direction === "asc" ? "↑ " : "↓ ")}
                  Volume
                </th>
                <th
                  onClick={() => handleSort("marketCap")}
                  className="hover:bg-zinc-400 dark:hover:bg-zinc-800"
                >
                  {sortConfig.key === "marketCap" &&
                    (sortConfig.direction === "asc" ? "↑ " : "↓ ")}
                  Market Cap
                </th>
                <th
                  onClick={() => handleSort("dayHigh")}
                  className="hover:bg-zinc-400 dark:hover:bg-zinc-800"
                >
                  {sortConfig.key === "dayHigh" &&
                    (sortConfig.direction === "asc" ? "↑ " : "↓ ")}
                  Day High
                </th>
                <th
                  onClick={() => handleSort("dayLow")}
                  className="hover:bg-zinc-400 dark:hover:bg-zinc-800"
                >
                  {sortConfig.key === "dayLow" &&
                    (sortConfig.direction === "asc" ? "↑ " : "↓ ")}
                  Day Low
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStocks
                .slice(
                  (currentPage - 1) * stocksPerPage,
                  currentPage * stocksPerPage
                )
                .map((stock, index) => (
                  <tr
                    key={index}
                    className="hover:bg-blue-50 dark:bg-zinc-800 dark:hover:bg-zinc-900 dark:text-zinc-100 text-center cursor-pointer"
                    onClick={() => {
                      setIsStockInfoModalOpen(true);
                      setSelectedStock(stock);
                    }}
                  >
                    <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-600">
                      {stock.Ticker}
                    </td>
                    <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-600">
                      {stock.CompanyName}
                    </td>
                    <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-600">
                      ${stock.CurrentPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-600">
                      {stock.Volume}
                    </td>
                    <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-600">
                      ${stock.marketCap.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-600">
                      ${stock.dayHigh.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-600">
                      ${stock.dayLow.toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <PaginationFooter
            rowsPerPage={stocksPerPage}
            setRowsPerPage={setStocksPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            items={stocks}
          />
        </>
      )}
    </div>
  );
};

export default StockTicker;
