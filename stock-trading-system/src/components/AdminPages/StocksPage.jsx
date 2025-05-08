import React, { useRef, useState, useEffect } from "react";
import PaginationFooter from "../PaginationFooter";
import AddStockForm from "../AddStockForm";
import DeleteStock from "../DeleteStock";
import EditStockModal from "../EditStockModal";
import MarketScheduleModal from "../MarketScheduleModal";

export default function StocksPage({ stocks, setStocks }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const modalRef = useRef(null);
  const [isEditStockModalOpen, setIsEditStockModalOpen] = useState(false);
  const [isCreateStockOpen, setIsCreateStockOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [isDeleteStockOpen, setIsDeleteStockOpen] = useState(false);
  const [isMarketScheduleOpen, setIsMarketScheduleOpen] = useState(false);

  const toggleDropdown = (index) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  // Close modal if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setDropdownIndex(null); // Close the modal
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setDropdownIndex]);

  useEffect(() => {
    const filteredStocks = stocks.sort((a, b) => {
      if ((a.Ticker || "").toLowerCase() < (b.Ticker || "").toLowerCase())
        return -1;
      if ((a.Ticker || "").toLowerCase() > (b.Ticker || "").toLowerCase())
        return 1;
      return 0;
    });
    setSortedColumn("Ticker");
    setFilteredStocks(filteredStocks);
  }, [stocks]);

  useEffect(() => {
    // Filter stocks based on the search query
    const filteredStocks = stocks.filter(
      (stock) =>
        (stock.id?.toString() || "").includes(searchQuery) ||
        (stock.Ticker?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );
    setFilteredStocks(filteredStocks);
  }, [searchQuery]);

  return (
    <div className="overflow-auto dark:text-white dark:bg-zinc-900 h-full">
      {isCreateStockOpen && (
        <AddStockForm
          setIsCreateStockOpen={setIsCreateStockOpen}
          setStocks={setStocks}
        />
      )}
      {isDeleteStockOpen && (
        <DeleteStock
          setIsDeleteStockOpen={setIsDeleteStockOpen}
          selectedStock={selectedStock}
        />
      )}
      {isEditStockModalOpen && (
        <EditStockModal
          setIsEditStockOpen={setIsEditStockModalOpen}
          selectedStock={selectedStock}
        />
      )}
      {isMarketScheduleOpen && (
        <MarketScheduleModal
          isOpen={isMarketScheduleOpen}
          onClose={() => setIsMarketScheduleOpen(false)}
        />
      )}

      <div className="mt-2  flex items-center justify-end text-center px-5 gap-2">
        <input
          type="text"
          placeholder="Search stocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 w-full dark:bg-zinc-800 rounded-sm dark:border-zinc-600"
        />
        <button
          className="p-2 w-40  rounded-md bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ease-in-out"
          onClick={() => setIsCreateStockOpen(true)}
        >
          Create Stock
        </button>
        <button
          className="p-2 w-56 rounded-md bg-green-500 text-white hover:bg-green-600 transition duration-300 ease-in-out"
          onClick={() => setIsMarketScheduleOpen(true)}
        >
          Edit Market Schedule
        </button>
      </div>
      <div className="w-full px-5 py-2">
        <table className="w-full table-auto border-collapse border-zinc-300 dark:border-zinc-600">
          {/* Header */}
          <thead className="select-none sticky top-[-1px] z-10 bg-zinc-200 dark:bg-zinc-800 border-b border-zinc-300 dark:border-zinc-600 text-center">
            <tr className="dark:border-zinc-600 bg-zinc-200 dark:bg-zinc-800">
              <th
                className="px-4 py-2 hover:cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:transition hover:duration-300 hover:ease-in-out"
                onClick={() => {
                  const newDirection = sortDirection === "asc" ? "desc" : "asc";
                  setSortDirection(newDirection);
                  setSortedColumn("Ticker");
                  setFilteredStocks(
                    [...stocks].sort((a, b) => {
                      const stockA = (a.Ticker || "").toLowerCase();
                      const stockB = (b.Ticker || "").toLowerCase();

                      if (stockA < stockB)
                        return newDirection === "asc" ? -1 : 1;
                      if (stockA > stockB)
                        return newDirection === "asc" ? 1 : -1;
                      return 0;
                    })
                  );
                }}
              >
                Ticker
                {sortedColumn === "Ticker" && (
                  <span className="ml-2">
                    {sortDirection === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
              <th
                className="px-4 py-2 hover:cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:transition hover:duration-300 hover:ease-in-out"
                onClick={() => {
                  const newDirection = sortDirection === "asc" ? "desc" : "asc";
                  setSortDirection(newDirection);
                  setSortedColumn("Company");
                  setFilteredStocks(
                    [...stocks].sort((a, b) => {
                      const stockA = a.CompanyName;
                      const stockB = b.CompanyName;

                      if (stockA < stockB)
                        return newDirection === "asc" ? -1 : 1;
                      if (stockA > stockB)
                        return newDirection === "asc" ? 1 : -1;
                      return 0;
                    })
                  );
                }}
              >
                Company
                {sortedColumn === "Company" && (
                  <span className="ml-2">
                    {sortDirection === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
              <th
                className="px-4 py-2 hover:cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:transition hover:duration-300 hover:ease-in-out"
                onClick={() => {
                  const newDirection = sortDirection === "asc" ? "desc" : "asc";
                  setSortDirection(newDirection);
                  setSortedColumn("Current Price");
                  setFilteredStocks(
                    [...stocks].sort((a, b) => {
                      const stockA = a.CurrentPrice || 0;
                      const stockB = b.CurrentPrice || 0;

                      if (stockA < stockB)
                        return newDirection === "asc" ? -1 : 1;
                      if (stockA > stockB)
                        return newDirection === "asc" ? 1 : -1;
                      return 0;
                    })
                  );
                }}
              >
                Current Price
                {sortedColumn === "Current Price" && (
                  <span className="ml-2">
                    {sortDirection === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
              <th
                className="px-4 py-2 hover:cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:transition hover:duration-300 hover:ease-in-out"
                onClick={() => {
                  const newDirection = sortDirection === "asc" ? "desc" : "asc";
                  setSortDirection(newDirection);
                  setSortedColumn("Volume");
                  setFilteredStocks(
                    [...stocks].sort((a, b) => {
                      const stockA = a.Volume || 0;
                      const stockB = b.Volume || 0;

                      if (stockA < stockB)
                        return newDirection === "asc" ? -1 : 1;
                      if (stockA > stockB)
                        return newDirection === "asc" ? 1 : -1;
                      return 0;
                    })
                  );
                }}
              >
                Volume
                {sortedColumn === "Volume" && (
                  <span className="ml-2">
                    {sortDirection === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks
              .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
              .map((stock, index) => (
                <tr
                  key={index}
                  className="hover:bg-zinc-100 dark:hover:bg-zinc-800 text-center"
                >
                  <td className="border-y border-zinc-300 dark:border-zinc-600 px-4 py-2">
                    {stock.Ticker || "Unknown"}
                  </td>
                  <td className="border-y border-zinc-300 dark:border-zinc-600 px-4 py-2">
                    {stock.CompanyName || "Unknown"}
                  </td>
                  <td className="border-y border-zinc-300 dark:border-zinc-600 px-4 py-2">
                    {"$" + stock.CurrentPrice || "Unknown"}
                  </td>
                  <td className="border-y border-zinc-300 dark:border-zinc-600 px-4 py-2">
                    {stock.Volume || "Unknown"}
                  </td>
                  <td className="border-y border-zinc-300 dark:border-zinc-600 px-4 py-2 hidden sm:table-cell relative">
                    <button
                      className="dark:bg-zinc-800 border rounded-md dark:border-zinc-600 p-2 dark:hover:bg-zinc-700 w-2/3 hover:cursor-pointer"
                      onClick={() => toggleDropdown(index)}
                    >
                      Actions
                    </button>
                    {dropdownIndex === index && (
                      <div
                        ref={modalRef}
                        className="absolute top-11 right-0 -translate-x-1/4 mt-2 w-2/3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-lg shadow-lg z-20 flex flex-col"
                      >
                        <button
                          className="hover:bg-zinc-100 dark:hover:bg-zinc-700 px-5 py-4 text-md font-medium text-left hover:cursor-pointer rounded-t"
                          onClick={() => {
                            setSelectedStock(stock);
                            setIsEditStockModalOpen(true);
                            setDropdownIndex(null);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="hover:bg-zinc-100 dark:hover:bg-zinc-700 px-5 py-4 text-md font-medium text-left hover:cursor-pointer rounded-b"
                          onClick={() => {
                            setIsDeleteStockOpen(true);
                            setSelectedStock(stock);
                            setDropdownIndex(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {/* No Stocks Notification */}
        {filteredStocks.length < 1 && (
          <p className="text-center p-4 font-bold text-lg">No stocks found.</p>
        )}
        {/* Pagination Footer */}
        <div className="px-2 py-5 mx-1">
          <PaginationFooter
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            items={filteredStocks}
          />
        </div>
      </div>
    </div>
  );
}
