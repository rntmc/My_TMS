const calculateSingleVolume = (packageQty, length, width, height) => {
  // Verifica se todos os valores necessários estão presentes
  if (!length || !width || !height) return 0;

  // Converte para números e calcula o volume
  const volume = parseFloat(length) * parseFloat(width) * parseFloat(height);

  // Retorna o volume multiplicado pela quantidade do pacote
  return parseFloat(packageQty) * volume / 1000000; // Volume em metros cúbicos
};

export default calculateSingleVolume;
