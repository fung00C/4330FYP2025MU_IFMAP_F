import React, { use, useEffect, useState } from "react";
import '../styles/ranklist.css';


function Ranklist() {

  const [mode, setMode] = useState("buy"); // "buy" or "sell"
  const [symbols, setSymbols] = useState([]);
  const [buyData, setBuyData] = useState([]);
  const [sellData, setSellData] = useState([]);
  const [loading, setLoading] = useState(true);
  const rows = mode === "buy" ? buyData : sellData;

  useEffect(() => {
    setLoading(true);
    if (symbols.length === 0) return;
    const promises = symbols.map(symbol => 
      fetch(`http://localhost:8000/rank/stock?symbol=${symbol}`)
        .then(res => res.json())
    );

    Promise.all(promises)
      .then(results => {
      // results = [{search: ["AAPL"], data: [{potential: -4.21}]}, ...]
      
      const allRows = results
        .map((data, i) => {
          const symbol = symbols[i];
          const row = data.data?.[0];
          return row ? { symbol, ...row } : null;
        })
        .filter(Boolean); // remove nulls (not found symbols)

      // Split and sort
      const buys = allRows
        .filter(r => r.potential >= 0)
        .sort((a, b) => b.potential - a.potential);

      const sells = allRows
        .filter(r => r.potential < 0)
        .sort((a, b) => a.potential - b.potential);

      setBuyData(buys);
      setSellData(sells);
    })
    .catch(err => console.error('Fetch error:', err))
    .finally(() => setLoading(false));
  }, [symbols]);

  useEffect(() => {
    fetch(`http://localhost:8000/ticker-symbols/`)
      .then(res => res.json())
      .then(data => {
        setSymbols(data.tickers);
      })
      .catch(err => console.error("Failed fetching ticker symbols", err));
  }, []);

  return (
    <>
      <h1>Rank List Page</h1>
      <div className="background"></div>
      <div style={{width:'90%', margin:'auto', marginBottom:'5%'}}>
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
            <th>Industry</th>
            <th>Last Close Price</th>
            {mode === "buy" ? <th>Appreciation Potential</th> : <th>Depreciation Potential</th>}
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>Loading...</td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.index}>
                <td>{index + 1}</td>
                <td><a href={`http://localhost:3000/detail/${row.symbol}`}>{row.symbol}</a></td>
                <td>{row.industry}</td>
                <td>{row.current_price.toFixed(2)}</td>
                <td>{Math.abs(row.potential).toFixed(2)}%</td>
              </tr>
         ))}
         </tbody>
        )}
      </table>
      <footer style={{textAlign:'center', padding:'12px', color:'#888'}}>
                    <p>@2025-2026 Yishu3 Intelligence Financial Market Analysis Platform</p>
                </footer>
      </div>
    </>
  );
}

export default Ranklist;