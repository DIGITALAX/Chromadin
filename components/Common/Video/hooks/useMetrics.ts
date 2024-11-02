import { useEffect, useRef, useState } from "react";
import { VideoActivity } from "../types/controls.types";
import { setModal } from "@/redux/reducers/modalSlice";
import { Dispatch } from "redux";
import { ethers } from "ethers";
import { Kinora } from "kinora-sdk";
import { apolloClient } from "@/lib/lens/client";
import { Post, Profile } from "@/components/Home/types/generated";
import { KINORA_METRICS, KINORA_QUEST_DATA } from "@/lib/constants";
import { getPublications } from "@/graphql/lens/queries/getVideos";
import { getPublication } from "@/graphql/lens/queries/getPublication";
import {
  getPlayerData,
  getVideoActivity,
} from "@/graphql/subgraph/queries/getQuests";

const useMetrics = (
  dispatch: Dispatch,
  currentVideo: Post | undefined,
  lensProfile: Profile | undefined,
  address: `0x${string}` | undefined,
  metricsOpen: boolean
) => {
  const [currentMetricsLoading, setCurrentMetricsLoading] =
    useState<boolean>(false);
  const [metricsLoading, setMetricsLoading] = useState<boolean>(false);
  const metricsRef = useRef<HTMLDivElement>(null);
  const [liveMetrics, setLiveMetrics] = useState<VideoActivity | undefined>();
  const [onChainMetrics, setOnChainMetrics] = useState<
    VideoActivity | undefined
  >();
  const kinora = Kinora.getInstance(apolloClient);
  const handleMetricsAdd = async () => {
    if (!lensProfile?.id || !address || !currentVideo) return;

    const data = await getPlayerData(parseInt(lensProfile?.id, 16));
    if (data?.data?.players?.length > 0) {
      return;
    }

    setMetricsLoading(true);
    try {
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        137
      );
      const signer = provider.getSigner();

      const { error, errorMessage } = await kinora.sendPlayerMetricsOnChain(
        currentVideo?.id,
        lensProfile?.id,
        signer as any,
        KINORA_METRICS,
        KINORA_QUEST_DATA
      );

      if (error) {
        console.error(errorMessage);
        dispatch(
          setModal({
            actionOpen: true,
            actionMessage: "Something went wrong. Try again?",
          })
        );
      } else {
        dispatch(
          setModal({
            actionOpen: true,
            actionMessage: "Metrics sent on chain!",
          })
        );

        await handleCurrentMetrics();
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setMetricsLoading(false);
  };

  const handleCurrentMetrics = async () => {
    if (!currentVideo?.id) {
      setLiveMetrics(undefined);
      return;
    }
    setCurrentMetricsLoading(true);
    const chainMetrics = await getVideoDetails();

    try {
      let currentActivity = {};
      if (!chainMetrics?.hasCommented && lensProfile?.id) {
        const datos = await getPublications(
          {
            where: {
              commentOn: {
                id: currentVideo?.id,
              },
              from: [lensProfile?.id],
            },
          },
          lensProfile?.id
        );
        currentActivity = {
          ...currentActivity,
          hasCommented:
          datos?.data?.publications?.items && datos?.data?.publications?.items?.length > 0
              ? true
              : false,
        };
      }

      if (!chainMetrics?.hasQuoted) {
        currentActivity = {
          ...currentActivity,
          hasQuoted: currentVideo?.operations?.hasQuoted,
        };
      }

      if (!chainMetrics?.hasMirrored) {
        currentActivity = {
          ...currentActivity,
          hasMirrored: currentVideo?.operations?.hasMirrored,
        };
      }

      if (!chainMetrics?.hasBookmarked) {
        currentActivity = {
          ...currentActivity,
          hasBookmarked: currentVideo?.operations?.hasBookmarked,
        };
      }

      if (!chainMetrics?.hasReacted) {
        currentActivity = {
          ...currentActivity,
          hasReacted: currentVideo?.operations?.hasReacted,
        };
      }

      if (lensProfile?.id) {
        const {
          secondaryQuoteOnQuote,
          secondaryMirrorOnQuote,
          secondaryReactOnQuote,
          secondaryCommentOnQuote,
          secondaryCollectOnQuote,
          secondaryQuoteOnComment,
          secondaryMirrorOnComment,
          secondaryReactOnComment,
          secondaryCommentOnComment,
          secondaryCollectOnComment,
        } = await kinora.getPlayerVideoSecondaryData(
          lensProfile?.id,
          currentVideo?.id
        );

        if (
          !chainMetrics?.secondaryQuoteOnQuote ||
          Number(chainMetrics?.secondaryQuoteOnQuote) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryQuoteOnQuote,
          };
        }
        if (
          !chainMetrics?.secondaryMirrorOnQuote ||
          Number(chainMetrics?.secondaryMirrorOnQuote) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryMirrorOnQuote,
          };
        }
        if (
          !chainMetrics?.secondaryReactOnQuote ||
          Number(chainMetrics?.secondaryReactOnQuote) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryReactOnQuote,
          };
        }
        if (
          !chainMetrics?.secondaryCommentOnQuote ||
          Number(chainMetrics?.secondaryCommentOnQuote) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryCommentOnQuote,
          };
        }

        if (
          !chainMetrics?.secondaryCollectOnQuote ||
          Number(chainMetrics?.secondaryCollectOnQuote) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryCollectOnQuote,
          };
        }
        if (
          !chainMetrics?.secondaryQuoteOnComment ||
          Number(chainMetrics?.secondaryQuoteOnComment) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryQuoteOnComment,
          };
        }
        if (
          !chainMetrics?.secondaryMirrorOnComment ||
          Number(chainMetrics?.secondaryMirrorOnComment) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryMirrorOnComment,
          };
        }
        if (
          !chainMetrics?.secondaryReactOnComment ||
          Number(chainMetrics?.secondaryReactOnComment) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryReactOnComment,
          };
        }
        if (
          !chainMetrics?.secondaryCommentOnComment ||
          Number(chainMetrics?.secondaryCommentOnComment) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryCommentOnComment,
          };
        }
        if (
          !chainMetrics?.secondaryCollectOnComment ||
          Number(chainMetrics?.secondaryCollectOnComment) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryCollectOnComment,
          };
        }
      }

      setLiveMetrics(currentActivity as VideoActivity);
    } catch (err: any) {
      console.error(err.message);
    }
    setCurrentMetricsLoading(false);
  };

  const getVideoDetails = async (): Promise<VideoActivity | undefined> => {
    if (!lensProfile?.id) return;
    try {
      const data = await getPublication(
        {
          forId: currentVideo?.id,
        },
        lensProfile?.id
      );
      const video = await getVideoActivity(
        parseInt(lensProfile?.id, 16),
        parseInt(currentVideo?.id?.split("-")?.[1], 16),
        parseInt(currentVideo?.id?.split("-")?.[0], 16)
      );
      setOnChainMetrics({
        ...video?.data?.videoActivities[0],
        avd: Number(video?.data?.videoActivities[0]?.avd)
          ? Number(video?.data?.videoActivities[0]?.avd) / 10 ** 18
          : 0,
        duration: Number(video?.data?.videoActivities[0]?.duration)
          ? Number(video?.data?.videoActivities[0]?.duration) / 10 ** 18
          : 0,
        publication: data?.data?.publication,
      });
      return {
        ...video?.data?.videoActivities[0],
        avd:
          video?.data?.videoActivities[0]?.avd &&
          Number(video?.data?.videoActivities[0]?.avd) / 10 ** 18,
        duration:
          video?.data?.videoActivities[0]?.duration &&
          Number(video?.data?.videoActivities[0]?.duration) / 10 ** 18,
        publication: data?.data?.publication,
      };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getLogs = () => {
    const logs = kinora.getLiveVideoMetrics(currentVideo?.id);

    setLiveMetrics({
      ...(liveMetrics || {}),
      avd: logs.avd,
      duration: logs.duration,
      playCount: logs.playCount,
      totalInteractions: logs.totalInteractions,
    } as VideoActivity);
  };

  useEffect(() => {
    if (currentVideo?.id && liveMetrics !== undefined && metricsOpen) {
      const interval = setInterval(() => {
        getLogs();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentVideo?.id, liveMetrics, metricsOpen]);

  useEffect(() => {
    if (currentVideo?.id && metricsOpen) {
      handleCurrentMetrics();
    }
  }, [currentVideo?.id, metricsOpen]);

  return {
    handleMetricsAdd,
    metricsLoading,
    metricsRef,
    liveMetrics,
    onChainMetrics,
    currentMetricsLoading,
  };
};

export default useMetrics;
