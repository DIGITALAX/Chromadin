import { FetchResult } from "@apollo/client";
import { apolloClient } from "../../../lib/lens/client";
import {
  ValidatePublicationMetadataDocument,
  ValidatePublicationMetadataQuery,
  ValidatePublicationMetadataRequest,
} from "@/components/Home/types/generated";

const validateMetadata = async (
  request: ValidatePublicationMetadataRequest
): Promise<FetchResult<ValidatePublicationMetadataQuery>> => {
  return await apolloClient.query({
    query: ValidatePublicationMetadataDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default validateMetadata;
