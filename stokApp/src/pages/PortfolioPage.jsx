import React from "react";
import { useState, useEffect, useRef } from "react";
import GraphWidget from "../components/GraphWidget"; // Adjust the import path as needed

const PortfolioPage = () => {
  const [symbol, setSymbol] = useState("AAPL"); // Default symbol, you can change it as needed

  return (
    <div className="p-5">
      <h1 className="text-3xl text-violet-500">Stock Comparison</h1>
      <p>You can view stock info and compare stocks  here.</p>
      <GraphWidget symbol={symbol} />
    </div>
  );
};

export default PortfolioPage;
