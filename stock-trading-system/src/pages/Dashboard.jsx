import MyStocks from "../components/MyStocks";
import Navbar from "../components/Navbar";
import StockTicker from "../components/StockTicker";
import TopStocks from "../components/TopStocks";
import UnderStocks from "../components/UnderStocks";
import { useState } from "react";
import StockInfoModal from "../components/StockInfoModal";

export default function Dashboard({
  darkMode,
  toggleDarkMode,
  stocks,
  loading,
}) {
  const [openPerformingPage, setOpenPerformingPage] = useState("Top");
  const [isStockInfoModalOpen, setIsStockInfoModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState({});

  return (
    <div className="h-screen flex flex-col bg-zinc-300 dark:bg-zinc-900">
      {/* Navbar */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      {isStockInfoModalOpen && (
        <StockInfoModal
          isStockInfoModalOpen={isStockInfoModalOpen}
          setIsStockInfoModalOpen={setIsStockInfoModalOpen}
          selectedStock={selectedStock}
        />
      )}
      {/* Dashboard Content */}
      <div className="flex-1 p-3 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Top Performing Stocks */}
          <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-4 dark:bg-zinc-800 border dark:border-zinc-900">
            <MyStocks
              stocks={stocks}
              loading={loading}
              isStockInfoModalOpen={isStockInfoModalOpen}
              setIsStockInfoModalOpen={setIsStockInfoModalOpen}
              setSelectedStock={setSelectedStock}
            />
          </div>

          {/* Top Performing Stocks */}
          <div className="bg-white shadow-md rounded-lg p-4 dark:bg-zinc-800 border dark:border-zinc-800">
            {openPerformingPage === "Top" && (
              <TopStocks
                stocks={stocks}
                loading={loading}
                setOpenPerformingPage={setOpenPerformingPage}
                isStockInfoModalOpen={isStockInfoModalOpen}
                setIsStockInfoModalOpen={setIsStockInfoModalOpen}
                setSelectedStock={setSelectedStock}
              />
            )}
            {openPerformingPage === "Bottom" && (
              <UnderStocks
                stocks={stocks}
                loading={loading}
                setOpenPerformingPage={setOpenPerformingPage}
                isStockInfoModalOpen={isStockInfoModalOpen}
                setIsStockInfoModalOpen={setIsStockInfoModalOpen}
                setSelectedStock={setSelectedStock}
              />
            )}
          </div>
          {/* Stock Ticker */}
          <div className="lg:col-span-3 bg-white shadow-md rounded-lg p-4 dark:bg-zinc-800 border dark:border-zinc-800">
            <StockTicker
              stocks={stocks}
              loading={loading}
              isStockInfoModalOpen={isStockInfoModalOpen}
              setIsStockInfoModalOpen={setIsStockInfoModalOpen}
              setSelectedStock={setSelectedStock}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
