import { FetchResult } from "@apollo/client";
import { apolloClient } from "../../../lib/lens/client";
import {
  LensTransactionFailureType,
  LensTransactionStatusDocument,
  LensTransactionStatusQuery,
  LensTransactionStatusRequest,
  LensTransactionStatusType,
} from "@/components/Home/types/generated";

const getIndexed = async (
  request: LensTransactionStatusRequest
): Promise<FetchResult<LensTransactionStatusQuery>> => {
  return await apolloClient.query({
    query: LensTransactionStatusDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};

const pollUntilIndexed = async (
  request: LensTransactionStatusRequest
): Promise<boolean> => {
  let count = 0;
  while (count < 5) {
    try {
      const datos = await getIndexed(request);
      if (datos?.data && datos?.data.lensTransactionStatus) {
        switch (datos?.data.lensTransactionStatus.status) {
          case LensTransactionStatusType.Failed:
            return false;
          case LensTransactionStatusType.Complete:
            return true;
          case LensTransactionStatusType.Processing:
          case LensTransactionStatusType.OptimisticallyUpdated:
            count += 1;
            await new Promise((resolve) => setTimeout(resolve, 6000));
            break;
          default:
            throw new Error("Unexpected status");
        }
      }
    } catch (err: any) {
      count += 1;
      console.error(err.message);
    }
  }
  return false;
};

export default pollUntilIndexed;
