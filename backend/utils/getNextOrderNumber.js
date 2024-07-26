import Sequence from '../models/sequenceModel.js'; // Adjust the path as necessary

const getNextOrderNumber = async () => {
  try {
    // Find and update the sequence document atomically
    const result = await Sequence.findOneAndUpdate(
      { _id: 'orderNumber' },
      { $inc: { currentValue: 1 } },
      { new: true, upsert: true }
    );

    return result.currentValue; // Return the updated value
  } catch (error) {
    console.error('Error updating sequence:', error);
    throw new Error('Failed to get the next order number');
  }
};

export default getNextOrderNumber;
