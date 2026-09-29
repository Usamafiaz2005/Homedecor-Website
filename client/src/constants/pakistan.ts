export interface ProvinceOption {
  id: string;
  name: string;
}

export const PAKISTAN_PROVINCES: ProvinceOption[] = [
  { id: 'punjab', name: 'Punjab' },
  { id: 'sindh', name: 'Sindh' },
  { id: 'kpk', name: 'Khyber Pakhtunkhwa' },
  { id: 'balochistan', name: 'Balochistan' },
  { id: 'islamabad', name: 'Islamabad Capital Territory' },
  { id: 'ajk', name: 'Azad Jammu & Kashmir' },
  { id: 'gb', name: 'Gilgit-Baltistan' },
];

export const MAJOR_PAKISTAN_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Chiniot',
  'Hala',
];

export const SHIPPING_POLICY = {
  FREE_SHIPPING_THRESHOLD_PKR: 100000,
  LOCAL_LAHORE_RATE_PKR: 500,
  MAJOR_CITIES_RATE_PKR: 1500,
  REST_OF_PK_RATE_PKR: 2500,
};

export const calculateShippingFee = (city: string, subtotal: number): number => {
  if (subtotal >= SHIPPING_POLICY.FREE_SHIPPING_THRESHOLD_PKR) {
    return 0;
  }
  const normalized = (city || '').trim().toLowerCase();
  if (normalized === 'lahore') {
    return SHIPPING_POLICY.LOCAL_LAHORE_RATE_PKR;
  }
  const majorList = ['karachi', 'islamabad', 'rawalpindi', 'faisalabad', 'multan'];
  if (majorList.includes(normalized)) {
    return SHIPPING_POLICY.MAJOR_CITIES_RATE_PKR;
  }
  return SHIPPING_POLICY.REST_OF_PK_RATE_PKR;
};
