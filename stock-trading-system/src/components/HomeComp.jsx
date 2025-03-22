import React, { useEffect, useState } from "react";
import axios from "axios";

const HomeComp = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://23.22.184.219/api/data")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <h1>Database Data</h1>
      <ul>
        <li>
          Ticker | Company | Price | Volume | Market Cap | Day Start | Day Low |
          Day High
        </li>
        {data.map((item) => (
          <li key={item.id}>
            {item.ticker} | {item.company} | ${item.price} | {item.volume} | $
            {item.price * item.volume} | ${item.dayStart} | ${item.dayLow} | $
            {item.dayHigh}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomeComp;
