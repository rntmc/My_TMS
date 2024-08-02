import mongoose from "mongoose";
import addressSchema from './addressModel.js';

const documentSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  name: {
    type: String,
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
  carrier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carrier',
  },
  transportType: {
    type: String,
    required: true
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
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
  trackingInfo: [{
    action: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  document: [documentSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Optional, if you want to track which user created or manages the load
  }
},{
  timestamps: true,
})

const Load = mongoose.model('Load', loadSchema);

export default Load;