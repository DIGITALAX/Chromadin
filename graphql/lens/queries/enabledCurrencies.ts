import { apolloClient } from "@/lib/lens/client";
import { gql } from "@apollo/client";

const ENABLED_MODULE_CURRENCIES = `
query EnabledModuleCurrencies {
    enabledModuleCurrencies {
      name
      symbol
      decimals
      address
    }
  }
`;

const getEnabledCurrencies = () => {
  return apolloClient.query({
    query: gql(ENABLED_MODULE_CURRENCIES),
    fetchPolicy: "no-cache",
  });
};

export default getEnabledCurrencies;
