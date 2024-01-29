import {
  LimitType,
  Comment,
  Profile,
  Post,
} from "@/components/Home/types/generated";
import { getPublications } from "@/graphql/lens/queries/getVideos";
import { whoActed } from "@/graphql/lens/queries/whoActed";
import { useEffect, useState } from "react";

const useInteractions = (
  lensProfile: Profile | undefined,
  mainVideo: {
    video: Post;
    local: string;
  }
) => {
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [collectsLoading, setCollectsLoading] = useState<boolean>(false);
  const [secondaryComment, setSecondaryComment] = useState<string>("");
  const [commentors, setCommentors] = useState<Comment[]>([]);
  const [collectors, setCollectors] = useState<any[]>([]);
  const [collectInfo, setCollectInfo] = useState<{
    hasMore: boolean;
    paginated: string | undefined;
  }>({
    hasMore: true,
    paginated: undefined,
  });
  const [commentInfo, setCommentInfo] = useState<{
    hasMore: boolean;
    paginated: string | undefined;
  }>({
    hasMore: true,
    paginated: undefined,
  });

  const getPostComments = async (): Promise<void> => {
    setCommentsLoading(true);
    try {
      const comments = await getPublications(
        {
          where: {
            commentOn: {
              id:
                secondaryComment !== ""
                  ? secondaryComment
                  : mainVideo?.video?.id,
            },
          },
          limit: LimitType.TwentyFive,
        },
        lensProfile?.id
      );

      if (!comments || !comments?.data || !comments?.data?.publications) {
        setCommentsLoading(false);
        return;
      }
      const sortedArr: Comment[] = [
        ...comments?.data?.publications?.items,
      ] as Comment[];
      setCommentors(sortedArr);
      setCommentInfo({
        hasMore: sortedArr?.length < 25 ? false : true,
        paginated: comments?.data?.publications?.pageInfo?.next,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setCommentsLoading(false);
  };

  const getMorePostComments = async (): Promise<void> => {
    try {
      if (!commentInfo?.hasMore) return;

      const comments = await getPublications(
        {
          where: {
            commentOn: {
              id:
                secondaryComment !== ""
                  ? secondaryComment
                  : mainVideo.video?.id,
            },
          },
          limit: LimitType.TwentyFive,
          cursor: commentInfo?.paginated,
        },
        lensProfile?.id
      );

      const sortedArr: Comment[] = [
        ...(comments?.data?.publications?.items || []),
      ] as Comment[];
      setCommentors([...commentors, ...sortedArr]);
      setCommentInfo({
        hasMore: sortedArr?.length < 25 ? false : true,
        paginated: comments?.data?.publications?.pageInfo?.next,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getPostCollects = async (): Promise<void> => {
    setCollectsLoading(true);
    try {
      const collects = await whoActed({
        on: mainVideo?.video?.id,
        limit: LimitType.TwentyFive,
      });

      const arr: Profile[] = [
        ...(collects?.data?.whoActedOnPublication.items || []),
      ] as Profile[];
      setCollectors(arr);

      setCollectInfo({
        hasMore: arr?.length < 25 ? false : true,
        paginated: collects?.data?.whoActedOnPublication?.pageInfo?.next,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectsLoading(false);
  };

  const getMorePostCollects = async (): Promise<void> => {
    if (!collectInfo?.hasMore) return;
    try {
      const collects = await whoActed({
        on: mainVideo?.video?.id,
        limit: LimitType.TwentyFive,
        cursor: collectInfo?.paginated,
      });

      const arr: Profile[] = [
        ...(collects.data?.whoActedOnPublication?.items || []),
      ] as Profile[];

      setCollectors([...collectors, ...arr]);

      setCollectInfo({
        hasMore: arr?.length < 25 ? false : true,
        paginated: collects?.data?.whoActedOnPublication?.pageInfo?.next,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (mainVideo?.video?.id) {
      getPostCollects();
    }
  }, [mainVideo?.video?.id, lensProfile?.id]);

  useEffect(() => {
    if (mainVideo?.video?.id || secondaryComment !== "") {
      getPostComments();
    }
  }, [mainVideo?.video?.id, lensProfile?.id, secondaryComment]);

  return {
    commentors,
    getMorePostComments,
    commentsLoading,
    collectors,
    collectsLoading,
    getMorePostCollects,
    collectInfo,
    commentInfo,
    secondaryComment,
    setSecondaryComment,
    setCommentors,
    getPostComments
  };
};

export default useInteractions;
