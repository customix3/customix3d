/** India-focused shipping address validation */

export type AddressFields = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

export type SavedAddress = AddressFields & {
  id: string;
  label: string;
};

/** Indian PIN: exactly 6 digits, must not start with 0 */
export function isValidIndianPincode(raw: string): boolean {
  const p = (raw || '').replace(/\s/g, '');
  return /^[1-9][0-9]{5}$/.test(p);
}

export function normalizePincode(raw: string): string {
  return (raw || '').replace(/\D/g, '').slice(0, 6);
}

/** City/state: letters, spaces, dots, hyphens — min 2 chars */
export function isValidPlaceName(raw: string): boolean {
  const s = (raw || '').trim();
  if (s.length < 2 || s.length > 60) return false;
  return /^[a-zA-Z.\s'-]+$/.test(s);
}

/** Street address: min 8 chars, must have a letter or number */
export function isValidStreet(raw: string): boolean {
  const s = (raw || '').trim();
  if (s.length < 8 || s.length > 120) return false;
  if (!/[a-zA-Z0-9]/.test(s)) return false;
  // reject only symbols / only spaces
  if (/^[\s.,#-]+$/.test(s)) return false;
  return true;
}

export function validateAddress(a: {
  address: string;
  city: string;
  state?: string;
  pincode: string;
}): string | null {
  if (!isValidStreet(a.address)) {
    return 'Enter a full street address (min 8 characters, house / road / area)';
  }
  if (!isValidPlaceName(a.city)) {
    return 'Enter a valid city name (letters only)';
  }
  if (a.state != null && a.state.trim() && !isValidPlaceName(a.state)) {
    return 'Enter a valid state name';
  }
  if (!isValidIndianPincode(a.pincode)) {
    return 'Enter a valid 6-digit Indian PIN code (cannot start with 0)';
  }
  return null;
}

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];
