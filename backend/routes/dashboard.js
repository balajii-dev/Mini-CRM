const router = require('express').Router();
const Customer = require('../models/Customer');
const Company = require('../models/Company');
const Task = require('../models/Task');


router.get('/stats', async (req, res) => {
  try {
    const totalLeads = await Customer.countDocuments({ isDeleted: false });
    const qualifiedLeads = await Customer.countDocuments({ status: 'Qualified', isDeleted: false });
    const totalCompanies = await Company.countDocuments();
    const totalTasks = await Task.countDocuments();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);


    const tasksDueToday = await Task.countDocuments({
      status: 'Pending',
      dueDate: { $gte: startOfDay, $lte: endOfDay }
    });

   
    const completedTasks = await Task.countDocuments({ status: 'Done' });

    res.status(200).json({
      totalLeads,
      qualifiedLeads,
      totalCompanies,
      totalTasks,
      tasksDueToday,
      completedTasks
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;