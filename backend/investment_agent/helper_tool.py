import requests

def get_stock_sentiment(ticker: str) -> dict:
    """
    Retrieves sentiment analysis and analyst consensus grades for a given stock ticker.
    
    This function fetches analyst consensus grades and sentiment data from the Financial Modeling Prep API.
    The data includes analyst ratings, price targets, and other sentiment indicators that can help assess
    market sentiment towards a particular stock.
    
    Args:
        ticker (str): A stock ticker symbol (e.g., "AAPL", "MSFT")
                     
                     Schema:
                       type: string
                       description: A stock ticker symbol (e.g., "AAPL", "MSFT")
    
    Returns:
        dict: A dictionary containing the sentiment and analyst consensus data in JSON format.
              Returns an empty dictionary if the request fails.
              
    Example:
        >>> get_stock_sentiment("AAPL")
        {
            'symbol': 'AAPL',
            'date': '2023-01-01',
            'analystRatings': [...],
            'targetPrice': 170.00,
            'strongBuy': 15,
            'buy': 10,
            'hold': 5,
            'sell': 0,
            'strongSell': 0
        }
    """

    api_key = "WVfrB6TsRBPL0Xq3ejhdfEpTWLlfT7iN"
    url = f"https://financialmodelingprep.com/stable/grades-consensus?symbol={ticker}&apikey={api_key}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        data = response.json()
        if not isinstance(data, (dict, list)):  # Ensure we have valid JSON data
            return {"error": "Invalid data format from API"}
        return data
    except requests.exceptions.RequestException as e:
        return {"error": f"API request failed: {str(e)}"}
    except ValueError as e:
        return {"error": f"Failed to parse JSON response: {str(e)}"}


def get_market_data_for_assets(tickers: list[str]) -> dict:
    """
    Fetches comprehensive financial data for one or more stock tickers from the Financial Modeling Prep API.
    
    This function collects a wide range of financial data including income statements, balance sheets,
    cash flow statements, market capitalization, earnings reports, and analyst grades for the specified
    ticker(s). The data is organized in a nested dictionary structure for easy access.
    
    Args:
        tickers (list): A list of stock ticker symbols as strings.
                     Example: ["AAPL", "MSFT"] or ["TSLA"]
                     
                     Schema:
                       type: array
                       items:
                         type: string
                         description: A stock ticker symbol (e.g., "AAPL", "MSFT")
    
    Returns:
        dict: A nested dictionary where the first level keys are ticker symbols and the second level
              contains different types of financial data. Each data type is stored under its respective
              key (e.g., 'income-statement', 'balance-sheet-statement').
              
              Structure:
              {
                  'TICKER1': {
                      'income-statement': [...],
                      'balance-sheet-statement': [...],
                      'cash-flow-statement': [...],
                      'shares-float': [...],
                      'market-capitalization': [...],
                      'earnings': [...],
                      'enterprise-value': [...],
                      'quote': [...],
                      'grades-consensus': [...]
                  },
                  'TICKER2': { ... }
              }
              
    Example:
        >>> get_market_data_for_assets(["AAPL"])
        {
            'AAPL': {
                'income-statement': [...],
                'balance-sheet-statement': [...],
                ...
            }
        }
    """
    
    # get market data from api
    base_url = "https://financialmodelingprep.com/stable"
    financial_data_list = ["ratios-ttm", "key-metrics-ttm", "financial-scores", "income-statement", "balance-sheet-statement", 
                           "cash-flow-statement", "shares-float", "market-capitalization", "earnings", "enterprise-value", 
                           "quote", "owners-earning", "income-statement-growth", "balance-sheet-statement-growth", 
                           "cash-flow-statement-growth", "financial-scores-growth","analyst-estimates"] 
    api_key = "WVfrB6TsRBPL0Xq3ejhdfEpTWLlfT7iN"

    data = {}
    
    for ticker in tickers:
        data[ticker] = {}
        for financial_data in financial_data_list:
            try:
                if financial_data == "analyst-estimates":
                    url = f"{base_url}/{financial_data}?symbol={ticker}&apikey={api_key}&period=annual&page=0&limit=10"
                else:
                    url = f"{base_url}/{financial_data}?symbol={ticker}&apikey={api_key}"
                response = requests.get(url)
                response.raise_for_status()
                json_data = response.json()
                # Only add if we got valid JSON data
                if isinstance(json_data, (dict, list)):
                    data[ticker][financial_data] = json_data
                else:
                    data[ticker][financial_data] = {"error": "Invalid data format from API"}
            except requests.exceptions.RequestException as e:
                data[ticker][financial_data] = {"error": f"API request failed: {str(e)}"}
            except ValueError as e:
                data[ticker][financial_data] = {"error": f"Failed to parse JSON response: {str(e)}"}
    
    return data