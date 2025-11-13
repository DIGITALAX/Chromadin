import { KINORA_QUEST_DATA } from "@/app/lib/constants";
import {
  graphKinoraClient,
  graphKinoraServer,
} from "@/app/lib/subgraph/client";
import { FetchResult, gql } from "@apollo/client";

export const getQuestVideos = async (
  postId: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = (
    typeof window === "undefined" ? graphKinoraServer : graphKinoraClient
  ).query({
    query: gql(`
      query($postId: String, $contractAddress: String) {
        videos(first: $first, skip: $skip, where: {postId: $postId, contractAddress: $contractAddress}) {
          questId
        }
      }
    `),
    variables: {
      postId,
      contractAddress: KINORA_QUEST_DATA,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
    return () => clearTimeout(timeoutId);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);

  timeoutId && clearTimeout(timeoutId);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export const getQuestById = async (
  questId: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = (
    typeof window === "undefined" ? graphKinoraServer : graphKinoraClient
  ).query({
    query: gql(`
    query($questId: String, $contractAddress: String) {
      questInstantiateds(where: {questId: $questId, contractAddress: $contractAddress}, first: 1, orderDirection: desc, orderBy: blockTimestamp) {
            gate {
              erc721Logic {
                uris
                tokenIds
                address
              }
              erc20Logic {
                address
                amount
              }
              oneOf
            }
            questMetadata {
              id
              title
              description
              cover
              videoCovers
            }
            milestones {
              gated {
                erc721Logic {
                  uris
                  tokenIds
                  address
                }
                erc20Logic {
                  address
                  amount
                  id
                }
                oneOf
              }
              uri
              milestoneMetadata {
                title
                description
                cover
              }
              milestoneId
              rewards {
                amount
                tokenAddress
                uri
                rewardMetadata {
                  title
                  description
                  cover
                  mediaCover
                  images
                  video
                  mediaType
                  audio
                }
                type
              }
              rewardsLength
              videoLength
              videos {
                bookmark
                comment
                minAVD
                minDuration
                minPlayCount
                minSecondaryCollectOnQuote
                minSecondaryCollectOnComment
                minSecondaryCommentOnComment
                minSecondaryCommentOnQuote
                minSecondaryMirrorOnComment
                minSecondaryMirrorOnQuote
                minSecondaryQuoteOnComment
                minSecondaryQuoteOnQuote
                minSecondaryReactOnComment
                minSecondaryReactOnQuote
                mirror
                playerId
                postId
                quote
                react
              }
            }
            maxPlayerCount
            questId
            postId
            status
            transactionHash
            blockTimestamp
            uri
            milestoneCount
            players {
              milestonesCompleted {
                questId
                milestonesCompleted
              }
              eligibile {
                milestone
                questId
                status
              }
              playerProfile
              questsCompleted
              questsJoined
              videos {
                secondaryReactOnQuote
                secondaryReactOnComment
                secondaryQuoteOnQuote
                secondaryQuoteOnComment
                secondaryMirrorOnQuote
                secondaryMirrorOnComment
                secondaryCommentOnQuote
                secondaryCommentOnComment
                secondaryCollectOnQuote
                postId
                secondaryCollectOnComment
                playCount
                mostReplayedArea
                hasQuoted
                hasReacted
                hasMirrored
                hasCommented
                hasBookmarked
                duration
                avd
                playerId
              }
            }
      }
    }
  `),
    variables: {
      questId,
      contractAddress: KINORA_QUEST_DATA,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
    return () => clearTimeout(timeoutId);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);

  timeoutId && clearTimeout(timeoutId);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export const getVideoActivity = async (
  playerProfile: string,
  postId: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = (
    typeof window === "undefined" ? graphKinoraServer : graphKinoraClient
  ).query({
    query: gql(`
    query($playerProfile: String, $postId: String, $contractAddress: String) {
        videoActivities(where: { postId: $postId, playerProfile: $playerProfile, contractAddress: $contractAddress}, first: 1) {
          avd
          duration
          hasBookmarked
          hasCommented
          hasMirrored
          hasQuoted
          hasReacted
          mostReplayedArea
          playCount
          postId
          secondaryCollectOnComment
          secondaryReactOnQuote
          secondaryQuoteOnQuote
          secondaryMirrorOnQuote
          secondaryMirrorOnComment
          secondaryCommentOnQuote
          secondaryCommentOnComment
          secondaryCollectOnQuote
          secondaryQuoteOnComment
          secondaryReactOnComment
          playerId
        }
    }
  `),
    variables: {
      playerProfile,
      postId,
      contractAddress: KINORA_QUEST_DATA,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
    return () => clearTimeout(timeoutId);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);

  timeoutId && clearTimeout(timeoutId);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export const getPlayerData = async (
  playerProfile: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = (
    typeof window === "undefined" ? graphKinoraServer : graphKinoraClient
  ).query({
    query: gql(`
    query($playerProfile: Int, $contractAddress: String) {
        players(where: {playerProfile: $playerProfile, contractAddress: $contractAddress}, first: 1) {
            questsCompleted
            questsJoined
        }
    }
  `),
    variables: {
      playerProfile,
      contractAddress: KINORA_QUEST_DATA,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000);
    return () => clearTimeout(timeoutId);
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);

  timeoutId && clearTimeout(timeoutId);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
