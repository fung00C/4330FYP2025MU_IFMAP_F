import React, { useEffect, useState } from "react";
import '../styles/ranklist.css';
import buytest from '../test/buylisttest.json';

const buyData = [
  {
      "Rank": 1,
      "Symbol": "AMZN",
      "Type": "Consumer Cyclical",
      "Price": 253.0,
      "Appreciation": 15.3
    },
    {
      "Rank": 2,
      "Symbol": "AAPL",
      "Type": "Technology",
      "Price": 225.0,
      "Appreciation": 12.5
    },
    {
      "Rank": 3,
      "Symbol": "META",
      "Type": "Communication Services",
      "Price": 197.0,
      "Appreciation": 9.7
    },
    {
      "Rank": 4,
      "Symbol": "NVDA",
      "Type": "Technology",
      "Price": 182.0,
      "Appreciation": 8.2
    },
    {
      "Rank": 5,
      "Symbol": "MSFT",
      "Type": "Technology",
      "Price": 168.0,
      "Appreciation": 6.8
    },
    {
      "Rank": 6,
      "Symbol": "GOOGL",
      "Type": "Communication Services",
      "Price": 141.0,
      "Appreciation": 4.1
    },
    {
      "Rank": 7,
      "Symbol": "BRK-B",
      "Type": "Financial Services",
      "Price": 125.0,
      "Appreciation": 3.5
    },
    {
      "Rank": 8,
      "Symbol": "AVGO",
      "Type": "Technology",
      "Price": 88.0,
      "Appreciation": 3.2
    },
    {
      "Rank": 9,
      "Symbol": "TSLA",
      "Type": "Consumer Cyclical",
      "Price": 66.0,
      "Appreciation": 2.4
    },
    {
      "Rank": 10,
      "Symbol": "LLY",
      "Type": "Healthcare",
      "Price": 54.0,
      "Appreciation": 1.6
    }
];

const sellData = [
   {
      "Rank": 1,
      "Symbol": "LLY",
      "Type": "Healthcare",
      "Price": 54.0,
      "Appreciation": 14.6
    },
    {
      "Rank": 2,
      "Symbol": "TSLA",
      "Type": "Consumer Cyclical",
      "Price": 66.0,
      "Appreciation": 14.4
    },
    {
      "Rank": 3,
      "Symbol": "AVGO",
      "Type": "Technology",
      "Price": 88.0,
      "Appreciation": 14.2
    },
    {
      "Rank": 4,
      "Symbol": "BRK-B",
      "Type": "Financial Services",
      "Price": 125.0,
      "Appreciation": 13.5
    },
    {
      "Rank": 5,
      "Symbol": "GOOGL",
      "Type": "Communication Services",
      "Price": 141.0,
      "Appreciation": 12.1
    },
    {
      "Rank": 6,
      "Symbol": "MSFT",
      "Type": "Technology",
      "Price": 168.0,
      "Appreciation": 11.8
    },
    {
      "Rank": 7,
      "Symbol": "NVDA",
      "Type": "Technology",
      "Price": 182.0,
      "Appreciation": 10.2
    },
    {
      "Rank": 8,
      "Symbol": "META",
      "Type": "Communication Services",
      "Price": 197.0,
      "Appreciation": 9.7
    },
    {
      "Rank": 9,
      "Symbol": "AAPL",
      "Type": "Technology",
      "Price": 225.0,
      "Appreciation": 8.5
    },
    {
      "Rank": 10,
      "Symbol": "AMZN",
      "Type": "Consumer Cyclical",
      "Price": 253.0,
      "Appreciation": 7.3
    }
];

function Ranklist() {

  const [mode, setMode] = useState("buy"); // "buy" or "sell"
  const rows = mode === "buy" ? buyData : sellData;


  return (
    <>
      <h1>Rank List Page</h1>
      <div style={{width:'90%', margin:'auto'}}>
        <div className="button_container">
        <button className="list_button"
          onClick={() => setMode("buy")}
          style={{ 
            color: mode === "buy" ? "green" : "#000",
            backgroundColor: mode === "buy" ? "#d1f7d4" : "#eee",
            borderBottomColor: mode === "buy" ? "green" : "transparent"
          }}
        >
          Buy
        </button>
        <button className="list_button"
          onClick={() => setMode("sell")}
          style={{
            color: mode === "sell" ? "red" : "#000",
            backgroundColor: mode === "sell" ? "#f5c6c3" : "#eee",
            borderBottomColor: mode === "sell" ? "red" : "transparent"
          }}
        >
          Sell
        </button>
      </div>

      <table border="solid black 1px" cellPadding="6" width="100%" >
        <thead>
          <tr>
            <th>Rank No.</th>
            <th>Symbol</th>
            <th>Type</th>
            <th>Current Price</th>
            <th>Appreciation Potential</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.Rank}>
              <td>{row.Rank}</td>
              <td>{row.Symbol}</td>
              <td>{row.Type}</td>
              <td>{row.Price}</td>
              <td>{row.Appreciation}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}

export default Ranklist;