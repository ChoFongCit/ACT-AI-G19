function fetchStockData() {
    const symbol = document.getElementById('stockSymbol').value;
    if (!symbol) {
        alert('Please enter a stock symbol!');
        return;
    }

    fetch(`/stocks/${symbol}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('stockData').innerHTML = `<p>${data.error}</p>`;
            } else {
                document.getElementById('stockData').innerHTML = `
                    <p>Symbol: ${data.symbol}</p>
                    <p>Date: ${data.date}</p>
                    <p>Open: ${data.open}</p>
                    <p>Close: ${data.close}</p>
                    <p>High: ${data.high}</p>
                    <p>Low: ${data.low}</p>
                    <p>Volume: ${data.volume}</p>
                `;
            }
        })
        .catch(error => {
            document.getElementById('stockData').innerHTML = `<p>Error: ${error}</p>`;
        });
}