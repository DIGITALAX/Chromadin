import {
  LimitType,
  Mirror,
  Post,
  PublicationType,
  Quote,
} from "@/components/Home/types/generated";
import { INFURA_GATEWAY, LENS_CREATORS } from "@/lib/constants";
import { setCommentFeedCount } from "@/redux/reducers/commentFeedCountSlice";
import { setFeedsRedux } from "@/redux/reducers/feedSlice";
import { setIndividualFeedCount } from "@/redux/reducers/individualFeedCountReducer";
import { setPaginated } from "@/redux/reducers/paginatedSlice";
import { setProfileFeedCount } from "@/redux/reducers/profileFeedCountSlice";
import { setReactionFeedCount } from "@/redux/reducers/reactionFeedCountSlice";
import { setScrollPosRedux } from "@/redux/reducers/scrollPosSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { setPostSent } from "@/redux/reducers/postSentSlice";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { setDecryptFeedRedux } from "@/redux/reducers/decryptFeedSlice";
import { setDecryptFeedCount } from "@/redux/reducers/decryptFeedCountSlice";
import { setDecryptPaginated } from "@/redux/reducers/decryptPaginatedSlice";
import { setDecryptScrollPosRedux } from "@/redux/reducers/decryptScrollPosSlice";
import { setDecryptProfileFeedCount } from "@/redux/reducers/decryptProfileCountSlice";
import { Collection } from "@/components/Home/types/home.types";
import {
  getCollectionsDecrypt,
  getCollectionsDecryptUpdated,
} from "@/graphql/subgraph/queries/getAllCollections";
import {
  profilePublications,
  profilePublicationsAuth,
} from "@/graphql/lens/queries/getVideos";
import { decryptPostArray } from "@/lib/helpers/decryptPost";

const useAllPosts = () => {
  const { address } = useAccount();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const feedDispatch = useSelector(
    (state: RootState) => state.app.feedReducer.value
  );
  const decryptFeed = useSelector(
    (state: RootState) => state.app.decryptFeedReducer.value
  );
  const filterDecrypt = useSelector(
    (state: RootState) => state.app.filterDecryptReducer.value
  );
  const decryptFeedCount = useSelector(
    (state: RootState) => state.app.decryptFeedCountReducer
  );
  const indexer = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const decrypt = useSelector((state: RootState) => state.app.decryptReducer);
  const feedId = useSelector(
    (state: RootState) => state.app.feedReactIdReducer
  );
  const reactionFeedCount = useSelector(
    (state: RootState) => state.app.reactionFeedCountReducer
  );
  const postSent = useSelector(
    (state: RootState) => state.app.postSentReducer.value
  );
  const feedType = useSelector(
    (state: RootState) => state.app.feedTypeReducer.value
  );
  const commentFeed = useSelector(
    (state: RootState) => state.app.commentFeedCountReducer
  );
  const comments = useSelector(
    (state: RootState) => state.app.commentReducer.value
  );
  const paginated = useSelector(
    (state: RootState) => state.app.paginatedReducer.value
  );
  const individual = useSelector(
    (state: RootState) => state.app.individualFeedCountReducer
  );
  const profile = useSelector(
    (state: RootState) => state.app.profileReducer.profile
  );
  const profileFeedCount = useSelector(
    (state: RootState) => state.app.profileFeedCountReducer
  );
  const profileDispatch = useSelector(
    (state: RootState) => state.app.profileFeedReducer.value
  );
  const decryptPaginated = useSelector(
    (state: RootState) => state.app.decryptPaginatedReducer.value
  );
  const decryptProfileFeedCount = useSelector(
    (state: RootState) => state.app.decryptProfileFeedCountReducer
  );

  const scrollRef = useRef<InfiniteScroll>(null);
  const scrollRefDecrypt = useRef<InfiniteScroll>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const [followerOnly, setFollowerOnly] = useState<boolean[]>(
    Array.from({ length: feedDispatch?.length }, () => false)
  );
  const [postsLoading, setPostsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [followerOnlyDecrypt, setFollowerOnlyDecrypt] = useState<boolean[]>(
    Array.from({ length: feedDispatch?.length }, () => false)
  );
  const [decryptLoading, setDecryptLoading] = useState<boolean>(false);
  const [hasMoreDecrypt, setHasMoreDecrypt] = useState<boolean>(true);
  const [decryptCollections, setDecryptCollections] = useState<Collection[]>(
    []
  );

  const getTimeline = async () => {
    setPostsLoading(true);
    try {
      let data;

      if (lensProfile) {
        data = await profilePublicationsAuth({
          where: {
            from: LENS_CREATORS,
            publicationTypes: [
              PublicationType.Post,
              PublicationType.Mirror,
              PublicationType.Quote,
            ],
          },
          limit: LimitType.Ten,
        });
      } else {
        data = await profilePublications({
          where: {
            from: LENS_CREATORS,
            publicationTypes: [
              PublicationType.Post,
              PublicationType.Mirror,
              PublicationType.Quote,
            ],
          },
          limit: LimitType.Ten,
        });
      }

      if (!data || !data?.data || !data?.data?.publications.items) {
        setPostsLoading(false);
        return;
      }
      const arr = [...data?.data?.publications.items] as (
        | Post
        | Mirror
        | Quote
      )[];
      let sortedArr = arr.sort(
        (a: Post | Mirror | Quote, b: Post | Mirror | Quote) =>
          Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      sortedArr = await decryptPostArray(address, sortedArr);

      if (sortedArr?.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      dispatch(setPaginated(data?.data?.publications?.pageInfo));

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
      if (!paginated?.next) {
        // fix apollo duplications on null next
        setHasMore(false);
        return;
      }
      let data;

      if (lensProfile) {
        data = await profilePublicationsAuth({
          where: {
            from: LENS_CREATORS,
            publicationTypes: [
              PublicationType.Post,
              PublicationType.Mirror,
              PublicationType.Quote,
            ],
          },
          limit: LimitType.Ten,
          cursor: paginated?.next,
        });
      } else {
        data = await profilePublications({
          where: {
            from: LENS_CREATORS,
            publicationTypes: [
              PublicationType.Post,
              PublicationType.Mirror,
              PublicationType.Quote,
            ],
          },
          limit: LimitType.Ten,
          cursor: paginated?.next,
        });
      }

      const arr: (Post | Quote | Mirror)[] = [
        ...(data?.data?.publications?.items || []),
      ] as (Post | Quote | Mirror)[];
      let sortedArr = arr.sort(
        (a: Post | Quote | Mirror, b: Post | Quote | Mirror) =>
          Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      sortedArr = await decryptPostArray(address, sortedArr);

      if (sortedArr?.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      dispatch(setFeedsRedux([...feedDispatch, ...sortedArr]));
      dispatch(setPaginated(data?.data?.publications?.pageInfo));
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

  const getDecryptFeed = async () => {
    setDecryptLoading(true);
    try {
      let data;

      if (lensProfile) {
        data = await profilePublicationsAuth({
          where: {
            metadata: {
              tags: {
                all: ["encrypted", "chromadin", "labyrinth"],
              },
            },
            publicationTypes: [PublicationType.Post],
          },
          limit: LimitType.Ten,
        });
      } else {
        data = await profilePublications({
          where: {
            metadata: {
              tags: {
                all: ["encrypted", "chromadin", "labyrinth"],
              },
            },
            publicationTypes: [PublicationType.Post],
          },
          limit: LimitType.Ten,
        });
      }

      if (!data || !data?.data || !data?.data?.publications) {
        setDecryptLoading(false);
        return;
      }
      const arr: Post[] = [...data?.data.publications?.items] as Post[];
      let sortedArr = arr.sort(
        (a: Post, b: Post) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      sortedArr = (await decryptPostArray(address, sortedArr)) as Post[];

      if (sortedArr?.length < 10) {
        setHasMoreDecrypt(false);
      } else {
        setHasMoreDecrypt(true);
      }
      dispatch(setDecryptPaginated(data?.data?.publications?.pageInfo));

      setFollowerOnlyDecrypt(
        sortedArr.map((obj: Post) =>
          obj.referenceModule?.type === "FollowerOnlyReferenceModule"
            ? true
            : false
        )
      );
      dispatch(setDecryptFeedRedux(sortedArr));
      dispatch(
        setDecryptFeedCount({
          actionLike: sortedArr.map((obj: Post) => obj.stats.reactions),
          actionMirror: sortedArr.map((obj: Post) => obj.stats.mirrors),
          actionCollect: sortedArr.map(
            (obj: Post) => obj.stats.countOpenActions
          ),
          actionComment: sortedArr.map((obj: Post) => obj.stats.comments),
          actionHasLiked: sortedArr.map(
            (obj: Post) => obj.operations.hasReacted
          ),
          actionHasMirrored: sortedArr.map(
            (obj: Post) => obj.operations.hasMirrored
          ),
          actionHasCollected: sortedArr.map(
            (obj: Post) => obj.operations.hasActed?.isFinalisedOnchain
          ),
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setDecryptLoading(false);
  };

  const fetchMoreDecrypt = async () => {
    try {
      if (!decryptPaginated?.next) {
        // fix apollo duplications on null next
        setHasMoreDecrypt(false);
        return;
      }
      let data;

      if (lensProfile) {
        data = await profilePublicationsAuth({
          where: {
            metadata: {
              tags: {
                all: ["encrypted", "chromadin", "labyrinth"],
              },
            },
            publicationTypes: [PublicationType.Post],
          },
          limit: LimitType.Ten,
          cursor: decryptPaginated?.next,
        });
      } else {
        data = await profilePublications({
          where: {
            metadata: {
              tags: {
                all: ["encrypted", "chromadin", "labyrinth"],
              },
            },
            publicationTypes: [PublicationType.Post],
          },
          limit: LimitType.Ten,
          cursor: decryptPaginated?.next,
        });
      }

      const arr: Post[] = [
        ...(data?.data?.publications?.items || []),
      ] as Post[];
      let sortedArr = arr.sort(
        (a: Post, b: Post) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      sortedArr = (await decryptPostArray(address, sortedArr)) as Post[];

      if (sortedArr?.length < 10) {
        setHasMoreDecrypt(false);
      } else {
        setHasMoreDecrypt(true);
      }
      dispatch(setDecryptFeedRedux([...decryptFeed, ...sortedArr]));
      dispatch(setDecryptPaginated(data?.data?.publications?.pageInfo));
      setFollowerOnlyDecrypt([
        ...followerOnlyDecrypt,
        ...sortedArr.map((obj: Post) =>
          obj.referenceModule?.type === "FollowerOnlyReferenceModule"
            ? true
            : false
        ),
      ]);

      dispatch(
        setDecryptFeedCount({
          actionLike: [
            ...decryptFeedCount.like,
            ...sortedArr.map((obj: Post) => obj.stats?.reactions),
          ],
          actionMirror: [
            ...decryptFeedCount.mirror,
            ...sortedArr.map((obj: Post) => obj.stats?.mirrors),
          ],
          actionCollect: [
            ...decryptFeedCount.collect,
            ...sortedArr.map((obj: Post) => obj.stats?.countOpenActions),
          ],
          actionComment: [
            ...decryptFeedCount.comment,
            ...sortedArr.map((obj: Post) => obj.stats?.comments),
          ],
          actionHasLiked: [
            ...decryptFeedCount.hasLiked,
            ...sortedArr.map((obj: Post) => obj.operations?.hasReacted),
          ],
          actionHasMirrored: [
            ...decryptFeedCount.hasMirrored,
            ...sortedArr.map((obj: Post) => obj.operations?.hasMirrored),
          ],
          actionHasCollected: [
            ...decryptFeedCount.hasCollected,
            ...sortedArr.map(
              (obj: Post) => obj.operations?.hasActed?.isFinalisedOnchain
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
          if (filterDecrypt) {
            dispatch(
              setDecryptFeedCount({
                actionLike:
                  feedId.type === 0
                    ? decryptFeedCount.like.map((obj: number, number: number) =>
                        number === index ? obj + 1 : obj
                      )
                    : decryptFeedCount.like,
                actionMirror:
                  feedId.type === 1
                    ? decryptFeedCount.mirror.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : decryptFeedCount.mirror,
                actionCollect:
                  feedId.type === 2
                    ? decryptFeedCount.collect.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : decryptFeedCount.collect,
                actionComment:
                  feedId.type === 3
                    ? decryptFeedCount.comment.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : decryptFeedCount.comment,
                actionHasLiked:
                  feedId.type === 0
                    ? decryptFeedCount.hasLiked.map(
                        (obj: boolean, number: number) =>
                          number === index ? true : obj
                      )
                    : decryptFeedCount.hasLiked,
                actionHasMirrored:
                  feedId.type === 1
                    ? decryptFeedCount.hasMirrored.map(
                        (obj: boolean, number: number) =>
                          number === index ? true : obj
                      )
                    : decryptFeedCount.mirror,
                actionHasCollected:
                  feedId.type === 2
                    ? decryptFeedCount.hasCollected.map(
                        (obj: boolean, number: number) =>
                          number === index ? true : obj
                      )
                    : decryptFeedCount.collect,
              })
            );
          } else {
            dispatch(
              setReactionFeedCount({
                actionLike:
                  feedId.type === 0
                    ? reactionFeedCount.like.map(
                        (obj: number, number: number) =>
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
          }
        } else {
          if (filterDecrypt) {
            dispatch(
              setDecryptProfileFeedCount({
                actionLike:
                  feedId.type === 0
                    ? decryptProfileFeedCount.like.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : decryptProfileFeedCount.like,
                actionMirror:
                  feedId.type === 1
                    ? decryptProfileFeedCount.mirror.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : decryptProfileFeedCount.mirror,
                actionCollect:
                  feedId.type === 2
                    ? decryptProfileFeedCount.collect.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : decryptProfileFeedCount.collect,
                actionComment:
                  feedId.type === 3
                    ? decryptProfileFeedCount.comment.map(
                        (obj: number, number: number) =>
                          number === index ? obj + 1 : obj
                      )
                    : decryptProfileFeedCount.comment,
                actionHasLiked:
                  feedId.type === 0
                    ? decryptProfileFeedCount.hasLiked.map(
                        (obj: boolean, number: number) =>
                          number === index ? true : obj
                      )
                    : decryptProfileFeedCount.hasLiked,
                actionHasMirrored:
                  feedId.type === 1
                    ? decryptProfileFeedCount.hasMirrored.map(
                        (obj: boolean, number: number) =>
                          number === index ? true : obj
                      )
                    : decryptProfileFeedCount.mirror,
                actionHasCollected:
                  feedId.type === 2
                    ? decryptProfileFeedCount.hasCollected.map(
                        (obj: boolean, number: number) =>
                          number === index ? true : obj
                      )
                    : decryptProfileFeedCount.collect,
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
                    ? profileFeedCount.mirror.map(
                        (obj: number, number: number) =>
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

  const setScrollPos = (e: MouseEvent) => {
    dispatch(setScrollPosRedux((e.target as HTMLDivElement)?.scrollTop));
  };

  const setScrollPosDecrypt = (e: MouseEvent) => {
    dispatch(setDecryptScrollPosRedux((e.target as HTMLDivElement)?.scrollTop));
  };

  const getDecryptCollections = async (): Promise<void> => {
    try {
      let collections: Collection[] = [];

      for (let name = 0; name <= decrypt?.collections?.length - 1; name++) {
        const collection = await getCollectionsDecrypt(
          decrypt.collections[name],
          decrypt.owner as string
        );
        const collectionUpdated = await getCollectionsDecryptUpdated(
          decrypt.collections[name],
          decrypt.owner as string
        );

        let data = [
          ...((
            collectionUpdated?.data
              ?.updatedChromadinCollectionCollectionMinteds || []
          ).filter(
            (obj: Collection) =>
              obj.collectionId !== "4" && obj.collectionId !== "5"
          ) || []),
          ...((collection?.data?.collectionMinteds || []).filter(
            (obj: Collection) =>
              obj.collectionId !== "104" && obj.collectionId !== "99"
          ) || []),
        ];
        const json = await fetchIPFSJSON(
          (data[0].uri as any)?.split("ipfs://")[1]?.replace(/"/g, "")?.trim()
        );

        const type = await fetch(
          `${INFURA_GATEWAY}/ipfs/${json.image?.split("ipfs://")[1]}`,
          { method: "HEAD" }
        ).then((response) => {
          if (response.ok) {
            return response.headers.get("Content-Type");
          }
        });

        if (data?.length > 0) {
          const newCollections = {
            ...data[0],
            uri: {
              ...json,
              type,
            },
          };
          collections.push(newCollections);
        }
      }

      setDecryptCollections(collections);
    } catch (err: any) {
      console.error(err.message);
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
    if (router.asPath.includes("#chat")) {
      if (filterDecrypt) {
        if (decryptFeed?.length < 1 || !decryptFeed) {
          getDecryptFeed();
        }
      } else {
        if (!feedDispatch || feedDispatch?.length < 1) {
          getTimeline();
        }
      }
    }
  }, [filterDecrypt]);

  useEffect(() => {
    if (
      postSent &&
      !router.asPath.includes("&post=") &&
      !router.asPath.includes("&profile=")
    ) {
      dispatch(setPostSent(false));

      if (filterDecrypt) {
        getDecryptFeed();
      } else {
        getTimeline();
      }
    }
  }, [postSent]);

  useEffect(() => {
    if (decrypt.open) {
      getDecryptCollections();
    }
  }, [decrypt.open]);

  return {
    followerOnly,
    postsLoading,
    fetchMore,
    hasMore,
    scrollRef,
    setScrollPos,
    fetchMoreDecrypt,
    decryptLoading,
    hasMoreDecrypt,
    scrollRefDecrypt,
    setScrollPosDecrypt,
    followerOnlyDecrypt,
    decryptCollections,
  };
};

export default useAllPosts;
