import React, { useState } from "react";
import ActionButton from "./ActionButton";
import { AiFillPlusCircle } from "react-icons/ai";
import { MdSearch } from "react-icons/md";
import CreatableSelect from "react-select/creatable";

const customStyles = {
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#000000",
  }),
  control: (provided) => ({
    ...provided,
    backgroundColor: "#000000",
    borderColor: "#cccccc",
    color: "#000000",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#884dff",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#ffffff",
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: 125,
    overflowY: "auto",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#884dff" : "transparent", // Hover color
    color: state.isFocused ? "#ffffff" : "#884dff", // Text color on hover
    cursor: "pointer",
    "&:active": {
      backgroundColor: "#3b82f6", // Active color (when clicked)
    },
  }),
};

export default function StockEntryForm({
  stockSymbol,
  setSymbol,
  stockName,
  setStockName,
  stockSector,
  setSector,
  handleAddStock,
  symbolOptions,
  setSymbolOptions,
  nameOptions,
  setNameOptions,
  sectorOptions,
  syncWidget,
  csvData,
}) {
  // Filter symbol and name options based on the selected sector
  const filteredSymbolOptions = stockSector
    ? symbolOptions.filter((opt) =>
        csvData.some((row) => row.Symbol === opt.value && row.Sector === stockSector)
      )
    : symbolOptions;

  const filteredNameOptions = stockSector
    ? nameOptions.filter((opt) =>
        csvData.some((row) => row.Name === opt.value && row.Sector === stockSector)
      )
    : nameOptions;

  // Unified function to reset all fields
  const resetFields = () => {
    setSymbol("");
    setStockName("");
    setSector("");
  };

  const handleSymbolChange = (option) => {
    if (option) {
      const selectedRow = csvData.find((row) => row.Symbol === option.value);
      if (selectedRow) {
        setSymbol(selectedRow.Symbol);
        setStockName(selectedRow.Name);
        setSector(selectedRow.Sector);
      } else {
        setSymbol(option.value);
      }
    } else {
      setSymbol("");
      setStockName("");
      setSector("");
    }
  };

  const handleNameChange = (option) => {
    if (option) {
      const selectedRow = csvData.find((row) => row.Name === option.value);
      if (selectedRow) {
        setSymbol(selectedRow.Symbol);
        setStockName(selectedRow.Name);
        setSector(selectedRow.Sector);
      } else {
        setStockName(option.value);
      }
    } else {
      setSymbol("");
      setStockName("");
      setSector("");
    }
  };

  const handleSectorChange = (option) => {
    if (option) {
      const selectedSector = option.value;
      setSector(selectedSector);

      // Reset dependent fields
      setSymbol("");
      setStockName("");
    } else {
      setSector("");
    }
  };

  return (
    <section className="flex mb-4 sm:flex-col md:flex-row gap-2">
      <CreatableSelect
        options={filteredSymbolOptions}
        value={stockSymbol ? { value: stockSymbol, label: stockSymbol } : null}
        onChange={handleSymbolChange}
        onCreateOption={(inputValue) => setSymbol(inputValue)}
        isSearchable
        isClearable
        placeholder="Select stock symbol"
        styles={customStyles}
        maxMenuHeight={150}
      />
      <CreatableSelect
        options={filteredNameOptions}
        value={stockName ? { value: stockName, label: stockName } : null}
        onChange={handleNameChange}
        onCreateOption={(inputValue) => setStockName(inputValue)}
        isSearchable
        isClearable
        placeholder="Select stock name"
        styles={customStyles}
        maxMenuHeight={150}
      />
      <CreatableSelect
        options={sectorOptions}
        value={stockSector ? { value: stockSector, label: stockSector } : null}
        onChange={handleSectorChange}
        isSearchable
        isClearable
        placeholder="Select stock sector"
        styles={customStyles}
        maxMenuHeight={150}
      />
      <ActionButton
        classes="bg-violet-600 hover:bg-violet-950"
        onClick={handleAddStock}
      >
        <AiFillPlusCircle size={25} />
      </ActionButton>
      <ActionButton
        classes="bg-violet-600 hover:bg-violet-950"
        onClick={() => syncWidget(stockSymbol)}
      >
        <MdSearch size={25} />
      </ActionButton>
    </section>
  );
}
