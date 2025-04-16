const fs = require('fs');
const path = require('path');
const { extractTextFromFile } = require('../utils/extractFileText');
const { extractPricingEngineVariables } = require('./specExtractorForTraining');
const { parse } = require('json2csv');

const adminUploadDir = path.join(__dirname, '..', '..', 'admin_uploads');
const trainingCsvPath = path.join(__dirname, '..', '..', 'ai', 'data', 'quotes.csv');

async function generateTrainingCSV() {
  const files = fs.readdirSync(adminUploadDir).filter(f => f.endsWith('.pdf'));
  if (!files.length) return;

  let allRows = [];

  for (const file of files) {
    const filePath = path.join(adminUploadDir, file);
    const rawText = await extractTextFromFile(filePath);
    if (!rawText) {
      console.warn(`Skipped empty PDF: ${file}`);
      continue;
    }

    try {
      const structured = await extractPricingEngineVariables(rawText);
      console.log(' Extracted training row from', file, structured);
      allRows.push(structured);
    } catch (err) {
      console.error(`Failed extracting from ${file}:`, err.message);
    }
  }

  if (!allRows.length) {
    console.warn('No valid training data extracted.');
    return;
  }

  // Always overwrite the CSV with new extracted rows
  const csvWithHeader = parse(allRows, { header: true });
  fs.writeFileSync(trainingCsvPath, csvWithHeader + '\n');
  console.log(`New training CSV created with ${allRows.length} rows`);
}

module.exports = { generateTrainingCSV };
