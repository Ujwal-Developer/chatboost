export const defaultCreatorHandle = "nova";
export const defaultCreatorName = "Nova Plays";

export function normalizeCreatorHandle(input: string) {
  const normalized = input
    .trim()
    .replace(/^@+/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);

  return normalized || defaultCreatorHandle;
}

export function displayNameFromHandle(handle: string) {
  const cleanHandle = normalizeCreatorHandle(handle);

  if (cleanHandle === defaultCreatorHandle) {
    return defaultCreatorName;
  }

  return cleanHandle
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function creatorPaymentPath(handle: string) {
  return `/@${normalizeCreatorHandle(handle)}`;
}
