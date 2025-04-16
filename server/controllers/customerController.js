const Customer = require('../models/Customer');

// @desc   Create a new customer
exports.createCustomer = async (req, res) => {
    try {
        const { companyName, contactPerson, email } = req.body;

        const customer = new Customer({
            companyName,
            contactPerson,
            email
        });

        await customer.save();
        res.status(201).json(customer);
    } catch (err) {
        res.status(500).json({ error: 'Server error while creating customer' });
    }
};

// @desc   Get all customers
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().sort({ companyName: 1 });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: 'Server error while fetching customers' });
    }
};
