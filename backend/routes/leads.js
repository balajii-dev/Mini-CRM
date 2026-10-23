const router = require('express').Router();
const Customer = require('../models/Customer');


router.post('/', async (req, res) => {
  try {
    const newLead = new Customer(req.body);
    const savedLead = await newLead.save();
    res.status(201).json({ message: 'Lead created successfully!', savedLead });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const leads = await Customer.find({ isDeleted: false }).populate('company assignedTo', 'name email');
    res.status(200).json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updatedLead = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ message: 'Lead updated successfully!', updatedLead });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await Customer.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.status(200).json({ message: 'Lead soft-deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;