import mongoose from 'mongoose';

// Define the schema for the sequence collection
const sequenceSchema = new mongoose.Schema({
  _id: { 
    type: String, 
    required: true 
  },
  currentValue: { 
    type: Number, 
    required: true 
  }
});

const Sequence = mongoose.model('Sequence', sequenceSchema);

export default Sequence;
