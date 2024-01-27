import { useEffect, useState } from "react";
import { UseChannelsResults } from "../types/sidebar.types";
import { getPublications } from "@/graphql/lens/queries/getVideos";
import { MainVideoState, setMainVideo } from "@/redux/reducers/mainVideoSlice";
import json from "./../../../../public/videos/local.json";
import { setChannelsRedux } from "@/redux/reducers/channelsSlice";
import lodash from "lodash";
import { setReactId } from "@/redux/reducers/reactIdSlice";
import { VideoSyncState, setVideoSync } from "@/redux/reducers/videoSyncSlice";
import {
  VideoCountState,
  setVideoCount,
} from "@/redux/reducers/videoCountSlice";
import { setHasMoreVideosRedux } from "@/redux/reducers/hasMoreVideosSlice";
import {
  LimitType,
  Post,
  Profile,
  PublicationType,
} from "@/components/Home/types/generated";
import { AnyAction, Dispatch } from "redux";

const useChannels = (
  dispatch: Dispatch<AnyAction>,
  mainVideo: MainVideoState,
  profile: Profile | undefined,
  channelsDispatched: Post[],
  indexer: string | undefined,
  reactId: string | undefined,
  videoSync: VideoSyncState,
  videoCount: VideoCountState
): UseChannelsResults => {
  const [tab, setTab] = useState<number>(0);
  const [paginated, setPaginated] = useState<any>();
  const [videosLoading, setVideosLoading] = useState<boolean>(false);
  const [scrollHeight, setScrollHeight] = useState("27rem");

  const getVideos = async (): Promise<void> => {
    dispatch(
      setVideoSync({
        actionHeart: videoSync.heart,
        actionDuration: videoSync.duration,
        actionCurrentTime: videoSync.currentTime,
        actionIsPlaying: videoSync.isPlaying,
        actionLikedArray: videoSync.likedArray,
        actionMirroredArray: videoSync.mirroredArray,
        actionCollectedArray: videoSync.collectedArray,
        actionVideosLoading: true,
      })
    );
    let sortedArr: Post[] = [];
    try {
      const data = await getPublications(
        {
          limit: LimitType.Ten,
          where: {
            publicationTypes: [PublicationType.Post],
            from: ["0x01c6a9"],
          },
        },
        profile?.id
      );

      if (!data || !data?.data || data?.data.publications?.items?.length < 1) {
        return;
      }
      const arr: Post[] = [...data?.data.publications?.items] as Post[];
      sortedArr = arr.sort(
        (a: Post, b: Post) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 10) {
        dispatch(setHasMoreVideosRedux(false));
      } else {
        dispatch(setHasMoreVideosRedux(true));
      }
      setPaginated(data?.data.publications?.pageInfo);
      dispatch(setChannelsRedux(sortedArr));
      dispatch(
        setVideoCount({
          actionLike: sortedArr.map((obj: Post) => obj.stats.reactions),
          actionMirror: sortedArr.map((obj: Post) => obj.stats.mirrors),
          actionCollect: sortedArr.map(
            (obj: Post) => obj.stats.countOpenActions
          ),
        })
      );
      dispatch(
        setMainVideo({
          actionCollected: sortedArr[0].operations.actedOn,
          actionLiked: sortedArr[0].operations.hasReacted,
          actionMirrored: sortedArr[0].operations.hasMirrored,
          actionId: sortedArr[0].id,
          actionLocal: `${json[0].link}`,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    dispatch(
      setVideoSync({
        actionHeart: videoSync.heart,
        actionDuration: videoSync.duration,
        actionCurrentTime: videoSync.currentTime,
        actionIsPlaying: videoSync.isPlaying,
        actionLikedArray: sortedArr?.map(
          (obj: Post) => obj.operations.hasReacted
        ),
        actionMirroredArray: sortedArr?.map(
          (obj: Post) => obj.operations.hasMirrored
        ),
        actionCollectedArray: sortedArr?.map(
          (obj: Post) => obj.operations.hasActed?.isFinalisedOnchain
        ),
        actionVideosLoading: false,
      })
    );
  };

  const fetchMoreVideos = async () => {
    let sortedArr: Post[] = [];
    if (!paginated?.next) {
      dispatch(setHasMoreVideosRedux(false));
      return;
    }
    try {
      const data = await getPublications(
        {
          limit: LimitType.Ten,
          where: {
            publicationTypes: [PublicationType.Post],
            from: ["0x01c6a9"],
          },
          cursor: paginated?.next,
        },
        profile?.id
      );

      const arr: Post[] = [
        ...(data?.data?.publications?.items || []),
      ] as Post[];
      sortedArr = arr.sort(
        (a: Post, b: Post) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      if (sortedArr?.length < 10) {
        dispatch(setHasMoreVideosRedux(false));
      } else {
        dispatch(setHasMoreVideosRedux(true));
      }
      setPaginated(data?.data?.publications?.pageInfo);
      dispatch(setChannelsRedux([...channelsDispatched, ...sortedArr]));
      dispatch(
        setVideoCount({
          actionLike: [
            ...videoCount.like,
            ...sortedArr.map((obj: Post) => obj.stats.reactions),
          ],
          actionMirror: [
            ...videoCount.mirror,
            ...sortedArr.map((obj: Post) => obj.stats.mirrors),
          ],
          actionCollect: [
            ...videoCount.collect,
            ...sortedArr.map((obj: Post) => obj.stats.countOpenActions),
          ],
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    dispatch(
      setVideoSync({
        actionHeart: videoSync.heart,
        actionDuration: videoSync.duration,
        actionCurrentTime: videoSync.currentTime,
        actionIsPlaying: videoSync.isPlaying,
        actionLikedArray: [
          ...videoSync.likedArray,
          ...sortedArr?.map((obj) => obj.operations.hasReacted),
        ],
        actionMirroredArray: [
          ...videoSync.mirroredArray,
          ...sortedArr?.map((obj) => obj.operations.hasMirrored),
        ],
        actionCollectedArray: [
          ...videoSync.collectedArray,
          ...sortedArr?.map(
            (obj) => obj.operations.hasActed?.isFinalisedOnchain
          ),
        ],
        actionVideosLoading: videoSync.videosLoading,
      })
    );
    return {
      videos: [...channelsDispatched, ...sortedArr],
      mirrors: [
        ...videoSync.mirroredArray,
        ...sortedArr?.map((obj) => obj.operations.hasMirrored),
      ],
      collects: [
        ...videoSync.collectedArray,
        ...sortedArr?.map((obj) => obj.operations.hasActed?.isFinalisedOnchain),
      ],
      likes: [
        ...videoSync.likedArray,
        ...sortedArr?.map((obj) => obj.operations.hasReacted),
      ],
    };
  };

  const refetchInteractions = async () => {
    try {
      const data = await getPublications(
        {
          limit: LimitType.Ten,
          where: {
            publicationTypes: [PublicationType.Post],
            from: ["0x01c6a9"],
          },
        },
        profile?.id
      );

      const arr: Post[] = [
        ...(data?.data?.publications?.items || []),
      ] as Post[];
      const sortedArr: Post[] = arr.sort(
        (a: Post, b: Post) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      dispatch(
        setVideoSync({
          actionHeart: videoSync.heart,
          actionDuration: videoSync.duration,
          actionCurrentTime: videoSync.currentTime,
          actionIsPlaying: videoSync.isPlaying,
          actionLikedArray: sortedArr.map((obj: Post) => obj.stats.comments),
          actionMirroredArray: sortedArr.map(
            (obj: Post) => obj.operations.hasMirrored
          ),
          actionCollectedArray: sortedArr.map(
            (obj: Post) => obj.operations.hasActed?.isFinalisedOnchain
          ),
          actionVideosLoading: videoSync.videosLoading,
        })
      );
      dispatch(
        setVideoCount({
          actionLike: sortedArr.map((obj: Post) => obj.stats.reactions),
          actionMirror: sortedArr.map((obj: Post) => obj.stats.mirrors),
          actionCollect: sortedArr.map(
            (obj: Post) => obj.stats.countOpenActions
          ),
        })
      );
      if (reactId === mainVideo.id) {
        const currentIndex = lodash.findIndex(channelsDispatched, {
          id: reactId,
        });
        dispatch(
          setMainVideo({
            actionCollected: sortedArr.map(
              (obj: Post) => obj.operations.hasActed?.isFinalisedOnchain
            )?.[currentIndex],
            actionLiked: sortedArr.map(
              (obj: Post) => obj.operations.hasReacted
            )?.[currentIndex],
            actionMirrored: sortedArr.map(
              (obj: Post) => obj.operations.hasMirrored
            )?.[currentIndex],
            actionId: mainVideo.id,
            actionLocal: mainVideo.local,
          })
        );
      }
      dispatch(setReactId(""));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (indexer === "Successfully Indexed" && reactId !== "") {
      refetchInteractions();
    }
  }, [indexer]);

  useEffect(() => {
    if (!channelsDispatched || channelsDispatched?.length < 1) {
      getVideos();
    }
  }, [profile?.id]);

  useEffect(() => {
    if (window.innerWidth > 1024) {
      setScrollHeight("32rem");
    }
  }, []);

  return {
    tab,
    setTab,
    fetchMoreVideos,
    videosLoading,
    setVideosLoading,
    scrollHeight,
  };
};

export default useChannels;
