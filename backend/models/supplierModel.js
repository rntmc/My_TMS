import mongoose from 'mongoose';
import addressSchema from './addressModel.js';

const openingHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  open: {
    type: String, // Using string to represent time in HH:mm format
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(v); // Validates HH:mm format
      },
      message: props => `${props.value} is not a valid time!`
    }
  },
  close: {
    type: String, // Using string to represent time in HH:mm format
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(v); // Validates HH:mm format
      },
      message: props => `${props.value} is not a valid time!`
    }
  },
},{ _id: false });

const supplierSchema = new mongoose.Schema({
  supplierNumber: {
    type: Number,
    required: true, 
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: addressSchema,
  contactPerson: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  openingHours: [openingHoursSchema],
}, {
  timestamps: true,
});

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;