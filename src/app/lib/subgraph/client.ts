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

const getWeb3Uri = () => {
  if (typeof window === "undefined") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return `${baseUrl}/api/graphql/web3`;
  }
  return "/api/graphql/web3";
};

const getTripleAUri = () => {
  if (typeof window === "undefined") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return `${baseUrl}/api/graphql/triplea`;
  }
  return "/api/graphql/triplea";
};

const getFGOUri = () => {
  if (typeof window === "undefined") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return `${baseUrl}/api/graphql/fgo`;
  }
  return "/api/graphql/fgo";
};

const httpLinkQuest = new HttpLink({
  uri: getKinoraUri(),
});

export const graphKinoraClient = new ApolloClient({
  link: httpLinkQuest,
  cache: new InMemoryCache(),
});

const httpLinkWeb3 = new HttpLink({
  uri: getWeb3Uri(),
});

export const graphWeb3Client = new ApolloClient({
  link: httpLinkWeb3,
  cache: new InMemoryCache(),
});

const httpLinkTripleA = new HttpLink({
  uri: getTripleAUri(),
});

export const graphTripleAClient = new ApolloClient({
  link: httpLinkTripleA,
  cache: new InMemoryCache(),
});

const httpLinkFGO = new HttpLink({
  uri: getFGOUri(),
});

export const graphFGOClient = new ApolloClient({
  link: httpLinkFGO,
  cache: new InMemoryCache(),
});

const getGDNUri = () => {
  if (typeof window === "undefined") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return `${baseUrl}/api/graphql/gdn`;
  }
  return "/api/graphql/gdn";
};

const gdnLink = new HttpLink({
  uri: getGDNUri(),
});

export const graphGDNClient = new ApolloClient({
  link: gdnLink,
  cache: new InMemoryCache(),
});

const getCatalogUri = () => {
  if (typeof window === "undefined") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    return `${baseUrl}/api/graphql/catalog`;
  }
  return "/api/graphql/catalog";
};

const catalogLink = new HttpLink({
  uri: getCatalogUri(),
});

export const graphCatalogClient = new ApolloClient({
  link: catalogLink,
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

const web3ServerLink = new HttpLink({
  uri: process.env.GRAPH_NODE_URL_WEB3,
});

export const graphWeb3Server = new ApolloClient({
  link: web3ServerLink,
  cache: new InMemoryCache(),
});

const tripleAServerLink = new HttpLink({
  uri: process.env.GRAPH_NODE_URL_TRIPLEA,
});

export const graphTripleAServer = new ApolloClient({
  link: tripleAServerLink,
  cache: new InMemoryCache(),
});

const fgoServerLink = new HttpLink({
  uri: process.env.GRAPH_NODE_URL_FGO,
});

export const graphFGOServer = new ApolloClient({
  link: fgoServerLink,
  cache: new InMemoryCache(),
});

const gdnServerLink = new HttpLink({
  uri: process.env.GRAPH_NODE_URL_GDN,
});

export const graphGDNServer = new ApolloClient({
  link: gdnServerLink,
  cache: new InMemoryCache(),
});


const catalogServerLink = new HttpLink({
  uri: process.env.GRAPH_NODE_URL_CATALOG,
});

export const graphCatalogServer = new ApolloClient({
  link: catalogServerLink,
  cache: new InMemoryCache(),
});
