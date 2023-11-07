import {
  ActOnOpenActionRequest,
  CreateActOnOpenActionTypedDataDocument,
  CreateActOnOpenActionTypedDataMutation,
} from "@/components/Home/types/generated";
import { apolloClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

const collect = async (
  request: ActOnOpenActionRequest
): Promise<FetchResult<CreateActOnOpenActionTypedDataMutation>> => {
  return await apolloClient.mutate({
    mutation: CreateActOnOpenActionTypedDataDocument,
    variables: {
      request,
    },
  });
};

export default collect;
