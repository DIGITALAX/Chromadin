import { NextRequest, NextResponse } from "next/server";
import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";

const serverWeb3Client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.GRAPH_NODE_URL_WEB3,
  }),
  cache: new InMemoryCache(),
});

export async function POST(request: NextRequest) {
  try {
    const { query, variables } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    const result = await serverWeb3Client.query({
      query: gql(query),
      variables: variables || {},
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "GraphQL query failed" },
      { status: 500 }
    );
  }
}