import {
  RefreshDocument,
  RefreshMutation,
  RefreshRequest,
} from "@/components/Home/types/generated";
import { authClient } from "../../../lib/lens/client";
import { FetchResult } from "@apollo/client";

const refresh = async (
  request: RefreshRequest
): Promise<FetchResult<RefreshMutation>> => {
  return await authClient.mutate({
    mutation: RefreshDocument,
    variables: {
      request,
    },
  });
};

export default refresh;
