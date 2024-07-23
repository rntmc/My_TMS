import mongoose from "mongoose";
import addressSchema from './addressModel.js';

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  productQuantity: {
    type: Number,
    required: true
  }
});

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

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: Number,
    unique: true,
    required: true,
  },
  status: {
    type: String,
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
  products: [productSchema],
  packages: [packageSchema],
  freightCost: {
    type: Number,
    required: true
  },
  dangerousGoods: {
    type: Boolean,
    default: false
  },
  document: [documentSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
  },
}, {
  timestamps: true 
});

const Order = mongoose.model("Order", orderSchema);

export default Order;