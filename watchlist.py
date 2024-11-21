import json
WATCHLIST_FILE = "watchlist.json"

class Watchlist:
    def loadWatchlist():
        """
        Load the watchlist from a file.
        Returns:
            list: A list of stock symbols in the watchlist.
        """
        try:
            with open(WATCHLIST_FILE, "r") as file:
                return json.load(file)
        except FileNotFoundError:
            return []
        
    def saveWatchlist(watchlist):
        """
        Save the watchlist to a file.
        Args:
            watchlist (list): The list of stock symbols to save.
        """
        with open(WATCHLIST_FILE, "w") as file:
            json.dump(watchlist, file)

    def addToWatchlist(symbol, watchlist):
        """
        Add a stock symbol to the watchlist.
        Args:
            symbol (str): The stock symbol to add.
            watchlist (list): The current watchlist.
        Returns:
            list: The updated watchlist.
        """
        if symbol not in watchlist:
            watchlist.append(symbol)
            Watchlist.saveWatchlist(watchlist)
            print(f"Added {symbol} to the watchlist.")
        else:
            print(f"{symbol} is already in the watchlist.")
        return watchlist

    def removeFromWatchlist(symbol, watchlist):
        """
        Remove a stock symbol from the watchlist.
        Args:
            symbol (str): The stock symbol to remove.
            watchlist (list): The current watchlist.
        Returns:
            list: The updated watchlist.
        """
        if symbol in watchlist:
            watchlist.remove(symbol)
            Watchlist.saveWatchlist(watchlist)
            print(f"Removed {symbol} from the watchlist.")
        else:
            print(f"{symbol} is not in the watchlist.")
        return watchlist