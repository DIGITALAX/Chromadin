import {
  LimitType,
  Mirror,
  Post,
  Profile,
  PublicationType,
  Quote,
  Comment,
} from "@/components/Home/types/generated";
import { LENS_CREATORS } from "@/lib/constants";
import {
  CommentFeedCountState,
  setCommentFeedCount,
} from "@/redux/reducers/commentFeedCountSlice";
import { setFeedsRedux } from "@/redux/reducers/feedSlice";
import {
  IndividualFeedCountState,
  setIndividualFeedCount,
} from "@/redux/reducers/individualFeedCountReducer";
import { setPaginated } from "@/redux/reducers/paginatedSlice";
import {
  ProfileFeedCountState,
  setProfileFeedCount,
} from "@/redux/reducers/profileFeedCountSlice";
import {
  ReactionFeedCountState,
  setReactionFeedCount,
} from "@/redux/reducers/reactionFeedCountSlice";
import { useEffect, useState } from "react";
import { setPostSent } from "@/redux/reducers/postSentSlice";
import { Collection } from "@/components/Home/types/home.types";
import { getPublications } from "@/graphql/lens/queries/getVideos";
import { AnyAction, Dispatch } from "redux";
import { NextRouter } from "next/router";
import { FeedReactIdState } from "@/redux/reducers/feedReactIdSlice";
import { IndexModalState } from "@/redux/reducers/indexModalSlice";

const useAllPosts = (
  dispatch: Dispatch<AnyAction>,
  router: NextRouter,
  lensProfile: Profile | undefined,
  profile: Profile | undefined,
  feedDispatch: (Post | Mirror | Quote)[],
  profileDispatch: (Post | Quote | Mirror)[],
  indexer: IndexModalState,
  feedId: FeedReactIdState,
  reactionFeedCount: ReactionFeedCountState,
  postSent: boolean,
  commentFeed: CommentFeedCountState,
  comments: Comment[],
  paginated: string | undefined,
  individual: IndividualFeedCountState,
  profileFeedCount: ProfileFeedCountState,
  feedType: string
) => {
  const [followerOnly, setFollowerOnly] = useState<boolean[]>(
    Array.from({ length: feedDispatch?.length }, () => false)
  );
  const [postsLoading, setPostsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const getTimeline = async () => {
    setPostsLoading(true);
    try {
      const data = await getPublications(
        {
          where: {
            from: LENS_CREATORS,
            publicationTypes: [
              PublicationType.Post,
              PublicationType.Mirror,
              PublicationType.Quote,
            ],
          },
          limit: LimitType.Ten,
        },
        lensProfile?.id
      );

      if (!data || !data?.data || !data?.data?.publications.items) {
        setPostsLoading(false);
        return;
      }

      const sortedArr = data?.data?.publications.items as Post[];

      if (sortedArr?.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      dispatch(setPaginated(data?.data?.publications?.pageInfo?.next));

      setFollowerOnly(
        sortedArr.map((obj: Post | Quote | Mirror) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOn.referenceModule?.type ===
              "FollowerOnlyReferenceModule"
              ? true
              : false
            : (obj as Post | Quote).referenceModule?.type ===
              "FollowerOnlyReferenceModule"
            ? true
            : false
        )
      );
      dispatch(setFeedsRedux(sortedArr));
      dispatch(
        setReactionFeedCount({
          actionLike: sortedArr.map((obj: Post | Quote | Mirror) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.stats.reactions
              : (obj as Quote | Post).stats.reactions
          ),
          actionMirror: sortedArr.map((obj: Post | Quote | Mirror) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.stats.mirrors
              : (obj as Quote | Post).stats.mirrors
          ),
          actionCollect: sortedArr.map((obj: Post | Quote | Mirror) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.stats.countOpenActions
              : (obj as Quote | Post).stats.countOpenActions
          ),
          actionComment: sortedArr.map((obj: Post | Quote | Mirror) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.stats.comments
              : (obj as Quote | Post).stats.comments
          ),
          actionHasLiked: sortedArr.map((obj: Post | Quote | Mirror) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.operations.hasReacted
              : (obj as Quote | Post).operations.hasReacted
          ),
          actionHasMirrored: sortedArr.map((obj: Post | Quote | Mirror) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.operations.hasMirrored
              : (obj as Quote | Post).operations.hasMirrored
          ),
          actionHasCollected: sortedArr.map((obj: Post | Quote | Mirror) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.operations.hasActed
              : (obj as Quote | Post).operations.hasActed?.isFinalisedOnchain
          ),
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setPostsLoading(false);
  };

  const fetchMore = async () => {
    try {
      if (!paginated) {
        // fix apollo duplications on null next
        setHasMore(false);
        return;
      }

      const data = await getPublications(
        {
          where: {
            from: LENS_CREATORS,
            publicationTypes: [
              PublicationType.Post,
              PublicationType.Mirror,
              PublicationType.Quote,
            ],
          },
          limit: LimitType.Ten,
          cursor: paginated,
        },
        lensProfile?.id
      );

      const arr: (Post | Quote | Mirror)[] = [
        ...(data?.data?.publications?.items || []),
      ] as (Post | Quote | Mirror)[];
      let sortedArr = arr.sort(
        (a: Post | Quote | Mirror, b: Post | Quote | Mirror) =>
          Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      if (sortedArr?.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      dispatch(setFeedsRedux([...feedDispatch, ...sortedArr]));
      dispatch(setPaginated(data?.data?.publications?.pageInfo?.next));
      setFollowerOnly([
        ...followerOnly,
        ...sortedArr.map((obj: Post | Quote | Mirror) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOn.referenceModule?.type ===
              "FollowerOnlyReferenceModule"
              ? true
              : false
            : (obj as Quote | Post).referenceModule?.type ===
              "FollowerOnlyReferenceModule"
            ? true
            : false
        ),
      ]);

      dispatch(
        setReactionFeedCount({
          actionLike: [
            ...reactionFeedCount.like,
            ...sortedArr.map((obj: Post | Quote | Mirror) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOn.stats.reactions
                : (obj as Quote | Post).stats.reactions
            ),
          ],
          actionMirror: [
            ...reactionFeedCount.mirror,
            ...sortedArr.map((obj: Post | Quote | Mirror) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOn.stats.mirrors
                : (obj as Quote | Post).stats.mirrors
            ),
          ],
          actionCollect: [
            ...reactionFeedCount.collect,
            ...sortedArr.map((obj: Post | Quote | Mirror) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOn.stats.countOpenActions
                : (obj as Quote | Post).stats.countOpenActions
            ),
          ],
          actionComment: [
            ...reactionFeedCount.comment,
            ...sortedArr.map((obj: Post | Quote | Mirror) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOn.stats.comments
                : (obj as Quote | Post).stats.comments
            ),
          ],
          actionHasLiked: [
            ...reactionFeedCount.hasLiked,
            ...sortedArr.map((obj: Post | Quote | Mirror) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOn.operations.hasReacted
                : (obj as Quote | Post).operations.hasReacted
            ),
          ],
          actionHasMirrored: [
            ...reactionFeedCount.hasMirrored,
            ...sortedArr.map((obj: Post | Quote | Mirror) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOn.operations.hasMirrored
                : (obj as Quote | Post).operations.hasMirrored
            ),
          ],
          actionHasCollected: [
            ...reactionFeedCount.hasCollected,
            ...sortedArr.map((obj: Post | Quote | Mirror) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOn.operations.hasActed
                : (obj as Quote | Post).operations.hasActed?.isFinalisedOnchain
            ),
          ],
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };
  const refetchInteractions = () => {
    try {
      const index = (
        profile?.id === "" || !profile?.id ? feedDispatch : profileDispatch
      )?.findIndex(
        (feed) =>
          (feed.__typename === "Mirror" ? feed.mirrorOn.id : feed.id) ===
          feedId.value
      );
      if (index !== -1) {
        dispatch(
          setIndividualFeedCount({
            actionLike:
              feedId.type === 0 ? individual.like + 1 : individual.like,
            actionMirror:
              feedId.type === 1 ? individual.mirror + 1 : individual.mirror,
            actionCollect:
              feedId.type === 2 ? individual.collect + 1 : individual.collect,
            actionComment:
              feedId.type === 3 ? individual.comment + 1 : individual.comment,
            actionHasLiked: feedId.type === 0 ? true : individual.hasLiked,
            actionHasMirrored: feedId.type === 1 ? true : individual.mirror,
            actionHasCollected: feedId.type === 2 ? true : individual.collect,
          })
        );
        if (profile?.id === "" || !profile?.id) {
          dispatch(
            setReactionFeedCount({
              actionLike:
                feedId.type === 0
                  ? reactionFeedCount.like.map((obj: number, number: number) =>
                      number === index ? obj + 1 : obj
                    )
                  : reactionFeedCount.like,
              actionMirror:
                feedId.type === 1
                  ? reactionFeedCount.mirror.map(
                      (obj: number, number: number) =>
                        number === index ? obj + 1 : obj
                    )
                  : reactionFeedCount.mirror,
              actionCollect:
                feedId.type === 2
                  ? reactionFeedCount.collect.map(
                      (obj: number, number: number) =>
                        number === index ? obj + 1 : obj
                    )
                  : reactionFeedCount.collect,
              actionComment:
                feedId.type === 3
                  ? reactionFeedCount.comment.map(
                      (obj: number, number: number) =>
                        number === index ? obj + 1 : obj
                    )
                  : reactionFeedCount.comment,
              actionHasLiked:
                feedId.type === 0
                  ? reactionFeedCount.hasLiked.map(
                      (obj: boolean, number: number) =>
                        number === index ? true : obj
                    )
                  : reactionFeedCount.hasLiked,
              actionHasMirrored:
                feedId.type === 1
                  ? reactionFeedCount.hasMirrored.map(
                      (obj: boolean, number: number) =>
                        number === index ? true : obj
                    )
                  : reactionFeedCount.mirror,
              actionHasCollected:
                feedId.type === 2
                  ? reactionFeedCount.hasCollected.map(
                      (obj: boolean, number: number) =>
                        number === index ? true : obj
                    )
                  : reactionFeedCount.collect,
            })
          );
        } else {
          dispatch(
            setProfileFeedCount({
              actionLike:
                feedId.type === 0
                  ? profileFeedCount.like.map((obj: number, number: number) =>
                      number === index ? obj + 1 : obj
                    )
                  : profileFeedCount.like,
              actionMirror:
                feedId.type === 1
                  ? profileFeedCount.mirror.map((obj: number, number: number) =>
                      number === index ? obj + 1 : obj
                    )
                  : profileFeedCount.mirror,
              actionCollect:
                feedId.type === 2
                  ? profileFeedCount.collect.map(
                      (obj: number, number: number) =>
                        number === index ? obj + 1 : obj
                    )
                  : profileFeedCount.collect,
              actionComment:
                feedId.type === 3
                  ? profileFeedCount.comment.map(
                      (obj: number, number: number) =>
                        number === index ? obj + 1 : obj
                    )
                  : profileFeedCount.comment,
              actionHasLiked:
                feedId.type === 0
                  ? profileFeedCount.hasLiked.map(
                      (obj: boolean, number: number) =>
                        number === index ? true : obj
                    )
                  : profileFeedCount.hasLiked,
              actionHasMirrored:
                feedId.type === 1
                  ? profileFeedCount.hasMirrored.map(
                      (obj: boolean, number: number) =>
                        number === index ? true : obj
                    )
                  : profileFeedCount.mirror,
              actionHasCollected:
                feedId.type === 2
                  ? profileFeedCount.hasCollected.map(
                      (obj: boolean, number: number) =>
                        number === index ? true : obj
                    )
                  : profileFeedCount.collect,
            })
          );
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const refetchComments = () => {
    const index = comments?.findIndex((comment) => comment.id === feedId.value);

    if (index !== -1) {
      dispatch(
        setCommentFeedCount({
          actionLike:
            feedId.type === 0
              ? commentFeed.like.map((obj: number, number: number) =>
                  number === index ? obj + 1 : obj
                )
              : commentFeed.like,
          actionMirror:
            feedId.type === 1
              ? commentFeed.mirror.map((obj: number, number: number) =>
                  number === index ? obj + 1 : obj
                )
              : commentFeed.mirror,
          actionCollect:
            feedId.type === 2
              ? commentFeed.collect.map((obj: number, number: number) =>
                  number === index ? obj + 1 : obj
                )
              : commentFeed.collect,
          actionComment:
            feedId.type === 3
              ? commentFeed.comment.map((obj: number, number: number) =>
                  number === index ? obj + 1 : obj
                )
              : commentFeed.comment,
          actionHasLiked:
            feedId.type === 0
              ? commentFeed.hasLiked.map((obj: boolean, number: number) =>
                  number === index ? true : obj
                )
              : commentFeed.hasLiked,
          actionHasMirrored:
            feedId.type === 1
              ? commentFeed.hasMirrored.map((obj: boolean, number: number) =>
                  number === index ? true : obj
                )
              : commentFeed.mirror,
          actionHasCollected:
            feedId.type === 2
              ? commentFeed.hasCollected.map((obj: boolean, number: number) =>
                  number === index ? true : obj
                )
              : commentFeed.collect,
        })
      );
    }
  };

  useEffect(() => {
    if (router.asPath?.includes("#chat")) {
      if (indexer.message === "Successfully Indexed") {
        refetchInteractions();

        if (feedType !== "") {
          refetchComments();
        }
      }
    }
  }, [indexer.message]);

  useEffect(() => {
    if (
      postSent &&
      !router.asPath.includes("&post=") &&
      !router.asPath.includes("&profile=")
    ) {
      dispatch(setPostSent(false));
      getTimeline();
    }
  }, [postSent]);

  useEffect(() => {
    if (
      !router.asPath.includes("&post=") &&
      !router.asPath.includes("&profile=") &&
      feedDispatch?.length < 1
    ) {
      getTimeline();
    }
  }, [router?.asPath]);

  return {
    followerOnly,
    postsLoading,
    fetchMore,
    hasMore,
  };
};

export default useAllPosts;
