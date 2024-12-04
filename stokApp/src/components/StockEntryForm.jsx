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
    
  };

  const handleSymbolChange = (option) => {
    if (option) {
      const selectedRow = csvData.find((row) => row.Symbol === option.value);
      if (selectedRow) {
        setSymbol(selectedRow.Symbol);
        setStockName(selectedRow.Name);
        setSector(selectedRow.Sector);
      }
    } else {
      resetFields(); // Clear all dropdowns if Symbol is cleared
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
      resetFields(); // Clear all dropdowns if Name is cleared
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
      resetFields(); // Clear all dropdowns if Sector is cleared
      setSector("");
    }
  };

  return (
    <section className="flex mb-4 sm:flex-col md:flex-row gap-2">
      <Select
        options={filteredSymbolOptions}
        value={filteredSymbolOptions.find((opt) => opt.value === stockSymbol) || null}
        onChange={(option) => handleSymbolChange(option)}
        isSearchable
        isClearable
        isCreatable
        placeholder="Select stock symbol"
        styles={customStyles}
        maxMenuHeight={150}
      />
      <Select
        options={filteredNameOptions}
        value={filteredNameOptions.find((opt) => opt.value === stockName) || null}
        onChange={(option) => handleNameChange(option)}
        isSearchable
        isClearable
        isCreatable
        placeholder="Select stock name"
        styles={customStyles}
        maxMenuHeight={150}
      />
      <Select
        options={sectorOptions}
        value={sectorOptions.find((opt) => opt.value === stockSector) || null}
        onChange={(option) => handleSectorChange(option)}
        isSearchable
        isClearable
        isCreatable
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