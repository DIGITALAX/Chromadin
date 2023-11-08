import { INFURA_GATEWAY } from "../constants";

const fetchIPFSJSON = async (uri: string): Promise<any> => {
  if (!uri || uri.includes("ipfs://")) return;
  const response = await fetch(`${INFURA_GATEWAY}/ipfs/${uri}`);
  const json = await response.json();
  return json;
};

export default fetchIPFSJSON;
