import crypto from 'crypto';

export const generateJazzCashHash = (payload: any, integritySalt: string) => {
  // JazzCash requires keys to be sorted alphabetically
  const sortedKeys = Object.keys(payload).sort();
  let hashString = integritySalt;

  sortedKeys.forEach(key => {
    if (payload[key]) {
      hashString += `&${payload[key]}`;
    }
  });

  return crypto.createHmac('sha256', integritySalt).update(hashString).digest('hex').toUpperCase();
};