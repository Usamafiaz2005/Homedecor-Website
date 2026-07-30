export const calculatePKShipping = (city: string, cartTotal: number): number => {
  // Luxury brands often offer free shipping above a threshold
  if (cartTotal > 100000) return 0; 

  const normalizedCity = city.trim().toLowerCase();
  
  if (normalizedCity === 'lahore') return 500; // Local showroom delivery
  
  const majorCities = ['karachi', 'islamabad', 'rawalpindi', 'faisalabad', 'multan'];
  if (majorCities.includes(normalizedCity)) return 1500;

  return 2500; // Rest of Pakistan (Heavy furniture logistics)
};