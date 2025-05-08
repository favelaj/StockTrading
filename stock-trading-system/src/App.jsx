import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Account from "./pages/Account";
import API_BASE_URL from "./config";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  };

  useEffect(() => {
    const storedPreference = localStorage.getItem("darkMode");
    if (storedPreference === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/data`);
        const data = await response.json();
        setStocks(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setLoading(false);
      }
    };

    fetchStocks();

    const socket = io("http://3.90.131.54:4000");
    socket.on("stockUpdate", (updatedStocks) => {
      setStocks(updatedStocks);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={<Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Customer", "Admin"]}>
            <Dashboard
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              stocks={stocks}
              loading={loading}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <Admin
              stocks={stocks}
              darkMode={darkMode}
              setStocks={setStocks}
              toggleDarkMode={toggleDarkMode}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <Account darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        }
      />
      <Route
        path="/login"
        element={<Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
      />
      <Route
        path="/register"
        element={<Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
      />
      <Route
        path="/*"
        element={<Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
      />
    </Routes>
  );
}
