import React from "react";
import ActionButton from "./ActionButton";
import { AiFillPlusCircle } from "react-icons/ai";
import { MdSearch } from "react-icons/md";
import Select from "react-select";

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
  nameOptions,
  sectorOptions,
  syncWidget,
  csvData,
}) {
  // Adjusted functions to use the passed `csvData`
  const handleSymbolChange = (option) => {
    if (option) {
      const selectedRow = csvData.find((row) => row.Symbol === option.value);
      if (selectedRow) {
        setSymbol(selectedRow.Symbol);
        setStockName(selectedRow.Name);
        setSector(selectedRow.Sector);
      }
    } else {
      // Clear all selects
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
      }
    } else {
      // Clear all selects
      setSymbol("");
      setStockName("");
      setSector("");
    }
  };

  const handleSectorChange = (option) => {
    if (option) {
      const selectedRow = csvData.find((row) => row.Sector === option.value);
      if (selectedRow) {
        setSymbol(selectedRow.Symbol);
        setStockName(selectedRow.Name);
        setSector(selectedRow.Sector);
      }
    } else {
      // Clear all selects
      setSymbol("");
      setStockName("");
      setSector("");
    }
  };

  return (
    <section className="flex mb-4 sm:flex-col md:flex-row gap-2">
   <Select
  options={symbolOptions}
  value={symbolOptions.find((opt) => opt.value === stockSymbol) || null}  // Set to null if no symbol is selected
  onChange={(option) => handleSymbolChange(option)}
  isSearchable
  isClearable
  placeholder="Select stock symbol"
  styles={customStyles}
  maxMenuHeight={150}
/>

<Select
  options={nameOptions}
  value={nameOptions.find((opt) => opt.value === stockName) || null}  // Set to null if no name is selected
  onChange={(option) => handleNameChange(option)}
  isSearchable
  isClearable
  placeholder="Select stock name"
  styles={customStyles}
  maxMenuHeight={150}
/>

<Select
  options={sectorOptions}
  value={sectorOptions.find((opt) => opt.value === stockSector) || null}  // Set to null if no sector is selected
  onChange={(option) => handleSectorChange(option)}
  isSearchable
  isClearable
  placeholder="Select stock sector"
  styles={customStyles}
  maxMenuHeight={150}
/>
      <ActionButton
        classes="bg-violet-600 hover:bg-violet-950"
        onClick={() => handleAddStock()}
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