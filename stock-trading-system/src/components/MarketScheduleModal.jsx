import React, { useState, useEffect } from "react";
import API_BASE_URL from "../config.js";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MARKET_TZ = "America/New_York";

const toZonedDate = (d = new Date(), tz = MARKET_TZ) => {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(d).map(({ type, value }) => [type, value])
  );
  return new Date(
    `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`
  );
};

const MarketScheduleModal = ({ isOpen, onClose }) => {
  const [schedule, setSchedule] = useState({
    MarketOpen: "09:00:00",
    MarketClose: "17:00:00",
    Holidays: "",
    MarketStatus: 1,
  });
  const [selectedDays, setSelectedDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/market-schedule`);
        const data = await res.json();
  
        // Set form fields based on fetched data
        setSchedule({
          MarketOpen: data.MarketOpen || "09:00:00",
          MarketClose: data.MarketClose || "17:00:00",
          Holidays: data.Holidays || "",
          MarketStatus: data.MarketStatus ?? 1,
        });
  
        // Parse OpenDays (comma-separated string) into selectedDays array
        if (typeof data.OpenDays === "string" && data.OpenDays.length > 0) {
          setSelectedDays(
            data.OpenDays.split(",").map((day) => parseInt(day.trim(), 10))
          );
        } else {
          setSelectedDays([]);
        }
  
      } catch (err) {
        console.error("Failed to fetch market schedule:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen]);
  
  const handleChange = (key, value) => {
    setSchedule((prev) => ({ ...prev, [key]: value }));
  };

  const toggleDay = (dayNumber) => {
    setSelectedDays((prev) =>
      prev.includes(dayNumber)
        ? prev.filter((d) => d !== dayNumber)
        : [...prev, dayNumber]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/market-schedule/1`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          openTime: schedule.MarketOpen,               // <-- corrected
          closeTime: schedule.MarketClose,             // <-- corrected
          openWeekdays: [...selectedDays].sort((a, b) => a - b), // <-- corrected
          holidays: schedule.Holidays,                 // <-- corrected
          status: schedule.MarketStatus,               // <-- corrected
        }),
      });
  
      if (!res.ok) {
        throw new Error("Failed to save schedule");
      }
  
      setSuccessMessage("Market schedule updated successfully.");
    } catch (err) {
      console.error("Error saving market schedule:", err);
      setErrorMessage("Failed to update market schedule. Please try again.");
    } finally {
      setSaving(false);
  
      if (successMessage) {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }
  };
    

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-black dark:text-white">
          Market Schedule
        </h2>

        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Loading…
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Market Open</label>
                <input
                  type="time"
                  className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white"
                  value={schedule.MarketOpen}
                  onChange={(e) => handleChange("MarketOpen", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Market Close</label>
                <input
                  type="time"
                  className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white"
                  value={schedule.MarketClose}
                  onChange={(e) => handleChange("MarketClose", e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium block mb-1">Open Days</label>
                <div className="grid grid-cols-3 gap-2">
                  {WEEKDAYS.map((day, idx) => (
                    <label key={idx} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(idx + 1)}
                        onChange={() => toggleDay(idx + 1)}
                        className="form-checkbox"
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">Holidays</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white"
                  value={schedule.Holidays}
                  onChange={(e) => handleChange("Holidays", e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">Market Status</label>
                <select
                  className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white"
                  value={schedule.MarketStatus}
                  onChange={(e) =>
                    handleChange("MarketStatus", Number(e.target.value))
                  }
                >
                  <option value={1}>Open</option>
                  <option value={0}>Closed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
            {successMessage && (
                  <p className="text-green-500 text-center mt-2">{successMessage}</p>
                )}
                {errorMessage && (
                  <p className="text-red-500 text-center mt-2">{errorMessage}</p>
                )}

              <button
                onClick={onClose}
                className="bg-zinc-500 text-white px-4 py-2 rounded hover:bg-zinc-600"
              >
                Close
              </button>
              <button
                disabled={saving}
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MarketScheduleModal;
