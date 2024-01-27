import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/digitalax/print-library",
});

export const graphClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const httpLinkDash = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/digitalax/chromadin_dash",
});

export const graphClientDash = new ApolloClient({
  link: httpLinkDash,
  cache: new InMemoryCache(),
});
