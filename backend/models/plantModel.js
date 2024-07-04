import mongoose from 'mongoose';
import addressSchema from './addressModel.js';

const plantSchema = new mongoose.Schema({
  plantNumber: {
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
}, {
  timestamps: true,
});

const Plant = mongoose.model('Plant', plantSchema);

export default Plant;