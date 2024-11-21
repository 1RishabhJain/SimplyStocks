import requests
import pandas as pd
from demokey import apikey
from cacheData import CacheStockData

class FetchStockData:    
    def fetchStockData(function, symbols):
        stockDataDict = {}
        for symbol in symbols:
            print(f"Fetching data for {symbol}...")
            data = FetchStockData.fetchSingleStockData(function, symbol)
            if data is not None:
                stockDataDict[symbol] = data
            else:
                print(f"Failed to fetch data for {symbol}.")
        return stockDataDict
    
    def fetchSingleStockData(function, symbol):        
        # check cached data
        dataCached = CacheStockData.checkCachedStockData(function, symbol)

        # based on result call fetch stock data
        if not dataCached:
            print("Fetching Data from API")
            data = FetchStockData.fetchDataFromAPI(function, symbol)
        
        elif dataCached:
            print("Cache Hit")
            data = CacheStockData.cacheReadStockData(function, symbol)

        return data
    
    """
    Responsible for fetching data from the AlphaVantage API
    """
    def fetchDataFromAPI(function, symbol):
        url = f"https://www.alphavantage.co/query?function={function}&symbol={symbol}&apikey={apikey}"
        response = requests.get(url)

        if response.status_code != 200:
            print(f"Error: Failed to fetch {function} data for {symbol}.")
            return None
        
        data = response.json()
        
        # Cache data before returning
        CacheStockData.cacheWriteStockData(function, symbol, data)

        return data