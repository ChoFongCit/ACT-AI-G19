const express = require('express');
const router = express.Router();
const fs = require('fs');

// Route for the FAQ page
router.get('/', (req, res) => {
    fs.readFile('./views/faq.json', (err, data) => {
        if (err) {
            console.error('Error reading FAQ file:', err);
            return res.status(500).send('Server error');
        }
        
        let faqInfo;
        try {
            faqInfo = JSON.parse(data);
            faqInfo.sort((a, b) => a.index - b.index);
        } catch (parseErr) {
            console.error('Error parsing FAQ data:', parseErr);
            return res.status(500).send('Server error');
        }
        
        // Render the view to display the FAQs
        res.render('faq', {
            faqInfo: faqInfo
        });
    });
});

module.exports = router;
