import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const printLink = new HttpLink({
  uri: `https://gateway.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_KEY}/subgraphs/id/5BRsShsfv6tEucvDwGtrstRhg1fpvx2pMRWh5GDovE9K`,
});

export const graphClient = new ApolloClient({
  link: printLink,
  cache: new InMemoryCache(),
});

const httpLinkQuest = new HttpLink({
  uri: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_KEY}/subgraphs/id/Ajf3LcbRNx92R25fVFaUMVxQTUafksyQXLVdLXAoaYqD`,
});

export const graphKinoraClient = new ApolloClient({
  link: httpLinkQuest,
  cache: new InMemoryCache(),
});
