import { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
//import csvFile from "./assets/SP500.csv";
import "./App.css";
import CurrentDate from "./components/CurrentDate";
import GraphWidget from "./components/GraphWidget";
import StockEntryForm from "./components/StockEntryForm";
import WatchListHeader from "./components/WatchListHeader";
import WatchListTable from "./components/WatchListTable";

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
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

  
  useEffect(() => {
    const fetchAndParseCSV = async () => {
      try {
        const response = await fetch("/SP500.csv");
        const csvText = await response.text();

        const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        setCsvData(parsedData.data); // Update state here
      } catch (error) {
        console.error("Error fetching or parsing the CSV file:", error);
      }
    };

    fetchAndParseCSV();
  }, []);

  useEffect(() => {
    if (csvData.length > 0) {
      const symbolOptions = csvData.map((item) => ({
        value: item.Symbol,
        label: item.Symbol
      }));

      const nameOptions = csvData.map((item) => ({
        value: item.Name,
        label: item.Name
      }));

      const sectorOptions = [
        ...new Set(csvData.map((item) => item.Sector)) // Create unique sectors
      ].map((sector) => ({
        value: sector,
        label: sector
      }));

      setSymbolOptions(symbolOptions);
      setNameOptions(nameOptions);
      setSectorOptions(sectorOptions);
    }
  }, [csvData]);
  

  // Save stock list to local storage
  useEffect(() => {
    if (stockList.length > 0) {
      localStorage.setItem("stockList", JSON.stringify(stockList));
    }
  }, [stockList]);

  // Export stock list to JSON file
  const exportStockList = () => {
    const jsonData = JSON.stringify(stockList, null, 2);
    const dataBlob = new Blob([jsonData], { type: "application/json" });
    const downloadUrl = URL.createObjectURL(dataBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = "stockList.json";
    downloadLink.click();
  };

  // Add a new stock to the list
  const addStock = () => {
    if (inputSymbol.trim() && inputName.trim() && inputSector.trim()) {
      const upperSymbol = inputSymbol.toUpperCase();
      if (stockList.some((stock) => stock.symbol === upperSymbol)) {
        alert(`${upperSymbol} already exists in the list!`);
        
      } else {
        setStockList([
          ...stockList,
          { symbol: upperSymbol, name: inputName, sector: inputSector },
        ]);
        displayStockWidget(inputSymbol);
        setInputSymbol("");
        setInputName("");
        setInputSector("");
        
      }
    } else {
      alert("Please fill all the fields!");
    }
  };

  // Edit an existing stock
  const editStock = (symbol, newName, newSector) => {
    const updatedStockList = stockList.map((stock) =>
      stock.symbol === symbol
        ? { ...stock, name: newName || stock.name, sector: newSector || stock.sector }
        : stock
    );
    setStockList(updatedStockList);
  };

  // Remove a stock from the list
  const removeStock = (symbol) => {
    if (window.confirm(`Are you sure you want to remove ${symbol}?`)) {
      const updatedStockList = stockList.filter((stock) => stock.symbol !== symbol);
      setStockList(updatedStockList);
    }
  };

  // Open stock details and chart widget
  const displayStockWidget = (symbol) => {
    widgetContainerRef.current.scrollIntoView({ behavior: "smooth" });
    setSelectedSymbol(symbol);
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
        "height": "200",
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

  return (
    <div className="w-full min-h-screen flex flex-col xl:flex-row gap-5 text-white bg-gray-800 overflow-y-auto">
      <nav className="fixed top-0 left-0 w-full bg-slate-900 text-white shadow-lg z-10">
        <ul className="flex justify-around py-3">
          <li className="hover:text-violet-500 cursor-pointer">Login</li>
          <li className="hover:text-violet-500 cursor-pointer">Home</li>
          <li className="hover:text-violet-500 cursor-pointer">Portfolio</li>
          <li className="hover:text-violet-500 cursor-pointer">Account Settings</li>
        </ul>
      </nav>
      <header className="pt-10 w-full flex flex-col mt-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold my-3 px-2 py-1 rounded-md text-violet-500">SimplyStocks</h1>
          <CurrentDate />
        </div>
        <div
          ref={widgetContainerRef}
          className="tradingview-widget-container__widget rounded-md mb-2 max-h-96 overflow-auto"
        ></div>
        <GraphWidget symbol={selectedSymbol} />
        <StockEntryForm
          stockName={inputName}
          setStockName={setInputName}
          stockSymbol={inputSymbol}
          setSymbol={setInputSymbol}
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

export default App;