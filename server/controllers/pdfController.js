const { generateQuotePDF } = require('../services/pdfService');
const path = require('path');

const Quote = require('../models/Quote'); // import model

exports.generateAndDownloadPDF = async (req, res) => {
  try {
    const { quoteText, quoteId } = req.body;
    if (!quoteText || !quoteId) {
      return res.status(400).json({ error: 'quoteText and quoteId are required' });
    }

    const pdfPath = await generateQuotePDF(quoteText, `quote_${quoteId}`);
    if (!pdfPath) {
      return res.status(500).json({ error: 'Failed to generate PDF' });
    }
    
    await Quote.findByIdAndUpdate(quoteId, {
      generatedQuoteText: quoteText,
      quotePdfFile: pdfPath
    });

    const relativePath = path.relative(path.join(__dirname, '..', '..'), pdfPath);
    res.status(200).json({ filePath: relativePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};
