import {
  ChallengeDocument,
  ChallengeQuery,
  ChallengeRequest,
} from "@/components/Home/types/generated";
import { authClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

export const generateChallenge = async (
  request: ChallengeRequest
): Promise<FetchResult<ChallengeQuery>> => {
  return await authClient .query({
    query: ChallengeDocument,
    variables: {
      request,
    },
    fetchPolicy: "no-cache",
  });
};
export default generateChallenge;
