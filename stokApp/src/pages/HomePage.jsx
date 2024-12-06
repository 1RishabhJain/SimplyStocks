import { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import "./pages.css";
import CurrentDate from "../components/CurrentDate";
import GraphWidget from "../components/GraphWidget";
import StockEntryForm from "../components/StockEntryForm";
import WatchListHeader from "../components/WatchListHeader";
import WatchListTable from "../components/WatchListTable";
import Plotter from "../components/Plotter";

function HomePage() {
  const [selectedSymbol, setSelectedSymbol] = useState("IBM"); // Default symbol
  const [stockList, setStockList] = useState([]);
  const [inputSymbol, setInputSymbol] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputSector, setInputSector] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [symbolOptions, setSymbolOptions] = useState([]);
  const [nameOptions, setNameOptions] = useState([]);
  const [sectorOptions, setSectorOptions] = useState([]);

  const widgetContainerRef = useRef(null);

  // Load stock list from local storage
  useEffect(() => {
    const storedStockList = localStorage.getItem("stockList");
    if (storedStockList) {
      setStockList(JSON.parse(storedStockList));
    }
  }, []);

  // Parse CSV data
  useEffect(() => {
    const fetchAndParseCSV = async () => {
      try {
        const response = await fetch("/SP500.csv");
        const csvText = await response.text();
        const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        setCsvData(parsedData.data);
      } catch (error) {
        console.error("Error fetching or parsing the CSV file:", error);
      }
    };
    fetchAndParseCSV();
  }, []);

  // Update options based on CSV data
  useEffect(() => {
    if (csvData.length > 0) {
      setSymbolOptions(csvData.map((item) => ({ value: item.Symbol, label: item.Symbol })));
      setNameOptions(csvData.map((item) => ({ value: item.Name, label: item.Name })));
      setSectorOptions(
        [...new Set(csvData.map((item) => item.Sector))].map((sector) => ({
          value: sector,
          label: sector,
        }))
      );
    }
  }, [csvData]);

  // Save stock list to local storage
  useEffect(() => {
    if (stockList.length > 0) {
      localStorage.setItem("stockList", JSON.stringify(stockList));
    }
  }, [stockList]);

  // Function to export stock list to JSON
  const exportStockList = () => {
    const jsonData = JSON.stringify(stockList, null, 2);
    const dataBlob = new Blob([jsonData], { type: "application/json" });
    const downloadUrl = URL.createObjectURL(dataBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = "stockList.json";
    downloadLink.click();
  };

  // Add a new stock
  const addStock = () => {
    if (inputSymbol.trim() && inputName.trim() && inputSector.trim()) {
      const upperSymbol = inputSymbol.toUpperCase();
      if (stockList.some((stock) => stock.symbol === upperSymbol)) {
        alert(`${upperSymbol} already exists in the list!`);
      } else {
        setStockList([...stockList, { symbol: upperSymbol, name: inputName, sector: inputSector }]);
        setSelectedSymbol(inputSymbol); // Update symbol for graph
        setInputSymbol("");
        setInputName("");
        setInputSector("");
      }
    } else {
      alert("Please fill all the fields!");
    }
  };

  // Edit stock details
  const editStock = (symbol, newName, newSector) => {
    const updatedStockList = stockList.map((stock) =>
      stock.symbol === symbol
        ? { ...stock, name: newName || stock.name, sector: newSector || stock.sector }
        : stock
    );
    setStockList(updatedStockList);
  };

  // Remove a stock
  const removeStock = (symbol) => {
    if (window.confirm(`Are you sure you want to remove ${symbol}?`)) {
      setStockList(stockList.filter((stock) => stock.symbol !== symbol));
    }
  };

  // Update widget and graph
  const displayStockWidget = (symbol) => {
    widgetContainerRef.current.scrollIntoView({ behavior: "smooth" });
    setSelectedSymbol(symbol); // Update the graph symbol
  };

  // Embed TradingView widget
  useEffect(() => {
    const scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
    scriptElement.async = true;
    scriptElement.innerHTML = `
      {
        "symbol": "${selectedSymbol}",
        "width": "100%",
        "height": "180",
        "locale": "en",
        "colorTheme": "dark",
        "isTransparent": false
      }
    `;
    const widgetContainer = document.querySelector(".tradingview-widget-container__widget");
    if (widgetContainer) {
      widgetContainer.innerHTML = "";
      widgetContainer.appendChild(scriptElement);
    }
  }, [selectedSymbol]);

  const date = new Date();
  const dateF = date.toLocaleDateString();
  return (
    <div className="w-full min-h-screen flex flex-col xl:flex-row gap-5 text-white bg-gray-800 overflow-y-auto">
      <header className="w-full flex flex-col mt-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold my-3 px-2 py-1 rounded-md text-violet-500">SimplyStocks</h1>
          <div className="text-xl font-bold my-3 px-2 py-1 rounded-md bg-violet-700">
      {dateF}
    </div>
        </div>
        <div
          ref={widgetContainerRef}
          className="tradingview-widget-container__widget rounded-md mb-2 max-h-96 overflow-auto"
        ></div>
        <div>
          <h1>Stock Data Visualization</h1>
          <Plotter apikey="AR8VLH8I12XTCBY0" symbol={selectedSymbol} /> {/* Pass selectedSymbol */}
        </div>
        <StockEntryForm
          stockSymbol={inputSymbol}
          setSymbol={setInputSymbol}
          stockName={inputName}
          setStockName={setInputName}
          stockSector={inputSector}
          setSector={setInputSector}
          handleAddStock={addStock}
          symbolOptions={symbolOptions}
          nameOptions={nameOptions}
          sectorOptions={sectorOptions}
          syncWidget={displayStockWidget}
          csvData={csvData}
        />
      </header>
      <main className="mt-5">
        <WatchListHeader saveListToJSON={exportStockList} updateStocks={setStockList} />
        <WatchListTable
          stocks={stockList}
          editStockDetails={editStock}
          removeStock={removeStock}
          syncWidget={displayStockWidget}
        />
      </main>
    </div>
  );
}

export default HomePage;