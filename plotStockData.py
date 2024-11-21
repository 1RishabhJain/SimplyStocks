import matplotlib.pyplot as plt
import pandas as pd

class PlotStockData:
    def plotStocks(stockDataDict, N):
        plt.figure(figsize=(12, 6))

        for symbol, rawData in stockDataDict.items():
            # Manipulate the raw data
            data = PlotStockData.stockDataJsonToDF(rawData)

            if data is None or data.empty:
                print(f"Skipping {symbol} due to invalid data.")
                continue

            # Get the last N data points
            dataToPlot = data.tail(N)

            # Plot the closing price
            plt.plot(dataToPlot.index, dataToPlot['close'], label=f'{symbol} Closing Price')

        # Add title, labels, and legend
        plt.title(f'Stock Prices for Last {N} Data Points')
        plt.xlabel('Date')
        plt.ylabel('Price')
        plt.legend()
        plt.grid(True)
        plt.show()

    def stockDataJsonToDF(data):
        key = next((k for k in data.keys() if "Time Series" in k), None)
        if not key or key not in data:
            print("Error: No time series data found. Please check the stock symbol and function.")
            return None

        time_series = data.get(key, {})
        if not time_series:
            print("Error: The time series data is empty.")
            return None

        # Convert to DataFrame
        df = pd.DataFrame.from_dict(time_series, orient="index")
        df.columns = ['open', 'high', 'low', 'close', 'volume']
        df.index = pd.to_datetime(df.index)
        df = df.sort_index()

        # Convert the 'close' column to numeric
        df['close'] = pd.to_numeric(df['close'], errors='coerce')

        # Check for valid data
        if df.empty or len(df) < 1:
            print("Error: No valid data available.")
            return None

        return df