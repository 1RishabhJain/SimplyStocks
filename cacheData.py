import os
import json

class CacheStockData:
    @staticmethod
    def checkCachedStockData(function, symbol):
        directory = CacheStockData.getDirectoryPath(function)
        filename = CacheStockData.getFilename(directory, symbol)
        
        try:
            with open(filename, "r") as f:
                print(f"Cached {function} Data found for {symbol}")
                return True
        except FileNotFoundError:
            print(f"No {function} Cached Data for {symbol}")
            return False

    @staticmethod
    def cacheWriteStockData(function, symbol, data):
        print(f"Caching {symbol} Data")
        directory = CacheStockData.getDirectoryPath(function)
        filename = CacheStockData.getFilename(directory, symbol)

        # Create the directory if it doesn't exist
        if not os.path.exists(directory):
            os.makedirs(directory)

        with open(filename, "w") as f:
            json.dump(data, f)

    @staticmethod
    def cacheReadStockData(function, symbol):
        print(f"Reading {symbol} Data from Cache")
        directory = CacheStockData.getDirectoryPath(function)
        filename = CacheStockData.getFilename(directory, symbol)
        
        with open(filename, "r") as file:
            data = json.load(file)

        return data

    @staticmethod
    def getDirectoryPath(function):
        return f"./cachedData/{function}/"
    
    @staticmethod
    def getFilename(directory, symbol):
        return os.path.join(directory, f"{symbol}.json")