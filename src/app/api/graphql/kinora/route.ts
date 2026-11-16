import { NextRequest, NextResponse } from "next/server";
import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import guardRequest from "@/app/lib/helpers/guardRequest";
import validateGraphQuery from "@/app/lib/helpers/validateGraphQuery";
import { RATE_LIMIT_GRAPHQL } from "@/app/lib/constants";

const serverKinoraClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.GRAPH_NODE_URL_KINORA,
  }),
  cache: new InMemoryCache(),
});

export async function POST(request: NextRequest) {
  try {
    const blocked = guardRequest(request, "graphql-kinora", RATE_LIMIT_GRAPHQL);
    if (blocked) return blocked;

    const { query, variables } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const invalid = validateGraphQuery(query);
    if (invalid) {
      return NextResponse.json({ error: invalid }, { status: 400 });
    }

    const result = await serverKinoraClient.query({
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
