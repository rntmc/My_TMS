import mongoose from "mongoose";
import addressSchema from './addressModel.js';

const loadSchema = new mongoose.Schema({
  loadId: {
    type: Number,
    unique: true,
    required: true,
  },
  pickupDate: {
    type: Date,
    required: true
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  origin: addressSchema,
  destination: addressSchema,
  carrier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carrier',
    required: true
  },
  transportType: {
    type: String,
    required: true
  },
  orders: [{
    type: Number,
    ref: 'Order',
    required: true
  }],
  totalFreightCost: {
    type: Number,
    required: true
  },
  totalVolume: {
    type: Number,
    required: true
  },
  totalWeight: {
    type: Number,
    required: true
  },
  licensePlate: {
    type: String,
    required: true
  },
  driver: {
    type: String,
  },
  insurance: {
    type: String,
  },
  storageAndTransportConditions: {
    type: String,
  },
  specialNotes: {
    type: String,
  },
  status: {
    type: String,
  },
  trackingInfo: { //status isDelivered?
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Optional, if you want to track which user created or manages the load
    required: true
  }
},{
  timestamps: true,
})

const Load = mongoose.model('Load', loadSchema);

export default Load;