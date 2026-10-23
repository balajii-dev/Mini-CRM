const router = require('express').Router();
const Company = require('../models/Company');
const Customer = require('../models/Customer');


router.post('/', async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    const savedCompany = await newCompany.save();
    res.status(201).json({ message: 'Company created successfully!', savedCompany });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found!' });
    }
    
    const leads = await Customer.find({ company: company._id, isDeleted: false });
    res.status(200).json({ company, leads });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const companyId = req.params.id;
    
    
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found!' });
    }
    await Customer.updateMany({ company: companyId }, { $set: { company: null } });

    
    await Company.findByIdAndDelete(companyId);

    res.status(200).json({ message: 'Company deleted successfully and associated leads unlinked!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;