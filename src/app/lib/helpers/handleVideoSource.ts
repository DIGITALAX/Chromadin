import { INFURA_GATEWAY_INTERNAL, GROVE_GATEWAY } from "../constants";

export const handleVideoSource = (
  uri: string | undefined
): string | undefined => {
  const cleaned = uri?.replace(/"/g, "")?.trim();

  if (!cleaned) {
    return undefined;
  } else if (cleaned.includes("https://")) {
    return cleaned;
  } else if (cleaned.includes("ipfs://")) {
    return `${INFURA_GATEWAY_INTERNAL}${cleaned.split("ipfs://")?.[1]}`;
  } else if (cleaned.includes("lens://")) {
    return `${GROVE_GATEWAY}${cleaned.split("lens://")?.[1]}`;
  } else if (cleaned.includes("ar://")) {
    return `https://arweave.net/${cleaned.split("ar://")?.[1]}`;
  }

  return cleaned;
};
