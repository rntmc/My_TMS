import mongoose from 'mongoose';

// Define the schema for the sequence collection
const orderSequenceSchema = new mongoose.Schema({
  _id: { 
    type: String, 
    required: true 
  },
  currentValue: { 
    type: Number, 
    required: true 
  }
});

const OrderSequence = mongoose.model('Sequence', orderSequenceSchema);

export default OrderSequence;
