import mongoose from 'mongoose';
import addressSchema from './addressModel.js';

const carrierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  contactInfo: {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  address: addressSchema,
  servicesOffered: {
    type: [String],
    required: true,
  },
  insuranceCoverage: {
    type: String,
  },
  fleetInfo: {
    numberOfVehicles: Number,
    vehicleTypes: [String],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true, 
});

const Carrier = mongoose.model('Carrier', carrierSchema);

export default Carrier;