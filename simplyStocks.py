from fetchStockData import FetchStockData
from plotStockData import PlotStockData
from watchlist import Watchlist

if __name__ == "__main__":
    # user inputs stock symbol
    symbol = "MSFT"
    function = "TIME_SERIES_DAILY"
    N = 10

    watchlist = Watchlist.loadWatchlist()
    Watchlist.addToWatchlist("TD", watchlist)

    stockDataDict = FetchStockData.fetchStockData(function, ["MSFT", "AAPL", "IBM", "TD"])
    
    # plot data
    PlotStockData.plotStocks(stockDataDict, N)