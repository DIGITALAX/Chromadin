import {
  EnabledCurrenciesDocument,
  EnabledCurrenciesQuery,
} from "@/components/Home/types/generated";
import { apolloClient } from "@/lib/lens/client";
import { FetchResult } from "@apollo/client";

const getEnabledCurrencies = async (): Promise<
  FetchResult<EnabledCurrenciesQuery>
> => {
  return await apolloClient.query({
    query: EnabledCurrenciesDocument,
    fetchPolicy: "no-cache",
  });
};

export default getEnabledCurrencies;
