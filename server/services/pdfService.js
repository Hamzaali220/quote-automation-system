const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const generateQuotePDF = (quoteText, filename) => {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(__dirname, '..', '..', 'pdfs');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const filePath = path.join(outputDir, `${filename}.pdf`);
    const doc = new PDFDocument();

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.font('Times-Roman')
      .fontSize(12)
      .text(quoteText, {
        width: 460,
        align: 'left'
      });

    doc.end();

    stream.on('finish', () => {
      resolve(filePath);
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
};

module.exports = { generateQuotePDF };
