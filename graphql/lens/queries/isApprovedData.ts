import { FetchResult } from "@apollo/client";
import { apolloClient } from "../../../lib/lens/client";
import {
  ApprovedModuleAllowanceAmountRequest,
  ApprovedModuleAllowanceAmountQuery,
  ApprovedModuleAllowanceAmountDocument,
} from "@/components/Home/types/generated";

const isApprovedData = async (
  request: ApprovedModuleAllowanceAmountRequest
): Promise<FetchResult<ApprovedModuleAllowanceAmountQuery>> => {
  return await apolloClient.query({
    query: ApprovedModuleAllowanceAmountDocument,
    variables: {
      request,
    },
  });
};

export default isApprovedData;
