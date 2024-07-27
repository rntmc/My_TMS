// models/loadSequenceModel.js
import mongoose from 'mongoose';

const loadSequenceSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  currentValue: {
    type: Number,
    required: true,
  },
});

const LoadSequence = mongoose.model('LoadSequence', loadSequenceSchema);

export default LoadSequence;
