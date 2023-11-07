import {
  EnabledCurrenciesDocument,
  EnabledCurrenciesQuery,
} from "@/components/Home/types/generated";
import { apolloClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";
import { PaginatedOffsetRequest } from "@lens-protocol/client";

const getEnabledCurrencies = async (request: PaginatedOffsetRequest): Promise<
  FetchResult<EnabledCurrenciesQuery>
> => {
  return await apolloClient.query({
    query: EnabledCurrenciesDocument,
    variables: {
      request
    },
    fetchPolicy: "no-cache",
  });
};

export default getEnabledCurrencies;
