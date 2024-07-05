// Function to calculate total weight of orders
export const calculateTotalWeight = (orders) => {
  let totalWeight = 0;
  orders.forEach(order => {
    totalWeight += order.weight;
  });
  return totalWeight;
};

// Function to calculate total volume of orders
export const calculateTotalVolume = (packages) => {
  let totalVolume = 0;
  packages.forEach(pkg => {
    const volume = pkg.width * pkg.height * pkg.length;
    totalVolume += volume;
  });
  return totalVolume;
};

// Calculate total weight and volume
calculateTotalWeight(orders);
calculateTotalVolume(orders);