const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function extractPricingEngineVariables(text) {

const prompt = `
You are an assistant that extracts structured quote data from product and pricing documents.

Your task is to extract the following fields from the provided text, if available. Do not hallucinate missing values. Extract only what can be confidently found or inferred:
also if you not find same match of variable you can look for similar match of variable name or any related info. 
- ProfileType (e.g., Flat, T, I, Round — or other valid types)
- Alloy (e.g., 6060, 6061, 6063 — or any mentioned alloy)
- Weight_per_meter (numeric, in kg per meter)
- Total_length (numeric, in meters or millimeters)
- SurfaceTreatment (e.g., Anodized, MillFinish — or other described surface finishes)
- MachiningComplexity (numeric scale, 1 to 5, based on complexity of operations described)
- FinalPrice (numeric value without currency symbol)

Output a valid JSON object with those fields.

Respond with JSON only — no comments or explanations, no text outside the object.

Text:
"""
${text}
"""
`;


  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2
  });

  const rawText = completion.choices[0].message.content;

  try {
    const json = JSON.parse(rawText);
    return json;
  } catch (err) {
    console.error('Failed to parse AI response as JSON:', rawText);
    throw new Error('Invalid JSON returned from OpenAI');
  }
}

module.exports = { extractPricingEngineVariables };
