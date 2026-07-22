const TRACKING_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomSegment(length: number) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));

  return Array.from(bytes, (byte) => TRACKING_ALPHABET[byte % TRACKING_ALPHABET.length]).join("");
}

function formatTrackingCore(value: string) {
  return `AWB-${value.slice(0, 4)}-${value.slice(4, 8)}-${value.slice(8, 12)}`;
}

export function generateTrackingId() {
  return formatTrackingCore(randomSegment(12));
}

export function normalizeTrackingId(input: string) {
  const cleaned = input
    .trim()
    .toUpperCase()
    .replace(/^AWB[-\s]*/g, "")
    .replace(/[^A-Z0-9]/g, "");

  const normalizedCore = (cleaned + randomSegment(12)).slice(0, 12);

  return formatTrackingCore(normalizedCore);
}
