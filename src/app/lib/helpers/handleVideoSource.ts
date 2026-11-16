import { INFURA_GATEWAY_INTERNAL, GROVE_GATEWAY } from "../constants";

const mapScheme = (
  cleaned: string,
  scheme: string,
  gateway: string
): string | undefined => {
  const remainder = cleaned.slice(scheme.length);
  if (!remainder || remainder.includes("..")) {
    return undefined;
  }
  return `${gateway}${remainder}`;
};

export const handleVideoSource = (
  uri: string | undefined
): string | undefined => {
  const cleaned = uri?.replace(/"/g, "")?.trim();

  if (!cleaned) {
    return undefined;
  } else if (cleaned.startsWith("ipfs://")) {
    return mapScheme(cleaned, "ipfs://", INFURA_GATEWAY_INTERNAL);
  } else if (cleaned.startsWith("lens://")) {
    return mapScheme(cleaned, "lens://", GROVE_GATEWAY);
  } else if (cleaned.startsWith("ar://")) {
    return mapScheme(cleaned, "ar://", "https://arweave.net/");
  } else if (
    /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[a-z2-7]{58,})(\/[^\s]*)?$/.test(cleaned)
  ) {
    return cleaned.includes("..") ? undefined : cleaned;
  }

  try {
    return new URL(cleaned).protocol === "https:" ? cleaned : undefined;
  } catch (err: any) {
    return undefined;
  }
};
