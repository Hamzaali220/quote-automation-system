const { extractTextFromFile } = require('../utils/extractFileText');
const { predictPrice } = require('../services/aiBridge');
const { generateQuoteText } = require('../services/openaiQuoteService');
const { extractPredictionInputFromText } = require('../services/specExtractor');
const Customer = require('../models/Customer');
const Quote = require('../models/Quote');

exports.createQuote = async (req, res) => {
  try {
    const {
      customerId,
      quoteTitle,
      reference,
      validityDate,
      productSpecs,
      communicationText
    } = req.body;

    const specsFile = req.files?.specsFile?.[0]?.path || null;
    const communicationFile = req.files?.communicationFile?.[0]?.path || null;

    //Read and merge product specs (textarea + PDF)
    const specsFileText = await extractTextFromFile(specsFile);
    const fullSpecsText = [productSpecs, specsFileText].filter(Boolean).join('\n\n');
    
    //Read and merge customer communication (textarea + file)
    const communicationFileText = await extractTextFromFile(communicationFile);
    const fullCommunicationText = [communicationText, communicationFileText].filter(Boolean).join('\n\n');
    
    // Extract structured data from full specs text
    const structuredInput = await extractPredictionInputFromText(fullSpecsText); // ← use OpenAI or mock

    // Predict price using extracted structured data
    const predictedPrice = await predictPrice(structuredInput);

    // Get customer info for LLM
    const customer = await Customer.findById(customerId);

    // Generate final quote using all info
    const generatedQuoteText = await generateQuoteText({
      customerName: customer.companyName,
      contactPerson: customer.contactPerson,
      quoteTitle,
      validityDate,
      specs: fullSpecsText,
      communicationText: fullCommunicationText,
      price: predictedPrice
    });

    // Save quote
    const newQuote = new Quote({
      customer: customerId,
      quoteTitle,
      reference,
      validityDate,
      productSpecs: fullSpecsText,
      specsFile,
      communicationText: fullCommunicationText,
      communicationFile,
      predictedPrice,
      generatedQuoteText,
      quotePdfFile: null
    });

    await newQuote.save();

    res.status(201).json({
      message: 'Quote created successfully',
      _id: newQuote._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while creating quote' });
  }
};

exports.getQuoteById = async (req, res) => {
    try {
      const quote = await Quote.findById(req.params.id).populate('customer');
      if (!quote) return res.status(404).json({ error: 'Quote not found' });
      res.json(quote);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  
