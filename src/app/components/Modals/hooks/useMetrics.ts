import { useContext, useEffect, useRef, useState } from "react";

import { ethers } from "ethers-v5";
import { Kinora } from "kinora-sdk";
import { ModalContext } from "@/app/providers";
import { VideoActivity } from "../types/modals.types";
import { fetchPost } from "@lens-protocol/client/actions";
import {
  getPlayerData,
  getVideoActivity,
} from "../../../../../graph/queries/getQuests";
import { Post } from "@lens-protocol/client";
import { INFURA_GATEWAY, KINORA_METRICS, KINORA_QUEST_DATA } from "@/app/lib/constants";
import { useAccount } from "wagmi";

const useMetrics = (dict: any) => {
  const context = useContext(ModalContext);
  const { address } = useAccount();
  const [currentMetricsLoading, setCurrentMetricsLoading] =
    useState<boolean>(false);
  const [metricsLoading, setMetricsLoading] = useState<boolean>(false);
  const [liveMetrics, setLiveMetrics] = useState<VideoActivity | undefined>();
  const [onChainMetrics, setOnChainMetrics] = useState<
    VideoActivity | undefined
  >();
  const kinora = Kinora.getInstance(context?.lensConectado?.apollo as any, {
    uploadEndpoint: `${process.env.NEXT_PUBLIC_BASE_URL}/api/ipfs`,
    gateway: INFURA_GATEWAY,
    headers: {},
  });

  const handleMetricsAdd = async () => {
    if (
      !context?.lensConectado?.profile ||
      !address ||
      !context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]
    )
      return;

    const data = await getPlayerData(context?.lensConectado?.profile?.address);
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
        context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id,
        context?.lensConectado?.profile?.address,
        signer as any,
        KINORA_METRICS,
        KINORA_QUEST_DATA
      );

      if (error) {
        console.error(errorMessage);
        context?.setModalOpen(dict?.wrong);
      } else {
        context?.setModalOpen(dict?.met);

        await handleCurrentMetrics();
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setMetricsLoading(false);
  };

  const handleCurrentMetrics = async () => {
    if (!context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id) {
      setLiveMetrics(undefined);
      return;
    }
    setCurrentMetricsLoading(true);
    const chainMetrics = await getVideoDetails();

    try {
      let currentActivity = {};

      if (!chainMetrics?.hasCommented) {
        currentActivity = {
          ...currentActivity,
          hasCommented:
            context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]
              ?.operations?.hasCommented?.optimistic,
        };
      }

      if (!chainMetrics?.hasQuoted) {
        currentActivity = {
          ...currentActivity,
          hasQuoted:
            context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]
              ?.operations?.hasQuoted?.optimistic,
        };
      }

      if (!chainMetrics?.hasMirrored) {
        currentActivity = {
          ...currentActivity,
          hasMirrored:
            context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]
              ?.operations?.hasReposted?.optimistic,
        };
      }

      if (!chainMetrics?.hasBookmarked) {
        currentActivity = {
          ...currentActivity,
          hasBookmarked:
            context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]
              ?.operations?.hasBookmarked,
        };
      }

      if (!chainMetrics?.hasReacted) {
        currentActivity = {
          ...currentActivity,
          hasReacted:
            context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]
              ?.operations?.hasUpvoted,
        };
      }

      if (context?.lensConectado?.profile?.address) {
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
          context?.lensConectado?.profile?.address,
          context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id
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
    if (!context?.lensConectado?.profile || !context?.clienteLens) return;
    try {
      let post;
      const data = await fetchPost(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          post: context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]
            ?.id,
        }
      );

      if (data?.isOk()) {
        post = data?.value as Post;
      }
      const video = await getVideoActivity(
        context?.lensConectado?.profile?.address,
        context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id
      );
      setOnChainMetrics({
        ...video?.data?.videoActivities[0],
        avd: Number(video?.data?.videoActivities[0]?.avd)
          ? Number(video?.data?.videoActivities[0]?.avd) / 10 ** 18
          : 0,
        duration: Number(video?.data?.videoActivities[0]?.duration)
          ? Number(video?.data?.videoActivities[0]?.duration) / 10 ** 18
          : 0,
        post,
      });
      return {
        ...video?.data?.videoActivities[0],
        avd:
          video?.data?.videoActivities[0]?.avd &&
          Number(video?.data?.videoActivities[0]?.avd) / 10 ** 18,
        duration:
          video?.data?.videoActivities[0]?.duration &&
          Number(video?.data?.videoActivities[0]?.duration) / 10 ** 18,
        post,
      };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getLogs = () => {
    const logs = kinora.getLiveVideoMetrics(
      context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id!
    );
    setLiveMetrics({
      ...(liveMetrics || {}),
      avd: logs.avd,
      duration: logs.duration,
      playCount: logs.playCount,
      totalInteractions: logs.totalInteractions,
    } as VideoActivity);
  };

  useEffect(() => {
    if (
      context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id &&
      liveMetrics !== undefined &&
      context?.metrics
    ) {
      const interval = setInterval(() => {
        getLogs();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [
    context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id,
    liveMetrics,
    context?.metrics,
  ]);

  useEffect(() => {
    if (
      context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id &&
      context?.metrics
    ) {
      handleCurrentMetrics();
    }
  }, [
    context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id,
    context?.metrics,
  ]);

  return {
    handleMetricsAdd,
    metricsLoading,
    liveMetrics,
    onChainMetrics,
    currentMetricsLoading,
  };
};

export default useMetrics;
