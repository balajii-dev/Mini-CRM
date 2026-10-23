const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    default: null
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Lost', 'Won'],
    default: 'New'
  },
  assignedTo: {
    type: String,
    default: ''
  },
  isDeleted: {
    type: Boolean,
    default: false
  } 
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);