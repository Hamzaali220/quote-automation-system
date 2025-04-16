const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    quoteTitle: String,
    reference: String,
    validityDate: Date,

    productSpecs: String,         // Free text input
    specsFile: String,            // File path to uploaded PDF

    communicationText: String,    // Pasted communication
    communicationFile: String,    // File path to uploaded context (optional)

    predictedPrice: Number,       // AI predicted price
    generatedQuoteText: String,   // Final AI-generated quote text
    quotePdfFile: String,         // File path to generated PDF

}, {
    timestamps: true
});

module.exports = mongoose.model('Quote', quoteSchema);
