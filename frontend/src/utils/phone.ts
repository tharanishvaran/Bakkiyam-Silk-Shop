/**
 * Utility functions for Indian phone number normalization and formatting.
 * Primary showroom number: +91 91598 08720 (V. Kannan / Bakkiyam Pattu Center)
 */

export const PRIMARY_PHONE = '9159808720';
export const PRIMARY_PHONE_DISPLAY = '+91 91598 08720';
export const PRIMARY_PHONE_TEL = 'tel:+919159808720';
export const PRIMARY_WA_NUMBER = '919159808720';

/**
 * Extracts the 10-digit national number from an Indian phone number string.
 */
export function getNationalPhoneNumber(phone?: string): string {
  if (!phone) return PRIMARY_PHONE;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  if (digits.length === 10) {
    return digits;
  }
  return digits || PRIMARY_PHONE;
}

/**
 * Generates an E.164 formatted tel: link for dialers (e.g. "tel:+919159808720").
 * This ensures mobile dialers never get confused by missing country codes,
 * misplaced plus signs, or incomplete digits.
 */
export function formatTelLink(phone?: string): string {
  const national = getNationalPhoneNumber(phone);
  if (!national) return PRIMARY_PHONE_TEL;
  if (national.length === 10) {
    return `tel:+91${national}`;
  }
  return `tel:+${national}`;
}

/**
 * Formats a phone number for clean human-readable UI display (e.g. "+91 91598 08720").
 */
export function formatPhoneDisplay(phone?: string): string {
  if (!phone) return PRIMARY_PHONE_DISPLAY;
  const national = getNationalPhoneNumber(phone);
  if (national.length === 10) {
    return `+91 ${national.slice(0, 5)} ${national.slice(5)}`;
  }
  const trimmed = phone.trim();
  if (trimmed.startsWith('+91')) {
    return trimmed;
  }
  return `+91 ${trimmed}`;
}

/**
 * Formats WhatsApp number for wa.me links (e.g. "919159808720").
 */
export function formatWhatsAppNumber(phone?: string): string {
  if (!phone) return PRIMARY_WA_NUMBER;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits || PRIMARY_WA_NUMBER;
}
