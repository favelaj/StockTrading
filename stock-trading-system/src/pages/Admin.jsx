import Navbar from "../components/Navbar";
import StocksPage from "../components/AdminPages/StocksPage";

export default function Admin({ stocks, setStocks, darkMode, toggleDarkMode }) {
  return (
    <div className="h-screen flex flex-col">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex-1 overflow-auto">
        <StocksPage stocks={stocks} setStocks={setStocks} />
      </div>
    </div>
  );
}
