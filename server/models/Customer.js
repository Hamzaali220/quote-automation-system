const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    contactPerson: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);
