const express = require('express');
const axios = require('axios')

var stockRouter = express.Router();

stockRouter.get('/', (req,res)=>{
    res.render('../views/stocks')
})

stockRouter.get('/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    try {
        const response = await axios.get(`http://localhost:5000/api/stocks`, {
            params: { symbol }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stock data' });
    }
});


module.exports = stockRouter;