import {
  CommentRankingFilterType,
  LimitType,
  Comment,
  Profile,
  PublicationsQuery,
} from "@/components/Home/types/generated";
import {
  getPublications,
  getPublicationsAuth,
} from "@/graphql/lens/queries/getVideos";
import { whoActed } from "@/graphql/lens/queries/whoActed";
import { RootState } from "@/redux/store";
import { FetchResult } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useInteractions = () => {
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [paginated, setPaginated] = useState<any>();
  const [commentors, setCommentors] = useState<Comment[]>([]);
  const [collectors, setCollectors] = useState<any[]>([]);
  const [collectPageInfo, setCollectPageInfo] = useState<any>();
  const [collectLoading, setCollectLoading] = useState<boolean>(false);
  const [hasMoreCollects, setHasMoreCollects] = useState<boolean>(true);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  const router = useRouter();
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const mainVideo = useSelector(
    (state: RootState) => state.app.mainVideoReducer
  );
  const commentId = useSelector(
    (state: RootState) => state.app.secondaryCommentReducer.value
  );
  const index = useSelector((state: RootState) => state.app.indexModalReducer);

  const getPostComments = async (): Promise<void> => {
    setCommentsLoading(true);
    try {
      let comments: FetchResult<PublicationsQuery>;

      if (profileId) {
        comments = await getPublicationsAuth({
          where: {
            commentOn: {
              id: commentId !== "" ? commentId : mainVideo.id,
              ranking: {
                filter: CommentRankingFilterType.Relevant,
              },
            },
          },
          limit: LimitType.TwentyFive,
        });
      } else {
        comments = await getPublications({
          where: {
            commentOn: {
              id: commentId !== "" ? commentId : mainVideo.id,
              ranking: {
                filter: CommentRankingFilterType.Relevant,
              },
            },
          },
          limit: LimitType.TwentyFive,
        });
      }
      if (!comments || !comments?.data || !comments?.data?.publications) {
        setCommentsLoading(false);
        return;
      }
      const sortedArr: Comment[] = [...comments?.data?.publications?.items] as Comment[];
      if (sortedArr?.length < 25) {
        setHasMoreComments(false);
      } else {
        setHasMoreComments(true);
      }
      setCommentors(sortedArr);
      setPaginated(comments?.data?.publications?.pageInfo);
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
      if (profileId) {
        comments = await getPublicationsAuth({
          where: {
            commentOn: {
              id: commentId !== "" ? commentId : mainVideo.id,
              ranking: {
                filter: CommentRankingFilterType.Relevant,
              },
            },
          },
          limit: LimitType.TwentyFive,
          cursor: paginated?.next,
        });
      } else {
        comments = await getPublications({
          where: {
            commentOn: {
              id: commentId !== "" ? commentId : mainVideo.id,
              ranking: {
                filter: CommentRankingFilterType.Relevant,
              },
            },
          },
          limit: LimitType.TwentyFive,
          cursor: paginated?.next,
        });
      }
      if (
        !comments ||
        !comments?.data ||
        !comments?.data?.publications ||
        comments?.data?.publications?.items?.length < 1
      ) {
        setHasMoreComments(false);
        setCommentsLoading(false);
        return;
      }
      const sortedArr: Comment[] = [...comments?.data?.publications?.items] as Comment[];
      if (sortedArr?.length < 25) {
        setHasMoreComments(false);
      }
      setCommentors([...commentors, ...sortedArr]);
      setPaginated(comments?.data?.publications?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getPostCollects = async (): Promise<void> => {
    setCollectLoading(true);
    try {
      const collects = await whoActed({
        on: mainVideo?.id,
        limit: LimitType.TwentyFive,
      });

      const arr: Profile[] = [
        ...(collects?.data?.whoActedOnPublication.items || []),
      ] as Profile[];
      setCollectors(arr);
      setCollectPageInfo(collects?.data?.whoActedOnPublication?.pageInfo);
      if (arr?.length < 25) {
        setHasMoreCollects(false);
      } else {
        setHasMoreCollects(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectLoading(false);
  };

  const getMorePostCollects = async (): Promise<void> => {
    if (!collectPageInfo?.next) {
      setHasMoreCollects(false);
      return;
    }
    try {
      const collects = await whoActed({
        on: mainVideo?.id,
        limit: LimitType.TwentyFive,
        cursor: collectPageInfo?.next,
      });

      const arr: Profile[] = [
        ...(collects.data?.whoActedOnPublication?.items || []),
      ] as Profile[];
      if (arr?.length < 25) {
        setHasMoreCollects(false);
      }
      setCollectors([...collectors, ...arr]);
      setCollectPageInfo(collects?.data?.whoActedOnPublication?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (mainVideo.id) {
      getPostCollects();
    }
  }, [mainVideo.id, profileId]);

  useEffect(() => {
    if (mainVideo.id) {
      getPostComments();
    }
  }, [mainVideo.id, profileId, commentId]);

  useEffect(() => {
    if (
      index.message === "Successfully Indexed" &&
      router.asPath?.includes("#stream")
    ) {
      getPostComments();
      getPostCollects();
    }
  }, [index.message]);

  return {
    commentors,
    getMorePostComments,
    commentsLoading,
    collectors,
    collectLoading,
    getMorePostCollects,
    hasMoreCollects,
    hasMoreComments,
  };
};

export default useInteractions;
