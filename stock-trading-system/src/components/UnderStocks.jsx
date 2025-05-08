import React, { useState, useEffect } from "react";
import { BiChevronRight } from "react-icons/bi";

const UnderStocks = ({
  stocks,
  loading,
  setOpenPerformingPage,
  isStockInfoModalOpen,
  setIsStockInfoModalOpen,
  setSelectedStock,
}) => {
  const [bottomStocks, setBottomStocks] = useState([]);
  const [bottomFiveUnsorted, setBottomFiveUnsorted] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "percentageChange",
    direction: "asc",
  });

  // Extract bottom 5 on stock data change
  useEffect(() => {
    if (stocks.length > 0) {
      const stocksWithPerformance = stocks.map((stock) => {
        const price = parseFloat(stock.CurrentPrice || stock.price);
        const dayStart = parseFloat(stock.InitialPrice || stock.dayStart);
        const percentageChange = ((price - dayStart) / dayStart) * 100;

        return {
          ...stock,
          percentageChange,
          ticker: stock.Ticker,
          company: stock.CompanyName,
          price,
        };
      });

      const bottomFive = [...stocksWithPerformance]
        .sort((a, b) => a.percentageChange - b.percentageChange)
        .slice(0, 5);

      setBottomFiveUnsorted(bottomFive);
    }
  }, [stocks]);

  // Apply sorting to bottom 5 only
  useEffect(() => {
    if (bottomFiveUnsorted.length > 0) {
      const sorted = [...bottomFiveUnsorted].sort((a, b) => {
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
      setBottomStocks(sorted);
    }
  }, [sortConfig, bottomFiveUnsorted]);

  // Handle sorting when a header is clicked
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

  return (
    <div className="w-full mx-auto p-1 bg-white dark:bg-zinc-800 dark:text-white">
      <div className="flex justify-between items-center mt-2 mb-6">
        <h2 className="ml-5 text-2xl font-bold text-zinc-800 dark:text-white">
          Bottom 5 Performing Stocks
        </h2>
        <h3
          onClick={() => setOpenPerformingPage("Top")}
          className="flex items-center cursor-pointer p-1 hover:bg-blue-50 dark:hover:bg-zinc-600 dark:text-zinc-100 text-center rounded-md select-none"
        >
          <BiChevronRight /> Top 5
        </h3>
      </div>
      {bottomStocks.length === 0 ? (
        <p className="text-center text-zinc-600 dark:text-white">
          Loading top stocks...
        </p>
      ) : bottomStocks.length === 0 ? (
        <p className="text-center text-zinc-600 dark:text-white">
          No stocks available.
        </p>
      ) : (
        <table className="table-auto w-full border-collapse border border-zinc-300 dark:border-zinc-700">
          <thead className="select-none cursor-pointer">
            <tr className="bg-zinc-200 dark:bg-zinc-700">
              <th
                onClick={() => handleSort("ticker")}
                className="hover:bg-zinc-400 dark:hover:bg-zinc-800"
              >
                {sortConfig.key === "ticker" &&
                  (sortConfig.direction === "asc" ? "↑ " : "↓ ")}
                Ticker
              </th>
              <th
                onClick={() => handleSort("company")}
                className="hover:bg-zinc-400 dark:hover:bg-zinc-800"
              >
                {sortConfig.key === "company" &&
                  (sortConfig.direction === "asc" ? "↑ " : "↓ ")}
                Company
              </th>
              <th
                onClick={() => handleSort("percentageChange")}
                className="hover:bg-zinc-400 dark:hover:bg-zinc-800"
              >
                {sortConfig.key === "percentageChange" &&
                  (sortConfig.direction === "asc" ? "↑ " : "↓ ")}
                Gain/Loss (%)
              </th>
              <th
                onClick={() => handleSort("price")}
                className="hover:bg-zinc-400 dark:hover:bg-zinc-800"
              >
                {sortConfig.key === "price" &&
                  (sortConfig.direction === "asc" ? "↑ " : "↓ ")}
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {bottomStocks.map((stock) => (
              <tr
                key={stock.id}
                className="hover:bg-blue-50 dark:bg-zinc-800 dark:hover:bg-zinc-900 dark:text-zinc-100 text-center cursor-pointer"
                onClick={() => {
                  setIsStockInfoModalOpen(true);
                  setSelectedStock(stock);
                }}
              >
                <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-600">
                  {stock.ticker}
                </td>
                <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-600">
                  {stock.company}
                </td>
                <td
                  className={`px-4 py-2 font-bold border border-zinc-300 dark:border-zinc-600 ${
                    stock.percentageChange > -0.00001
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {stock.percentageChange.toFixed(2) + "%"}
                </td>
                <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-600">
                  ${stock.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UnderStocks;
