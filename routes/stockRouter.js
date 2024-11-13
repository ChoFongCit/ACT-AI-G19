const express = require('express');
const axios = require('axios')

var router = express.Router();

router.get('/search', (req,res)=>{
    res.render('../views/stockSearch')
})

router.get('/',async (req,res)=>{
    var listSymbols = ['aapl','msft','amzn','goog','googl','meta','nvda','tsla','nflx','intc','adbe','crm','orcl','amd','csco','shop']
    // var pm = JSON.stringify(listSymbols)
    try {
        const response = await axios.post("http://localhost:5000/get_stock_data", 
            {array: {listSymbols}},
            { headers: { 'Content-Type': 'application/json' }}
        )
        stockData = response.data;
        res.render('../views/stockList',{'stockList':stockData});
    } catch(error){
        res.status(500);
    }
})
router.get('/detail/:symbol', async(req, res)=>{
    const symbol = req.params.symbol
    try{
        const response = await axios.post('http://localhost:5000/api/stockGraph',{
            params: {symbol}
        });
        const graphHtml = response.data.graph_html;
        const stockInfo = response.data.stockData;
        res.render('../views/stockView',{graphHtml:graphHtml,symbol : symbol, stockInfo:stockInfo})
    }catch(error){
        console.error('Error fetching graph HTML:', error);
        res.status(500).send('Error fetching graph data');
    }
})
router.get('/search/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    try {
        const response = await axios.get(`http://localhost:5000/api/stocks`, {
            params: { symbol }
        });
        console.log(response.data);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stock data' });
    }
});


module.exports = router;