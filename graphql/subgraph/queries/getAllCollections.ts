import { gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const COLLECTIONS = `
  query {
    collectionCreateds(where: {origin: "1"}, first: 1000) {
      amount
      dropMetadata {
        dropCover
        dropTitle
      }
      collectionMetadata {
        access
        visibility
        video
        title
        onChromadin
        sex
        style
        tags
        prompt
        profileHandle
        sizes
        microbrand
        mediaTypes
        mediaCover
        id
        description
        audio
        colors
        communities
        images
        microbrandCover
      }
      pubId
      profileId
      acceptedTokens
      uri
      printType
      prices
      owner
      soldTokens
      fulfillerPercent
      fulfillerBase
      fulfiller
      designerPercent
      dropId
      dropCollectionIds
      collectionId
      unlimited
      origin
      blockTimestamp
    }
  }
`;

const COLLECTIONS_PAGINATION = `
query($first: Int, $skip: Int) {
  collectionCreateds(first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp, where: {origin: "1"}) {
    amount
    dropMetadata {
      dropCover
      dropTitle
    }
    collectionMetadata {
      access
      visibility
      video
      title
      onChromadin
      sex
      style
      tags
      prompt
      profileHandle
      sizes
      microbrand
      mediaTypes
      mediaCover
      id
      description
      audio
      colors
      communities
      images
      microbrandCover
    }
    pubId
    profileId
    acceptedTokens
    uri
    printType
    prices
    owner
    soldTokens
    fulfillerPercent
    fulfillerBase
    fulfiller
    designerPercent
    dropId
    dropCollectionIds
    collectionId
    unlimited
    origin
    blockTimestamp
  }
}`;

const COLLECTIONS_OWNER = `
query($owner: String) {
  collectionCreateds(where: {owner: $owner, origin: "1"}, orderDirection: desc, orderBy: blockTimestamp, first: 1000) {
    amount
    dropMetadata {
      dropCover
      dropTitle
    }
    collectionMetadata {
      access
      visibility
      video
      title
      onChromadin
      sex
      style
      tags
      prompt
      profileHandle
      sizes
      microbrand
      mediaTypes
      mediaCover
      id
      description
      audio
      colors
      communities
      images
      microbrandCover
    }
    pubId
    profileId
    acceptedTokens
    uri
    printType
    prices
    owner
    soldTokens
    fulfillerPercent
    fulfillerBase
    fulfiller
    designerPercent
    dropId
    dropCollectionIds
    collectionId
    unlimited
    origin
    blockTimestamp
  }
}`;

const COLLECTIONS_SEARCH = `
query($title: String) {
  collectionCreateds(where: {and: [{or: [{collectionMetadata_: {title_contains_nocase: $title}}, {collectionMetadata_: {description_contains_nocase: $title}}, {dropMetadata_: {dropTitle: $title}}]}, {origin: "1"}]}, first: 20) {
    amount
    dropMetadata {
      dropCover
      dropTitle
    }
    collectionMetadata {
      access
      visibility
      video
      title
      onChromadin
      sex
      style
      tags
      prompt
      profileHandle
      sizes
      microbrand
      mediaTypes
      mediaCover
      id
      description
      audio
      colors
      communities
      images
      microbrandCover
    }
    pubId
    profileId
    acceptedTokens
    uri
    printType
    prices
    owner
    soldTokens
    fulfillerPercent
    fulfillerBase
    fulfiller
    designerPercent
    dropId
    dropCollectionIds
    collectionId
    unlimited
    origin
    blockTimestamp
  }
}`;

const COLLECTIONS_DROP = `
query($dropId: String) {
  collectionCreateds(where: {dropId: $dropId, origin: "1"}, orderDirection: desc, orderBy: blockTimestamp, first: 1000) {
    amount
    dropMetadata {
      dropCover
      dropTitle
    }
    collectionMetadata {
      access
      visibility
      video
      title
      onChromadin
      sex
      style
      tags
      prompt
      profileHandle
      sizes
      microbrand
      mediaTypes
      mediaCover
      id
      description
      audio
      colors
      communities
      images
      microbrandCover
    }
    pubId
    profileId
    acceptedTokens
    uri
    printType
    prices
    owner
    soldTokens
    fulfillerPercent
    fulfillerBase
    fulfiller
    designerPercent
    dropId
    dropCollectionIds
    collectionId
    unlimited
    origin
    blockTimestamp
  }
}`;

const COLLECTION_ID = `query($collectionId: String) {
  collectionCreateds(where: {collectionId: $collectionId}, orderDirection: desc, orderBy: blockTimestamp, first: 1) {
    amount
    dropMetadata {
      dropCover
      dropTitle
    }
    collectionMetadata {
      access
      visibility
      video
      title
      onChromadin
      sex
      style
      tags
      prompt
      profileHandle
      sizes
      microbrand
      mediaTypes
      mediaCover
      id
      description
      audio
      colors
      communities
      images
      microbrandCover
    }
    pubId
    profileId
    acceptedTokens
    uri
    printType
    prices
    owner
    soldTokens
    fulfillerPercent
    fulfillerBase
    fulfiller
    designerPercent
    dropId
    dropCollectionIds
    collectionId
    unlimited
    origin
    blockTimestamp
  }
}`;

const COLLECTION_ONE = `query($title: String) {
  collectionCreateds(where: {collectionMetadata_: {title_ends_with_nocase: $title, title_starts_with_nocase: $title}, origin: "1"}, orderDirection: desc, orderBy: blockTimestamp, first: 1) {
    amount
    dropMetadata {
      dropCover
      dropTitle
    }
    collectionMetadata {
      access
      visibility
      video
      title
      onChromadin
      sex
      style
      tags
      prompt
      profileHandle
      sizes
      microbrand
      mediaTypes
      mediaCover
      id
      description
      audio
      colors
      communities
      images
      microbrandCover
    }
    pubId
    profileId
    acceptedTokens
    uri
    printType
    prices
    owner
    soldTokens
    fulfillerPercent
    fulfillerBase
    fulfiller
    designerPercent
    dropId
    dropCollectionIds
    collectionId
    unlimited
    origin
    blockTimestamp
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

export const getCollectionsSearch = async (title: string): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_SEARCH),
    variables: {
      title,
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

export const getCollectionsDrop = async (dropId: string): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_DROP),
    variables: {
      dropId,
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

export const getOneCollection = async (
  title: string
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTION_ONE),
    variables: {
      title,
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

export const getOneCollectionById = async (
  collectionId: string
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTION_ID),
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
