import { gql } from "@apollo/client";
import { graphClientCoinOp } from "@/lib/subgraph/client";

const COLLECTIONS_NAME = `
query($name: String) {
  collectionCreateds(where: {name: $name}) {
    printType
    name
    price
    discount
    collectionId
    amount
    soldTokens
    blockTimestamp
    uri
    fulfillerAddress
  }
}
`;

export const getCollectionNamesCoinOp = async (name: string): Promise<any> => {
  const queryPromise = graphClientCoinOp.query({
    query: gql(COLLECTIONS_NAME),
    variables: {
      name,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
