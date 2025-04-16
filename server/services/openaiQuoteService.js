const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate a formal quote using OpenAI LLM
 */
const generateQuoteText = async ({ customerName, contactPerson, quoteTitle, validityDate, specs, communicationText, price }) => {
const prompt = `
You are an assistant at a company that sells custom aluminum profiles. Generate a complete, professionally formatted quote for a customer based on the following details:

Customer Information:
- Company Name: ${customerName}
- Contact Person: ${contactPerson}

Quote Details:
- Title: ${quoteTitle}
- Valid Until: ${validityDate}
- Predicted Price: ${price} SEK (excluding VAT)

Product Specifications:
${specs}

Additional Customer Communication Notes:
${communicationText}

Requirements:
- Begin with a polite and formal introduction.
- Clearly summarize the customer's request and how the product meets their needs.
- Include a dedicated pricing section with the predicted price (excluding VAT).
- Reaffirm the quote validity date.
- Mention general terms of payment and delivery (e.g. 30 days net, delivery within 2 weeks) or if customer mention for delivery timeline.
- End with a courteous and business-like closing line.
- Use a clean, professional tone suitable for sending directly to a customer.
- Structure the quote in paragraphs that flow like a formal business document.
Also at the closing also include sender company name (Odens AI)

Generate only the final quote text, no labels or explanations.
`;


    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Or 'gpt-4' if available to you
        messages: [
            { role: 'system', content: 'You are a professional quote assistant.' },
            { role: 'user', content: prompt }
        ]
    });

    return response.choices[0].message.content;
};

module.exports = { generateQuoteText };
