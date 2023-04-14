import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import createProxyMiddleware from "http-proxy-middleware";

const httpLink = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/digitalax/chromadin",
});

const authLink = new ApolloLink((operation, forward) => {
  const apiKey = process.env.GRAPH_API_KEY;

  operation.setContext({
    headers: {
      authorization: `Bearer ${apiKey}`,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  });

  return forward(operation);
});

export const graphClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
