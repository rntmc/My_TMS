import mongoose from "mongoose";
import addressSchema from './addressModel.js';

const packageSchema = new mongoose.Schema({
  packageQty: {
    type: Number,
    required: true
  },
  length: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  volume: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  }
});

const loadSchema = new mongoose.Schema({
  loadNumber: {
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
  origin: {
    entityNumber: {
      type: Number,
      required: true
    },
    entityName: {
      type: String,
      required: true
    },
    entityLocation: addressSchema
  },
  destination: {
    entityNumber: {
      type: Number,
      required: true
    },
    entityName: {
      type: String,
      required: true
    },
    entityLocation: addressSchema
  },
  carrierNumber: {
    type: Number,
  },
  carrierName: {
    type: String,
    required: true
  },
  transportType: {
    type: String,
    required: true
  },
  orders: [{
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    orderNumber: [{ 
      type: Number,
      required: true,
    }],
    packages: [packageSchema],
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
  document: {
    type: String, 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Optional, if you want to track which user created or manages the load
  }
},{
  timestamps: true,
})

const Load = mongoose.model('Load', loadSchema);

export default Load;