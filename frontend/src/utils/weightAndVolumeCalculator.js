const orders = [
  { weight: 100, width: 1.5, height: 2, length: 3 },
  { weight: 75, width: 1, height: 1.5, length: 2 },
  { weight: 50, width: 0.8, height: 1, length: 1.2 }
];

// Function to calculate total weight of orders
export const calculateTotalWeight = (orders) => {
  let totalWeight = 0;
  orders.forEach(order => {
    totalWeight += order.weight;
  });
  return totalWeight;
};

// Function to calculate total volume of orders
export const calculateTotalVolume = (orders) => {
  let totalVolume = 0;
  orders.forEach(order => {
    const volume = order.width * order.height * order.length;
    totalVolume += volume;
  });
  return totalVolume;
};

// Calculate and log total weight and volume
const totalWeight = calculateTotalWeight(orders);
const totalVolume = calculateTotalVolume(orders);

console.log(`Total Weight: ${totalWeight} kg`);
console.log(`Total Volume: ${totalVolume} cubic meters`);