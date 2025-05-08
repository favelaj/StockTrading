import { useState, useEffect } from "react";
import PaginationFooter from "./PaginationFooter";

const MyStocks = ({
  stocks,
  isStockInfoModalOpen,
  setIsStockInfoModalOpen,
  setSelectedStock,
}) => {
  const [user] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [myStocks, setMyStocks] = useState([]);
  const [currentPrices, setCurrentPrices] = useState({});
  const [totalGainLoss, setTotalGainLoss] = useState({
    value: 0,
    percentage: 0,
  });
  const [totalCurrentValue, setTotalCurrentValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "gainLossPercentage",
    direction: "asc",
  });
  const [stocksPerPage, setStocksPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch portfolio from backend
  useEffect(() => {
    if (!user) return;

    const fetchPortfolio = async () => {
      try {
        const res = await fetch(`http://3.90.131.54/api/portfolio/${user.userID}`);
        const data = await res.json();

        const stockMap = {};

        data.forEach((entry) => {
          if (!stockMap[entry.Ticker]) {
            stockMap[entry.Ticker] = {
              Ticker: entry.Ticker,
              CompanyName: entry.CompanyName,
              shares: 0,
              purchasePrice: 0,
              totalSpent: 0,
            };
          }

          stockMap[entry.Ticker].shares += entry.Quantity;
          stockMap[entry.Ticker].totalSpent += entry.Quantity * parseFloat(entry.AveragePrice);
        });

        const mergedStocks = Object.values(stockMap)
          .filter((stock) => stock.shares > 0)
          .map((stock) => ({
            ...stock,
            purchasePrice: stock.shares > 0 ? stock.totalSpent / stock.shares : 0,
          }));

        setMyStocks(mergedStocks);
      } catch (err) {
        console.error("Failed to fetch portfolio:", err);
      }
    };


    // Initial fetch
    fetchPortfolio();

    // Set interval to fetch every 30 seconds
    const interval = setInterval(fetchPortfolio, 30000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [user]);

  // Update current prices from prop
  useEffect(() => {
    const pricesMap = stocks.reduce((acc, stock) => {
      acc[stock.Ticker] = parseFloat(stock.CurrentPrice) || 0;
      return acc;
    }, {});
    setCurrentPrices(pricesMap);
  }, [stocks]);

  // Calculate total gain/loss and current value
  useEffect(() => {
    if (myStocks.length > 0) {
      let totalPurchaseValue = 0;
      let totalValue = 0;
      myStocks.forEach((stock) => {
        const currentPrice =
          parseFloat(currentPrices[stock.Ticker]) || stock.purchasePrice;
        totalPurchaseValue += stock.purchasePrice * stock.shares;
        totalValue += currentPrice * stock.shares;
      });

      const totalGainLossValue = totalValue - totalPurchaseValue;
      const totalGainLossPercentage =
        (totalGainLossValue / totalPurchaseValue) * 100;

      setTotalGainLoss({
        value: totalGainLossValue,
        percentage: totalGainLossPercentage,
      });
      setTotalCurrentValue(totalValue);
    }
  }, [myStocks, currentPrices]);

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

  // Filtering and sorting stocks
  const filtered = myStocks.filter(
    (stock) =>
      stock.Ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.CompanyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStocks = filtered
    .map((stock) => {
      const currentPrice =
        parseFloat(currentPrices[stock.Ticker]) || stock.purchasePrice;
      const gainLossPercentage =
        ((currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
      return {
        ...stock,
        currentPrice: Number(currentPrice.toFixed(2)),
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
    <div className="w-full mx-auto bg-white dark:bg-zinc-800 rounded-lg p-1 dark:text-white">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-7">
          <h2 className="ml-5 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
            My Stocks
          </h2>
          {myStocks.length > 0 && (
            <input
              className="w-96 px-2 py-1 rounded border text-black"
              type="text"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
        </div>


        <div className="text-right space-y-1">
          <p className="text-xs text-gray-500 dark:text-gray-300">
            Potential Gain/Loss:
          </p>
          <p
            className={`text-2xl font-bold ${totalGainLoss.value > 0.01
                ? "text-green-500"
                : totalGainLoss.value < -0.01
                  ? "text-red-500"
                  : "text-zinc-800 dark:text-white"
              }`}
          >
            {totalGainLoss.value > 0 ? "+" : ""}
            ${totalGainLoss.value.toFixed(2)} ({totalGainLoss.percentage.toFixed(2)}%)
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-300 mt-2">
            Total Value:
          </p>
          <p className="text-lg font-semibold text-zinc-800 dark:text-white">
            ${totalCurrentValue.toFixed(2)}
          </p>
        </div>



      </div>

      {sortedStocks.length === 0 ? (
        <p className="text-center text-zinc-600 dark:text-white">
          No stocks available.
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
                  onClick={() => handleSort("shares")}
                  className="hover:bg-zinc-400 dark:hover:bg-zinc-800"
                >
                  {sortConfig.key === "shares" &&
                    (sortConfig.direction === "asc" ? "↑ " : "↓ ")}
                  Shares
                </th>
                <th
                  onClick={() => handleSort("currentPrice")}
                  className="hover:bg-zinc-400 dark:hover:bg-zinc-800"
                >
                  {sortConfig.key === "currentPrice" &&
                    (sortConfig.direction === "asc" ? "↑ " : "↓ ")}
                  Current Price
                </th>
                <th
                  onClick={() => handleSort("gainLossPercentage")}
                  className="hover:bg-zinc-400 dark:hover:bg-zinc-800"
                >
                  {sortConfig.key === "gainLossPercentage" &&
                    (sortConfig.direction === "asc" ? "↑ " : "↓ ")}
                  Gain/Loss (%)
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
                      const fullStock = stocks.find(
                        (s) => s.Ticker === stock.Ticker
                      );
                      setSelectedStock(fullStock || stock);
                    }}
                  >
                    <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-600">
                      {stock.Ticker}
                    </td>
                    <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-600">
                      {stock.CompanyName}
                    </td>
                    <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-600">
                      {stock.shares}
                    </td>
                    <td className="px-4 py-2 border border-zinc-300 dark:border-zinc-600">
                      ${stock.currentPrice.toFixed(2)}
                    </td>
                    <td
                      className={`px-4 py-2 font-bold border border-zinc-300 dark:border-zinc-600 ${stock.gainLossPercentage >= 0
                          ? "text-green-500"
                          : "text-red-500"
                        }`}
                    >
                      {stock.gainLossPercentage.toFixed(2)}%
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
            items={sortedStocks}
          />
        </>
      )}
    </div>
  );
};

export default MyStocks;
