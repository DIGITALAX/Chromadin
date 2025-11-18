import { graphClient, graphPrintServer } from "@/app/lib/subgraph/client";
import { gql } from "@apollo/client";

const COLLECTIONS = `
  query {
    collectionCreateds(where: {origin: 0, frozen: false}, orderBy: postId, first: 1000) {
      amount
      drop {
        uri
        dropId
         collections {
            collectionId
          }
        metadata {
          cover
          title
         
        }
      }
      metadata {
        access
        visibility
        video
        title
        onChromadin
        sex
        style
        tags
        prompt
        sizes
        microbrand
        mediaTypes
        mediaCover
        id
        description
        audio
        colors
        images
        microbrandCover
      }
      postId
      acceptedTokens
      uri
      printType
      price
      designer
      tokenIdsMinted
      collectionId
      unlimited
      origin
      dropId
      blockTimestamp
    }
  }
`;

const COLLECTIONS_PAGINATION = `
query($first: Int, $skip: Int) {
  collectionCreateds(first: $first, skip: $skip, orderDirection: desc, orderBy: postId, where: {origin: 0}) {
     amount
      drop {
        uri
       dropId
         collections {
            collectionId
          }
        metadata {
          cover
          title
         
        }
      }
      metadata {
        access
        visibility
        video
        title
        onChromadin
        sex
        style
        tags
        prompt
        sizes
        microbrand
        mediaTypes
        mediaCover
        id
        description
        audio
        colors
        images
        microbrandCover
      }
      postId
      acceptedTokens
      uri
      printType
      dropId
      price
      designer
      tokenIdsMinted
      collectionId
      unlimited
      origin
      blockTimestamp
  }
}`;

const COLLECTIONS_OWNER = `
query($designer: String) {
  collectionCreateds(where: {designer: $designer, origin: 0}, orderDirection: desc, orderBy: postId, first: 1000) {
     amount
      drop {
        uri
       dropId
         collections {
            collectionId
          }
        metadata {
          cover
          title
         
        }
      }
      metadata {
        access
        visibility
        video
        title
        onChromadin
        sex
        style
        tags
        prompt
        sizes
        microbrand
        mediaTypes
        mediaCover
        id
        description
        audio
        colors
        images
        microbrandCover
      }
      postId
      acceptedTokens
      uri
      printType
      price
      designer
      dropId
      tokenIdsMinted
      collectionId
      unlimited
      origin
      blockTimestamp
  }
}`;

const COLLECTIONS_SEARCH = `
query($title: String) {
  collectionCreateds(where: {and: [{or: [{metadata_: {title_contains_nocase: $title}}, {metadata_: {description_contains_nocase: $title}}]}, {origin: 0}]}, first: 20) {
   amount
      drop {
        uri
        dropId
         collections {
            collectionId
          }
        metadata {
          cover
          title
         
        }
      }
      metadata {
        access
        visibility
        video
        title
        onChromadin
        sex
        style
        tags
        prompt
        sizes
        microbrand
        mediaTypes
        mediaCover
        id
        description
        audio
        colors
        images
        microbrandCover
      }
      postId
      dropId
      acceptedTokens
      uri
      printType
      price
      designer
      tokenIdsMinted
      collectionId
      unlimited
      origin
      blockTimestamp
  }
}`;

const COLLECTIONS_DROP = `
query($dropId: String) {
  collectionCreateds(where: {dropId: $dropId, origin: 0}, orderDirection: desc, orderBy: postId, first: 1000) {
    amount
      drop {
        uri
        dropId
         collections {
            collectionId
          }
        metadata {
          cover
          title
         
        }
      }
      metadata {
        access
        visibility
        video
        title
        onChromadin
        sex
        style
        tags
        prompt
        sizes
        microbrand
        mediaTypes
        mediaCover
        id
        description
        audio
        colors
        images
        microbrandCover
      }
      postId
      acceptedTokens
      uri
      printType
      price
      designer
      tokenIdsMinted
      collectionId
      unlimited
      origin
      dropId
      blockTimestamp
  }
}`;


const COLLECTION_ID = `query($collectionId: String) {
  collectionCreateds(where: {collectionId: $collectionId}, orderDirection: desc, orderBy: blockTimestamp, first: 1) {
    amount
      drop {
        uri
        dropId
        dropId
         collections {
            collectionId
          }
        metadata {
          cover
          title
         
        }
      }
      metadata {
        access
        visibility
        video
        title
        onChromadin
        sex
        style
        tags
        prompt
        sizes
        microbrand
        mediaTypes
        mediaCover
        id
        description
        audio
        colors
        images
        microbrandCover
      }
      dropId
      postId
      acceptedTokens
      uri
      printType
      price
      designer
      tokenIdsMinted
      collectionId
      unlimited
      origin
      blockTimestamp
  }
}`;

const COLLECTION_ONE = `query($title: String) {
  collectionCreateds(where: {metadata_: {title_contains_nocase: $title}, origin: 0}, orderDirection: desc, orderBy: blockTimestamp, first: 1) {
   amount
   dropId
      drop {
        uri
       dropId
         collections {
            collectionId
          }
        metadata {
          cover
          title
         
        }
      }
      metadata {
        access
        visibility
        video
        title
        onChromadin
        sex
        style
        tags
        prompt
        sizes
        microbrand
        mediaTypes
        mediaCover
        id
        description
        audio
        colors
        images
        microbrandCover
      }
      postId
      acceptedTokens
      uri
      printType
      price
      designer
      tokenIdsMinted
      collectionId
      unlimited
      origin
      blockTimestamp
  }
}`;

export const getAllCollections = async (): Promise<any> => {
  const queryPromise = (typeof window === "undefined" ? graphPrintServer : graphClient).query({
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
  const queryPromise = (typeof window === "undefined" ? graphPrintServer : graphClient).query({
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

export const getCollectionsProfile = async (designer: string): Promise<any> => {
  const queryPromise = (typeof window === "undefined" ? graphPrintServer : graphClient).query({
    query: gql(COLLECTIONS_OWNER),
    variables: {
      designer,
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
  const words = title.trim().split(/\s+/).filter(word => word.length > 0);


  let titleConditions = words.map(word => `{metadata_: {title_contains_nocase: "${word}"}}`).join(', ');
  let descriptionConditions = words.map(word => `{metadata_: {description_contains_nocase: "${word}"}}`).join(', ');

  const DYNAMIC_SEARCH = `
    query {
      collectionCreateds(where: {and: [{or: [${titleConditions}, ${descriptionConditions}]}, {origin: 0}]}, first: 20) {
        amount
        drop {
          uri
          dropId
          collections {
            collectionId
          }
          metadata {
            cover
            title
          }
        }
        metadata {
          access
          visibility
          video
          title
          onChromadin
          sex
          style
          tags
          prompt
          sizes
          microbrand
          mediaTypes
          mediaCover
          id
          description
          audio
          colors
          images
          microbrandCover
        }
        postId
        dropId
        acceptedTokens
        uri
        printType
        price
        designer
        tokenIdsMinted
        collectionId
        unlimited
        origin
        blockTimestamp
      }
    }
  `;


  const queryPromise = (typeof window === "undefined" ? graphPrintServer : graphClient).query({
    query: gql(DYNAMIC_SEARCH),
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export const getCollectionsDrop = async (dropId: string): Promise<any> => {
  const queryPromise = (typeof window === "undefined" ? graphPrintServer : graphClient).query({
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

export const getOneCollection = async (title: string): Promise<any> => {
  const queryPromise = (typeof window === "undefined" ? graphPrintServer : graphClient).query({
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


export const getCollectionByUri = async (uri: string): Promise<any> => {
  const queryPromise = (typeof window === "undefined" ? graphPrintServer : graphClient).query({
    query: gql(`query($uri: String) {
      collectionCreateds(first: 1, where: { uri: $uri}, orderDirection: desc, orderBy: blockTimestamp) {
        metadata {
          title
          mediaCover
          images
        }
        uri
        origin
      }
    }`),
    variables: {
      uri,
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
  const queryPromise = (typeof window === "undefined" ? graphPrintServer : graphClient).query({
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

