import {
  getPublication,
  getPublicationAuth,
} from "@/graphql/lens/queries/getPublication";
import { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setCommentsRedux } from "@/redux/reducers/commentSlice";
import { setCommentFeedCount } from "@/redux/reducers/commentFeedCountSlice";
import { useRouter } from "next/router";
import { setIndividualFeedCount } from "@/redux/reducers/individualFeedCountReducer";
import { setFeedType } from "@/redux/reducers/feedTypeSlice";
import { useAccount } from "wagmi";
import {
  Comment,
  CommentRankingFilterType,
  LimitType,
  Mirror,
  Post,
  PublicationsQuery,
  Quote,
} from "@/components/Home/types/generated";
import {
  profilePublications,
  profilePublicationsAuth,
} from "@/graphql/lens/queries/getVideos";
import { FetchResult } from "@apollo/client";
import { decryptPostIndividual } from "@/lib/helpers/decryptPost";

const useIndividual = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { address } = useAccount();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const feedType = useSelector(
    (state: RootState) => state.app.feedTypeReducer.value
  );
  const commentFeedCount = useSelector(
    (state: RootState) => state.app.commentFeedCountReducer
  );
  const index = useSelector((state: RootState) => state.app.indexModalReducer);
  const commentors = useSelector(
    (state: RootState) => state.app.commentReducer.value
  );
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [paginated, setPaginated] = useState<any>();
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  const [mainPost, setMainPost] = useState<Post | Mirror | Quote | Comment>();
  const [mainPostLoading, setMainPostLoading] = useState<boolean>(false);
  const [followerOnly, setFollowerOnly] = useState<boolean>(false);
  const [followerOnlyComments, setFollowerOnlyComments] = useState<boolean[]>(
    []
  );
  const [reactCommentLoading, setReactCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors.length }, () => false)
  );
  const [mirrorCommentLoading, setMirrorCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors.length }, () => false)
  );
  const [collectCommentLoading, setCollectCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors.length }, () => false)
  );
  const [collectPostLoading, setCollectPostLoading] = useState<boolean[]>([
    false,
  ]);
  const [mirrorPostLoading, setMirrorPostLoading] = useState<boolean[]>([
    false,
  ]);
  const [reactPostLoading, setReactPostLoading] = useState<boolean[]>([false]);
  const [openPostMirrorChoice, setOpenPostMirrorChoice] = useState<boolean[]>([
    false,
  ]);
  const [openCommentMirrorChoice, setOpenCommentMirrorChoice] = useState<
    boolean[]
  >([false]);

  const getPostComments = async (): Promise<void> => {
    setCommentsLoading(true);
    try {
      let comments: FetchResult<PublicationsQuery>;

      if (lensProfile) {
        comments = await profilePublicationsAuth({
          where: {
            commentOn: {
              id: feedType,
              ranking: {
                filter: CommentRankingFilterType.Relevant,
              },
            },
          },
          limit: LimitType.Ten,
        });
      } else {
        comments = await profilePublications({
          where: {
            commentOn: {
              id: feedType,
              ranking: {
                filter: CommentRankingFilterType.Relevant,
              },
            },
          },
          limit: LimitType.Ten,
        });
      }
      if (!comments || !comments?.data || !comments?.data?.publications) {
        setCommentsLoading(false);
        return;
      }
      const sortedArr: Comment[] = [
        ...comments?.data?.publications?.items,
      ] as Comment[];
      if (sortedArr?.length < 10) {
        setHasMoreComments(false);
      } else {
        setHasMoreComments(true);
      }
      dispatch(setCommentsRedux(sortedArr));
      setPaginated(comments?.data?.publications?.pageInfo);
      setFollowerOnlyComments(
        sortedArr?.map((obj: Comment) =>
          obj.referenceModule?.type === "FollowerOnlyReferenceModule"
            ? true
            : false
        )
      );

      dispatch(
        setCommentFeedCount({
          actionLike: sortedArr.map((obj: Comment) => obj.stats.reactions),
          actionMirror: sortedArr.map((obj: Comment) => obj.stats.mirrors),
          actionCollect: sortedArr.map(
            (obj: Comment) => obj.stats.countOpenActions
          ),
          actionComment: sortedArr.map((obj: Comment) => obj.stats.comments),
          actionHasLiked: sortedArr.map(
            (obj: Comment) => obj.operations.hasReacted
          ),
          actionHasMirrored: sortedArr.map(
            (obj: Comment) => obj.operations.hasMirrored
          ),
          actionHasCollected: sortedArr.map(
            (obj: Comment) => obj.operations.hasActed?.isFinalisedOnchain
          ),
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setCommentsLoading(false);
  };

  const getMorePostComments = async (): Promise<void> => {
    try {
      if (!paginated?.next) {
        // fix apollo duplications on null next
        setHasMoreComments(false);
        return;
      }
      let comments: FetchResult<PublicationsQuery>;
      if (lensProfile) {
        comments = await profilePublicationsAuth({
          where: {
            commentOn: {
              id: feedType,
              ranking: {
                filter: CommentRankingFilterType.Relevant,
              },
            },
          },
          limit: LimitType.Ten,
          cursor: paginated?.next,
        });
      } else {
        comments = await profilePublications({
          where: {
            commentOn: {
              id: feedType,
              ranking: {
                filter: CommentRankingFilterType.Relevant,
              },
            },
          },
          limit: LimitType.Ten,
          cursor: paginated?.next,
        });
      }
      if (
        !comments ||
        !comments?.data ||
        !comments?.data?.publications ||
        comments?.data?.publications?.items?.length < 1
      ) {
        setCommentsLoading(false);
        return;
      }
      const sortedArr: Comment[] = [...comments?.data?.publications?.items] as  Comment[] ;
      if (sortedArr?.length < 10) {
        setHasMoreComments(false);
      }
      dispatch(setCommentsRedux([...commentors, ...sortedArr]));
      setPaginated(comments?.data?.publications?.pageInfo);
      setFollowerOnlyComments([
        ...followerOnlyComments,
        ...sortedArr?.map((obj: Comment) =>
          obj.referenceModule?.type === "FollowerOnlyReferenceModule"
            ? true
            : false
        ),
      ]);
      if (lensProfile) {
        dispatch(
          setCommentFeedCount({
            actionLike: [
              ...commentFeedCount.like,
              ...sortedArr.map((obj: Comment) => obj.stats.reactions),
            ],
            actionMirror: [
              ...commentFeedCount.mirror,
              ...sortedArr.map((obj: Comment) => obj.stats.mirrors),
            ],
            actionCollect: [
              ...commentFeedCount.collect,
              ...sortedArr.map((obj: Comment) => obj.stats.countOpenActions),
            ],
            actionComment: [
              ...commentFeedCount.comment,
              ...sortedArr.map((obj: Comment) => obj.stats.comments),
            ],
            actionHasLiked: [
              ...commentFeedCount.hasLiked,
              ...sortedArr.map((obj: Comment) => obj.operations.hasReacted),
            ],
            actionHasMirrored: [
              ...commentFeedCount.hasMirrored,
              ...sortedArr.map((obj: Comment) => obj.operations.hasMirrored),
            ],
            actionHasCollected: [
              ...commentFeedCount.hasCollected,
              ...sortedArr.map(
                (obj: Comment) => obj.operations.hasActed?.isFinalisedOnchain
              ),
            ],
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getPostInfo = async () => {
    setMainPostLoading(true);
    try {
      let pubData: Post | Comment | Quote | Mirror;
      if (lensProfile) {
        const { data } = await getPublicationAuth({
          forId: feedType,
        });

        pubData = data?.publication as Post | Comment | Quote | Mirror;
      } else {
        const { data } = await getPublication({
          forId: feedType,
        });
        pubData = data?.publication as Post | Comment | Quote | Mirror;
      }

      pubData = await decryptPostIndividual(
        address,
        pubData as Post | Comment | Quote | Mirror
      );

      setMainPost(pubData);
      setFollowerOnly(
        (pubData?.__typename === "Mirror"
          ? pubData?.mirrorOn
          : (pubData as Post)
        )?.referenceModule?.type === "FollowerOnlyReferenceModule"
          ? true
          : false
      );

      dispatch(
        setIndividualFeedCount({
          actionLike: (pubData?.__typename === "Mirror"
            ? pubData?.mirrorOn
            : (pubData as Post)
          )?.stats.reactions,
          actionMirror: (pubData?.__typename === "Mirror"
            ? pubData?.mirrorOn
            : (pubData as Post)
          )?.stats.mirrors,
          actionCollect: (pubData?.__typename === "Mirror"
            ? pubData?.mirrorOn
            : (pubData as Post)
          )?.stats.countOpenActions,
          actionComment: (pubData?.__typename === "Mirror"
            ? pubData?.mirrorOn
            : (pubData as Post)
          )?.stats.comments,
          actionHasLiked: (pubData?.__typename === "Mirror"
            ? pubData?.mirrorOn
            : (pubData as Post)
          )?.operations?.hasReacted,
          actionHasMirrored: (pubData?.__typename === "Mirror"
            ? pubData?.mirrorOn
            : (pubData as Post)
          )?.operations?.hasMirrored,
          actionHasCollected: (pubData?.__typename === "Mirror"
            ? pubData?.mirrorOn
            : (pubData as Post)
          )?.operations?.hasActed?.isFinalisedOnchain,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setMainPostLoading(false);
  };

  useEffect(() => {
    if (feedType !== "") {
      getPostInfo();
      getPostComments();
    }
  }, [feedType]);

  useEffect(() => {
    if (feedType !== "" && router.asPath?.includes("#chat")) {
      if (index.message === "Successfully Indexed") {
        getPostComments();
      }
    }
  }, [index.message]);

  useEffect(() => {
    if (router.asPath.includes("&post=") && router.asPath.includes("#chat")) {
      dispatch(setFeedType(router.asPath.split("&post=")[1]));
    } else if (
      router.asPath.includes("#chat") &&
      !router.asPath.includes("&post=")
    ) {
      dispatch(setFeedType(""));
    }
  }, [router.asPath]);

  return {
    getMorePostComments,
    hasMoreComments,
    commentsLoading,
    mainPostLoading,
    followerOnly,
    mainPost,
    followerOnlyComments,
    reactCommentLoading,
    mirrorCommentLoading,
    collectCommentLoading,
    setMirrorCommentLoading,
    setCollectCommentLoading,
    setReactCommentLoading,
    setCollectPostLoading,
    setMirrorPostLoading,
    setReactPostLoading,
    collectPostLoading,
    reactPostLoading,
    mirrorPostLoading,
    openCommentMirrorChoice,
    setOpenCommentMirrorChoice,
    openPostMirrorChoice,
    setOpenPostMirrorChoice,
  };
};

export default useIndividual;
