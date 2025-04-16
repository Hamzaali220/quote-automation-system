const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function extractPredictionInputFromText(specText) {
  const prompt = `
You are an assistant designed to extract structured product information from technical specifications.

Your task is to identify and return the following fields (if available) from the text below:

- ProfileType (e.g., Flat, T, I, Round — or any reasonable type described)
- Alloy (e.g., 6060, 6061, 6063 — or any alloy mentioned)
- Weight_per_meter (numeric value in kg per meter)
- Total_length (numeric value in mm or meters)
- SurfaceTreatment (e.g., Anodized, MillFinish — or any described surface finish)
- MachiningComplexity (numeric scale from 1 to 5, estimated from the level of machining required)

Focus on content in the text that directly or clearly suggests these values.
also if the field is not available in the text, return it as null or related according to datatype.
Output only valid and clean JSON in the following format:
{
  "ProfileType": "",
  "Alloy": "",
  "Weight_per_meter": 0,
  "Total_length": 0,
  "SurfaceTreatment": "",
  "MachiningComplexity": 0
}
Respond only with valid JSON, no comments or explanations.
Text:
"""
${specText}
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

module.exports = { extractPredictionInputFromText };
