import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

const httpLink = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/digitalax/chromadin",
});

const authLink = new ApolloLink((operation, forward) => {
  const apiKey = process.env.GRAPH_API_KEY;

  operation.setContext({
    headers: {
      authorization: `Bearer ${apiKey}`,
    },
  });

  return forward(operation);
});

export const graphClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
