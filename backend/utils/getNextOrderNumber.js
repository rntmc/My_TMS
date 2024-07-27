import OrderSequence from '../models/orderSequenceModel.js'; // Adjust the path as necessary

const getNextOrderNumber = async () => {
  try {
    // Find and update the sequence document atomically
    const result = await OrderSequence.findOneAndUpdate(
      { _id: 'orderNumber' },
      { $inc: { currentValue: 1 } },
      { new: true, upsert: true }
    );

    return result.currentValue; // Return the updated value
  } catch (error) {
    console.error('Error updating order sequence:', error);
    throw new Error('Failed to get the next order number');
  }
};

export default getNextOrderNumber;
