import {
  HidePublicationDocument,
  HidePublicationMutation,
  HidePublicationRequest,
} from "@/components/Home/types/generated";
import { apolloClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

const hidePublication = async (
  request: HidePublicationRequest
): Promise<FetchResult<HidePublicationMutation>> => {
  return await apolloClient.mutate({
    mutation: HidePublicationDocument,
    variables: {
      request,
    },
  });
};

export default hidePublication;
