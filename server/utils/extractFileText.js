const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js'); 

async function extractTextFromFile(filePath) {
  if (!filePath) return '';

  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.txt') {
    return fs.readFileSync(filePath, 'utf-8');
  }

  if (ext === '.pdf') {
    try {
      const data = new Uint8Array(fs.readFileSync(filePath));
      const loadingTask = pdfjsLib.getDocument({
        data: data,
        standardFontDataUrl: path.join(__dirname, '..', 'node_modules/pdfjs-dist/standard_fonts/')
      });
      const pdfDoc = await loadingTask.promise;

      let fullText = '';
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map(item => item.str).join(' ');
        fullText += text + '\n';
      }

      return fullText;
    } catch (err) {
      console.error('pdfjs-dist error:', err.message);
      return '';
    }
  }

  return '';
}

module.exports = { extractTextFromFile };
