const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const customerRoutes = require('./routes/customerRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const adminRoutes = require('./routes/adminRoutes');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/pdfs', express.static(path.join(__dirname, '..', 'pdfs')));
app.use('/admin_uploads', express.static(path.join(__dirname, '..', 'admin_uploads')));
app.use('/client', express.static(path.join(__dirname, '..', 'client')));
// Session middleware (only for /api/admin)
app.use('/api/admin', session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1 * 60 * 60 * 1000 // 1 hour
  }
}));
// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/admin', adminRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
}).catch((err) => {
    console.error("Mongo connection error", err);
});

// Frontend pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});
app.get('/preview.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'preview.html'));
});

app.get('/admin', (req, res) => {
  res.redirect('/client/admin/login.html');
});
app.get('/admin/dashboard.html', (req, res) => {
    res.redirect('/client/admin/dashboard.html');
});

