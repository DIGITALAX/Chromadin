import {
  AddReactionDocument,
  AddReactionMutation,
  ReactionRequest,
} from "@/components/Home/types/generated";
import { apolloClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

const addReaction = async (
  request: ReactionRequest
): Promise<FetchResult<AddReactionMutation>> => {
  return await apolloClient.mutate({
    mutation: AddReactionDocument,
    variables: {
      request,
    },
    fetchPolicy: "no-cache",
  });
};

export default addReaction;
