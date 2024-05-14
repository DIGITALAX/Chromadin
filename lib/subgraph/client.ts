import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_KEY}/subgraphs/id/DcuUkg3QC5zg1t86VeNjWzg6R6ohaGa8QGyVE1rFYMZB`,
});

export const graphClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const httpLinkDash = new HttpLink({
  uri: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_KEY}/subgraphs/id/35m4wqYghJfsWXAULZJGmQYDYsKL1y2xV1niL5S42Ggh`,
});

export const graphClientDash = new ApolloClient({
  link: httpLinkDash,
  cache: new InMemoryCache(),
});

const httpLinkQuest = new HttpLink({
  uri: `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_KEY}/subgraphs/id/DKi4s9USksFKEobZaofL3QAST4SQGhuEtsBJcBY4Dn8`,
});

export const graphKinoraClient = new ApolloClient({
  link: httpLinkQuest,
  cache: new InMemoryCache(),
});
