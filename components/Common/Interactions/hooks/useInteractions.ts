import { Publication } from "@/components/Home/types/lens.types";
import {
  whoCommentedPublications,
  whoCommentedPublicationsAuth,
} from "@/graphql/lens/queries/getVideos";
import whoCollectedPublications from "@/graphql/lens/queries/whoCollectedPublications";
import checkIfMirrored from "@/lib/helpers/checkIfMirrored";
import checkPostReactions from "@/lib/helpers/checkPostReactions";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useInteractions = () => {
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [paginated, setPaginated] = useState<any>();
  const [commentors, setCommentors] = useState<Publication[]>([]);
  const [hasMirrored, setHasMirrored] = useState<boolean[]>([]);
  const [hasReacted, setHasReacted] = useState<boolean[]>([]);
  const [collectors, setCollectors] = useState<any[]>([]);
  const [collectPageInfo, setCollectPageInfo] = useState<any>();
  const [collectLoading, setCollectLoading] = useState<boolean>(false);
  const [hasMoreCollects, setHasMoreCollects] = useState<boolean>(true);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);

  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const mainVideo = useSelector(
    (state: RootState) => state.app.mainVideoReducer
  );
  const index = useSelector((state: RootState) => state.app.indexModalReducer);

  const getPostComments = async (): Promise<void> => {
    setCommentsLoading(true);
    try {
      let comments: any;

      if (profileId) {
        comments = await whoCommentedPublicationsAuth({
          commentsOf: mainVideo.id,
          limit: 30,
          commentsOfOrdering: "RANKING",
          commentsRankingFilter: "RELEVANT",
        });
      } else {
        comments = await whoCommentedPublications({
          commentsOf: mainVideo.id,
          limit: 30,
          commentsOfOrdering: "RANKING",
          commentsRankingFilter: "RELEVANT",
        });
      }
      if (
        !comments ||
        !comments?.data ||
        !comments?.data?.publications 
      ) {
        setCommentsLoading(false);
        return;
      }
      const arr: any[] = [...comments?.data?.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 30) {
        setHasMoreComments(false);
      } else {
        setHasMoreComments(true);
      }
      setCommentors(sortedArr);
      setPaginated(comments?.data?.publications?.pageInfo);
      if (profileId) {
        const hasMirroredArr = await checkIfMirrored(sortedArr, profileId);
        setHasMirrored(hasMirroredArr);
        const response = await checkPostReactions(
          {
            commentsOf: mainVideo.id,
            limit: 30,
            commentsOfOrdering: "RANKING",
            commentsRankingFilter: "RELEVANT",
          },
          profileId
        );
        setHasReacted(response);
      }
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
      let comments: any;
      if (profileId) {
        comments = await whoCommentedPublicationsAuth({
          commentsOf: mainVideo.id,
          limit: 30,
          cursor: paginated?.next,
          commentsOfOrdering: "RANKING",
          commentsRankingFilter: "RELEVANT",
        });
      } else {
        comments = await whoCommentedPublications({
          commentsOf: mainVideo.id,
          limit: 30,
          cursor: paginated?.next,
          commentsOfOrdering: "RANKING",
          commentsRankingFilter: "RELEVANT",
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
      const arr: any[] = [...comments?.data?.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 30) {
        setHasMoreComments(false);
      }
      setCommentors([...commentors, ...sortedArr]);
      setPaginated(comments?.data?.publications?.pageInfo);
      if (profileId) {
        const hasMirroredArr = await checkIfMirrored(sortedArr, profileId);
        setHasMirrored([...hasMirrored, ...hasMirroredArr]);
        const hasReactedArr = await checkPostReactions(
          {
            commentsOf: mainVideo.id,
            limit: 30,
            cursor: paginated?.next,
            commentsOfOrdering: "RANKING",
            commentsRankingFilter: "RELEVANT",
          },
          profileId
        );
        setHasReacted([...hasReacted, ...hasReactedArr]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getPostCollects = async (): Promise<void> => {
    setCollectLoading(true);
    try {
      const collects = await whoCollectedPublications({
        publicationId: mainVideo.id,
        limit: 30,
      });
      const arr: any[] = [...collects?.data?.whoCollectedPublication.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setCollectors(sortedArr);
      setCollectPageInfo(collects?.data?.whoCollectedPublication?.pageInfo);
      if (sortedArr?.length < 30) {
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
      const collects = await whoCollectedPublications({
        publicationId: mainVideo?.id,
        limit: 30,
        cursor: collectPageInfo?.next,
      });
      const arr: any[] = [...collects.data.whoCollectedPublication.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 2) {
        setHasMoreCollects(false);
      }
      setCollectors([...collectors, ...sortedArr]);
      setCollectPageInfo(collects?.data?.whoCollectedPublication?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (mainVideo.id) {
      getPostComments();
      getPostCollects();
    }
  }, [mainVideo.id, profileId]);

  useEffect(() => {
    if (index.message === "Successfully Indexed") {
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
    hasMirrored,
    hasReacted,
  };
};

export default useInteractions;
