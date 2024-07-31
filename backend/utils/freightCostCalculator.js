import calculateDistance from './calculateDistance';

const costPerKmTable = {
  'standard': 2.0,  // $2 per km for standard delivery
  'express': 3.0,   // $3 per km for express delivery
  'overnight': 5.0  // $5 per km for overnight delivery
};

export const calculateFreightCost = async (origin, destination, deliveryType) => {
  const distance = await calculateDistance(origin, destination);
  const costPerKm = costPerKmTable[deliveryType];
  const totalFreightCost = distance * costPerKm;

  return totalFreightCost;
};

const origin = 'Los Angeles, CA';
const destination = 'San Francisco, CA';
const deliveryType = 'standard';

calculateFreightCost(origin, destination, deliveryType)
  .then(cost => {
    console.log(`The total freight cost is $${cost.toFixed(2)}`);
  })
  .catch(error => {
    console.error('Error calculating freight cost:', error);
  });