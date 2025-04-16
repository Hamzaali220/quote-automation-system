const path = require('path');
const fs = require('fs');
const Admin = require('../models/Admin');
const { trainModel } = require('../services/aiBridge');
const { generateTrainingCSV } = require('../services/pdfTrainingDataService');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.validatePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  req.session.adminId = admin._id;
  res.status(200).json({ message: 'Logged in' });
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
};

exports.uploadPDFs = (req, res) => {
  res.json({ message: 'Files uploaded' });
};

exports.listPDFs = (req, res) => {
  const dir = path.join(__dirname, '..', '..', 'admin_uploads');
  const files = fs.readdirSync(dir);
  res.json(files);
};

exports.deletePDF = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', '..', 'admin_uploads', filename);
  fs.unlinkSync(filePath);
  res.json({ message: 'Deleted' });
};

exports.trainModel = async (req, res) => {
    try {
      await generateTrainingCSV(); 
        console.log('Training CSV generated successfully!');
        const responce = await trainModel(); 
        if (responce) {
          console.log('Model trained successfully!');
          console.log(responce);
          res.status(200).json({ message: 'Training process completed' });
        } else {
          console.error('Model training failed!');
          res.status(500).json({ error: 'Model training failed' });
        }
    } catch (err) {
      console.error('Training error:', err.message);
      res.status(500).json({ error: 'Training process failed' });
    }
  };
