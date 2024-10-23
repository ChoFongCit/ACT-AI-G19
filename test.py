import pandas as pd
import yfinance as yf
import plotly.express as px
from flask import Flask, render_template_string
tickers = ['AAPL', 'GOOGL', 'MSFT']

# Step 2: Download historical data for the tickers
data = yf.download(tickers, period='6mo', interval='1d')

# Step 3: Extract 'Close' prices for each ticker
closing_prices = data['Close']

# Step 4: Plot each ticker's closing prices using Plotly Express
for ticker in tickers:
    # Create a new plot for each ticker
    fig = px.line(
        closing_prices, 
        x=closing_prices.index, 
        y=ticker, 
        title=f'{ticker} Closing Price Over Time',
        labels={'x': 'Date', 'y': 'Price (USD)'}
    )
    
    # Show the figure
    fig.show()