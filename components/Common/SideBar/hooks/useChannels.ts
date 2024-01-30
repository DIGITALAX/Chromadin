import { SetStateAction, useEffect, useState } from "react";
import { getPublications } from "@/graphql/lens/queries/getVideos";
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
import { CHROMADIN_ID, VIDEO_COVERS } from "@/lib/constants";
import { VideoMetadataV3 } from "kinora-sdk/dist/@types/generated";
import { VideoControls } from "../../Video/types/controls.types";

const useChannels = (
  dispatch: Dispatch<AnyAction>,
  profile: Profile | undefined,
  allVideos: ChannelsState,
  videoInfo: {
    hasMore: boolean;
    paginated: string | undefined;
  },
  setVideoControlsInfo: (e: SetStateAction<VideoControls>) => void
) => {
  const [tab, setTab] = useState<number>(0);
  const [videosLoading, setVideosLoading] = useState<boolean>(false);

  const getVideos = async (): Promise<void> => {
    setVideoControlsInfo((prev) => ({
      ...prev,
      videosLoading: true,
    }));

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

      const sortedArr: Post[] = (data?.data?.publications?.items || [])?.map(
        (item) =>
          VIDEO_COVERS?.some((cov) => cov.id == (item as Post)?.id)
            ? {
                ...item,
                metadata: {
                  ...(item as Post).metadata,
                  asset: {
                    ...((item as Post)?.metadata as VideoMetadataV3)?.asset,
                    cover: {
                      ...((item as Post)?.metadata as VideoMetadataV3)?.asset
                        ?.cover,
                      raw: {
                        ...((item as Post)?.metadata as VideoMetadataV3)?.asset
                          ?.cover?.raw,
                        uri:
                          "ipfs://" +
                          VIDEO_COVERS?.find(
                            (cov) => cov.id == (item as Post)?.id
                          )?.poster,
                      },
                    },
                  },
                },
              }
            : item
      ) as Post[];
      dispatch(
        setVideoInfoRedux({
          actionHasMore: sortedArr?.length < 10 ? false : true,
          actionPaginated: data?.data?.publications?.pageInfo?.next,
        })
      );
      dispatch(
        setChannelsRedux({
          actionChannels: sortedArr,
          actionMain: sortedArr[0],
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoControlsInfo((prev) => ({
      ...prev,
      videosLoading: false,
    }));
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

      const sortedArr: Post[] = (data?.data?.publications?.items || [])?.map(
        (item) =>
          VIDEO_COVERS?.some((cov) => cov.id == (item as Post)?.id)
            ? {
                ...item,
                metadata: {
                  ...(item as Post).metadata,
                  asset: {
                    ...((item as Post)?.metadata as VideoMetadataV3)?.asset,
                    cover: {
                      ...((item as Post)?.metadata as VideoMetadataV3)?.asset
                        ?.cover,
                      raw: {
                        ...((item as Post)?.metadata as VideoMetadataV3)?.asset
                          ?.cover?.raw,
                        uri:
                          "ipfs://" +
                          VIDEO_COVERS?.find(
                            (cov) => cov.id == (item as Post)?.id
                          )?.poster,
                      },
                    },
                  },
                },
              }
            : item
      ) as Post[];
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
