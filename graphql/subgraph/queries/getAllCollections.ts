import { gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const COLLECTIONS = `
  query {
    collectionMinteds {
      basePrices
      uri
      collectionId
      amount
      acceptedTokens
      name
      owner
      blockTimestamp
      tokenIds
      soldTokens
      blockNumber
    }
  }
`;

const COLLECTIONS_PAGINATION = `
query($first: Int, $skip: Int) {
  collectionMinteds(first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
    basePrices
    uri
    collectionId
    amount
    acceptedTokens
    name
    owner
    blockTimestamp
    tokenIds
    soldTokens
    blockNumber
  }
}`;

const COLLECTIONS_OWNER = `
query($owner: String) {
  collectionMinteds(where: {owner: $owner}, orderDirection: desc, orderBy: blockTimestamp) {
    basePrices
    uri
    collectionId
    amount
    acceptedTokens
    name
    owner
    blockTimestamp
    tokenIds
    soldTokens
    blockNumber
  }
}`;

const COLLECTIONS_SEARCH = `
query($name: String) {
  collectionMinteds(where: {name_contains_nocase: $name}, orderDirection: desc, orderBy: blockTimestamp) {
    basePrices
    uri
    collectionId
    amount
    acceptedTokens
    name
    owner
    blockTimestamp
    tokenIds
    soldTokens
    blockNumber
  }
}`;

const COLLECTIONS_DECRYPT = `
query($name: String, $owner: String) {
  collectionMinteds(where: {name_contains_nocase: $name, owner: $owner}, orderDirection: desc, orderBy: blockTimestamp) {
    basePrices
    uri
    collectionId
    amount
    acceptedTokens
    name
    owner
    blockTimestamp
    tokenIds
    soldTokens
    blockNumber
  }
}`;

const COLLECTIONS_DROP = `
query($collectionId: String) {
  collectionMinteds(where: {collectionId: $collectionId}, orderDirection: desc, orderBy: blockTimestamp) {
    basePrices
    uri
    collectionId
    amount
    acceptedTokens
    name
    owner
    blockTimestamp
    tokenIds
    soldTokens
    blockNumber
  }
}`;

const COLLECTIONS_UPDATED = `
  query {
    updatedChromadinCollectionCollectionMinteds {
      basePrices
      uri
      collectionId
      amount
      acceptedTokens
      name
      owner
      blockTimestamp
      tokenIds
      soldTokens
      blockNumber
    }
  }
`;

const COLLECTIONS_PAGINATION_UPDATED = `
query($first: Int, $skip: Int) {
  updatedChromadinCollectionCollectionMinteds(first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
    basePrices
    uri
    collectionId
    amount
    acceptedTokens
    name
    owner
    blockTimestamp
    tokenIds
    soldTokens
    blockNumber
  }
}`;

const COLLECTIONS_OWNER_UPDATED = `
query($owner: String) {
  updatedChromadinCollectionCollectionMinteds(where: {owner: $owner}, orderDirection: desc, orderBy: blockTimestamp) {
    basePrices
    uri
    collectionId
    amount
    acceptedTokens
    name
    owner
    blockTimestamp
    tokenIds
    soldTokens
    blockNumber
  }
}`;

const COLLECTIONS_SEARCH_UPDATED = `
query($name: String) {
  updatedChromadinCollectionCollectionMinteds(where: {name_contains_nocase: $name}, orderDirection: desc, orderBy: blockTimestamp) {
    basePrices
    uri
    collectionId
    amount
    acceptedTokens
    name
    owner
    blockTimestamp
    tokenIds
    soldTokens
    blockNumber
  }
}`;

const COLLECTIONS_DECRYPT_UPDATED = `
query($name: String, $owner: String) {
  updatedChromadinCollectionCollectionMinteds(where: {name_contains_nocase: $name, owner: $owner}, orderDirection: desc, orderBy: blockTimestamp) {
    basePrices
    uri
    collectionId
    amount
    acceptedTokens
    name
    owner
    blockTimestamp
    tokenIds
    soldTokens
    blockNumber
  }
}`;

const COLLECTIONS_DROP_UPDATED = `
query($collectionId: String) {
  updatedChromadinCollectionCollectionMinteds(where: {collectionId: $collectionId}, orderDirection: desc, orderBy: blockTimestamp) {
    basePrices
    uri
    collectionId
    amount
    acceptedTokens
    name
    owner
    blockTimestamp
    tokenIds
    soldTokens
    blockNumber
  }
}`;

export const getAllCollections = async (): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS),
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

export const getAllCollectionsPaginated = async (
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_PAGINATION),
    variables: {
      first,
      skip,
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

export const getCollectionsProfile = async (owner: string): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_OWNER),
    variables: {
      owner,
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

export const getCollectionsSearch = async (name: string): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_SEARCH),
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

export const getCollectionsDecrypt = async (
  name: string,
  owner: string
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_DECRYPT),
    variables: {
      name,
      owner,
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

export const getCollectionsDrop = async (
  collectionId: string
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_DROP),
    variables: {
      collectionId,
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

export const getAllCollectionsUpdated = async (): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_UPDATED),
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

export const getAllCollectionsPaginatedUpdated = async (
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_PAGINATION_UPDATED),
    variables: {
      first,
      skip,
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

export const getCollectionsProfileUpdated = async (
  owner: string
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_OWNER_UPDATED),
    variables: {
      owner,
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

export const getCollectionsSearchUpdated = async (
  name: string
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_SEARCH_UPDATED),
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

export const getCollectionsDecryptUpdated = async (
  name: string,
  owner: string
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_DECRYPT_UPDATED),
    variables: {
      name,
      owner,
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

export const getCollectionsDropUpdated = async (
  collectionId: string
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_DROP_UPDATED),
    variables: {
      collectionId,
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
