import mongoose from "mongoose";
import addressSchema from './addressModel.js';

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
  productId: {
    type: String,
    required: true
  },
  productQuantity: {
    type: Number,
    required: true
  },
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
  },
  freightCost: {
    type: Number,
    required: true
  },
  dangerousGoods: {
    type: Boolean,
    default: false
  },
  document: {
    type: String, 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
  },
}, {
  timestamps: true 
});

const Order = mongoose.model("Order", orderSchema);

export default Order;