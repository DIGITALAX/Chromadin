import { CHROMADIN_OPEN_ACTION } from "../constants";

const openActionCheck = (contract: string | undefined): boolean => {
  if (!contract) return false;

  return contract?.toLowerCase() == CHROMADIN_OPEN_ACTION?.toLowerCase()
    ? true
    : false;
};

export default openActionCheck;
