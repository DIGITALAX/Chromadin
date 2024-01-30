import { KINORA_QUEST_DATA } from "@/lib/constants";
import { graphKinoraClient } from "@/lib/subgraph/client";
import { FetchResult, gql } from "@apollo/client";

export const getQuestVideos = async (
  pubId: number,
  profileId: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
      query($pubId: Int, $profileId: Int, $contractAddress: String) {
        videos(first: $first, skip: $skip, where: {pubId: $pubId, profileId: $profileId, contractAddress: $contractAddress}) {
          questId
        }
      }
    `),
    variables: {
      pubId,
      profileId,
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
  const queryPromise = graphKinoraClient.query({
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
                profileId
                pubId
                quote
                react
                videoBytes
              }
            }
            maxPlayerCount
            questId
            pubId
            status
            profileId
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
              profileId
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
                pubId
                secondaryCollectOnComment
                playCount
                profileId
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
      contractAddress: KINORA_QUEST_DATA
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
  playerProfileId: number,
  pubId: number,
  profileId: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($playerProfileId: Int, $profileId: Int, $pubId: Int, $contractAddress: String) {
        videoActivities(where: { pubId: $pubId, profileId: $profileId, playerProfileId: $playerProfileId, contractAddress: $contractAddress}, first: 1) {
          avd
          duration
          hasBookmarked
          hasCommented
          hasMirrored
          hasQuoted
          hasReacted
          mostReplayedArea
          playCount
          profileId
          pubId
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
      playerProfileId,
      profileId,
      pubId,
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