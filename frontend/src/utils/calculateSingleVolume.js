const calculateSingleVolume = (packageQty, length, width, height) => {
  if (length && width && height) {
    return (parseFloat(packageQty) * (parseFloat(length) / 100) * (parseFloat(width) / 100) * (parseFloat(height) / 100)).toFixed(2);
  }
  return '';
};

export default calculateSingleVolume;
