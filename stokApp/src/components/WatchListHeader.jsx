import React from "react";
import Button from "./ActionButton";

export default function WatchlistHeader({ updateStocks, saveListToJSON }) {
  return (
    <section className="w-full watchlist-header">
      <hr className="mb-4" />
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-violet-500 text-3xl font-bold mb-2">Stocks Watchlist</h3>
          <p className="text-violet-500 mb-4">
            Stocks can be edited or deleted by using the buttons in the action column. They can also be filtered alphabetically
            by using the header.
          </p>
        </div>
        <div>
          <Button
            classes="bg-violet-800 hover:bg-violet-950 mb-2"
            onClick={() => saveListToJSON([])}
          >
            Save Watchlist
          </Button>
          <input
            type="file"
            accept=".json"
            className="bg-violet-800 rounded-md px-2 py-1"
            onChange={(event) => {
              const file = event.target.files[0];
              const reader = new FileReader();
              reader.onload = (event) => {
                const fileContent = event.target.result;
                const parsedData = JSON.parse(fileContent);
                updateStocks(parsedData);
              };
              reader.readAsText(file);
            }}
          />
        </div>
      </div>
      <hr className="mb-4" />
    </section>
  );
}