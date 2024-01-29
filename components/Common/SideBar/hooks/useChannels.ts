import { useEffect, useState } from "react";
import { getPublications } from "@/graphql/lens/queries/getVideos";
import json from "./../../../../public/videos/local.json";
import {
  ChannelsState,
  setChannelsRedux,
} from "@/redux/reducers/channelsSlice";
import {
  LimitType,
  Post,
  Profile,
  PublicationType,
} from "@/components/Home/types/generated";
import { AnyAction, Dispatch } from "redux";
import { setVideoInfoRedux } from "@/redux/reducers/videoInfoSlice";
import { CHROMADIN_ID } from "@/lib/constants";
import {
  FullScreenVideoState,
  setFullScreenVideo,
} from "@/redux/reducers/fullScreenVideoSlice";

const useChannels = (
  dispatch: Dispatch<AnyAction>,
  profile: Profile | undefined,
  allVideos: ChannelsState,
  videoSync: FullScreenVideoState,
  videoInfo: {
    hasMore: boolean;
    paginated: string | undefined;
  }
) => {
  const [tab, setTab] = useState<number>(0);
  const [videosLoading, setVideosLoading] = useState<boolean>(false);

  const getVideos = async (): Promise<void> => {
    dispatch(
      setFullScreenVideo({
        actionOpen: videoSync?.open,
        actionHeart: videoSync.heart,
        actionDuration: videoSync.duration,
        actionCurrentTime: videoSync.currentTime,
        actionIsPlaying: videoSync.isPlaying,
        actionVideosLoading: true,
        actionSeek: videoSync.seek,
      })
    );
    try {
      const data = await getPublications(
        {
          limit: LimitType.Ten,
          where: {
            publicationTypes: [PublicationType.Post],
            from: [CHROMADIN_ID],
          },
        },
        profile?.id
      );

      if (!data || !data?.data || data?.data.publications?.items?.length < 1) {
        return;
      }
      const sortedArr: Post[] = [...data?.data.publications?.items] as Post[];
      dispatch(
        setVideoInfoRedux({
          actionHasMore: sortedArr?.length < 10 ? false : true,
          actionPaginated: data?.data?.publications?.pageInfo?.next,
        })
      );
      dispatch(
        setChannelsRedux({
          actionChannels: sortedArr,
          actionMain: {
            video: sortedArr[0],
            local: `${json[0].link}`,
          },
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    dispatch(
      setFullScreenVideo({
        actionOpen: videoSync.open,
        actionHeart: videoSync.heart,
        actionDuration: videoSync.duration,
        actionCurrentTime: videoSync.currentTime,
        actionIsPlaying: videoSync.isPlaying,
        actionVideosLoading: false,
        actionSeek: videoSync.seek,
      })
    );
  };

  const fetchMoreVideos = async (): Promise<Post[] | undefined> => {
    if (!videoInfo?.hasMore) return;
    try {
      const data = await getPublications(
        {
          limit: LimitType.Ten,
          where: {
            publicationTypes: [PublicationType.Post],
            from: [CHROMADIN_ID],
          },
          cursor: videoInfo?.paginated,
        },
        profile?.id
      );

      const sortedArr: Post[] = [
        ...(data?.data?.publications?.items || []),
      ] as Post[];

      dispatch(
        setVideoInfoRedux({
          actionHasMore: sortedArr?.length < 10 ? false : true,
          actionPaginated: data?.data?.publications?.pageInfo?.next,
        })
      );
      dispatch(
        setChannelsRedux({
          actionChannels: [...allVideos?.channels, ...sortedArr],
          actionMain: allVideos?.main,
        })
      );

      return sortedArr;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (allVideos?.channels?.length < 1) {
      getVideos();
    }
  }, [profile?.id]);

  return {
    tab,
    setTab,
    fetchMoreVideos,
    videosLoading,
    setVideosLoading,
  };
};

export default useChannels;
