const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);

const leadRoute = require('./routes/leads');
app.use('/api/leads', leadRoute);

const companyRoute = require('./routes/companies');
app.use('/api/companies', companyRoute);

const taskRoute = require('./routes/tasks');
app.use('/api/tasks', taskRoute);

const dashboardRoute = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoute);

app.get('/', (req, res) => {
  res.send('Mini CRM Backend is working!');
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully! ');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });