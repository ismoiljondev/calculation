/**
 * Extracts birthdate from Uzbekistan PINFL.
 * @param pinfl - 14-digit Uzbekistan PINFL
 * @returns Birthdate in YYYY-MM-DD format or null if invalid
 */
export function extractBirthDateFromPinfl(pinfl: string): string | null {
  if (!/^\d{14}$/.test(pinfl)) return null;

  const centuryCode = parseInt(pinfl[0], 10);
  const day = parseInt(pinfl.slice(1, 3), 10);
  const month = parseInt(pinfl.slice(3, 5), 10);
  const yearShort = parseInt(pinfl.slice(5, 7), 10);

  let fullYear;
  if (centuryCode === 3 || centuryCode === 4) {
    fullYear = 1900 + yearShort;
  } else if (centuryCode === 5 || centuryCode === 6) {
    fullYear = 2000 + yearShort;
  } else {
    return null;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const dayStr = String(day).padStart(2, "0");
  const monthStr = String(month).padStart(2, "0");
  return `${fullYear}-${monthStr}-${dayStr}`;
}
