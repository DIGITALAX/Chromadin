import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const getPrintUri = () => {
  if (typeof window === "undefined") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return `${baseUrl}/api/graphql/print`;
  }
  return "/api/graphql/print";
};

const printLink = new HttpLink({
  uri: getPrintUri(),
});

export const graphClient = new ApolloClient({
  link: printLink,
  cache: new InMemoryCache(),
});

const getKinoraUri = () => {
  if (typeof window === "undefined") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return `${baseUrl}/api/graphql/kinora`;
  }
  return "/api/graphql/kinora";
};

const httpLinkQuest = new HttpLink({
  uri: getKinoraUri(),
});

export const graphKinoraClient = new ApolloClient({
  link: httpLinkQuest,
  cache: new InMemoryCache(),
});


const printServerLink = new HttpLink({
  uri: process.env.GRAPH_NODE_URL_PRINT,
});

export const graphPrintServer = new ApolloClient({
  link: printServerLink,
  cache: new InMemoryCache(),
});

const kinoraServerLink = new HttpLink({
  uri: process.env.GRAPH_NODE_URL_KINORA,
});

export const graphKinoraServer = new ApolloClient({
  link: kinoraServerLink,
  cache: new InMemoryCache(),
});
