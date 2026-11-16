import { INFURA_GATEWAY_INTERNAL, GROVE_GATEWAY } from "../constants";

const isHttpsUrl = (value: string): boolean => {
  try {
    return new URL(value).protocol === "https:";
  } catch (err: any) {
    return false;
  }
};

export const handleImage = (pic: string): string => {
  const cleaned = typeof pic === "string" ? pic.trim() : "";
  const fallback = `${INFURA_GATEWAY_INTERNAL}QmeupDitCvCXPsq5KSDSdhLrRjcXvNhaqpyuUcGyeW918W`;

  if (isHttpsUrl(cleaned)) {
    return cleaned;
  } else if (cleaned.includes("ipfs://")) {
    const remainder = cleaned.split("ipfs://")?.[1];
    return remainder && !remainder.includes("..")
      ? `${INFURA_GATEWAY_INTERNAL}${remainder}`
      : fallback;
  } else if (cleaned.includes("lens://")) {
    const remainder = cleaned.split("lens://")?.[1];
    return remainder && !remainder.includes("..")
      ? `${GROVE_GATEWAY}${remainder}`
      : fallback;
  }

  return fallback;
};
