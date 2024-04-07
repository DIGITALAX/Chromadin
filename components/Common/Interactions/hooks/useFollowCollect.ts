import {
  FeeFollowModuleSettings,
  Profile,
} from "@/components/Home/types/generated";
import { useEffect, useState } from "react";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import { AnyAction, Dispatch } from "redux";
import isApprovedData from "@/graphql/lens/queries/isApprovedData";
import { PostCollectGifState } from "@/redux/reducers/postCollectGifSlice";
import followSig from "@/lib/helpers/followSig";
import findBalance from "@/lib/helpers/findBalance";
import { setError } from "@/redux/reducers/errorSlice";
import {
  FollowCollectState,
  setFollowCollect,
} from "@/redux/reducers/followCollectSlice";
import refetchProfile from "@/lib/helpers/refetchProfile";
import collectSig from "@/lib/helpers/collectSig";
import currencyApprove from "@/graphql/lens/mutations/approve";
import unfollowSig from "@/lib/helpers/unfollowSig";
import { TFunction } from "i18next";

const useFollowCollect = (
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}` | undefined,
  publicClient: PublicClient,
  postCollectGif: PostCollectGifState,
  lensConnected: Profile | undefined,
  followCollect: FollowCollectState,
  t: TFunction<"common", undefined>
) => {
  const [transactionLoading, setTransactionLoading] = useState<boolean>(false);
  const [informationLoading, setInformationLoading] = useState<boolean>(false);
  const [gifsLoading, setGifsLoading] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [openMeasure, setOpenMeasure] = useState<{
    searchedGifs: string[];
    search: string;
    award: string;
    whoCollectsOpen: boolean;
    creatorAwardOpen: boolean;
    currencyOpen: boolean;
    editionOpen: boolean;
    edition: string;
    timeOpen: boolean;
    time: string;
  }>({
    searchedGifs: [],
    search: "",
    award: "No",
    whoCollectsOpen: false,
    creatorAwardOpen: false,
    currencyOpen: false,
    editionOpen: false,
    edition: "",
    timeOpen: false,
    time: "",
  });

  const handleGif = async (search: string) => {
    try {
      setGifsLoading(true);
      const response = await fetch("/api/giphy", {
        method: "POST",
        body: search,
      });
      const allGifs = await response.json();
      setOpenMeasure((prev) => ({
        ...prev,
        searchedGifs: allGifs?.json?.results,
      }));
      setGifsLoading(false);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleUnfollow = async () => {
    if (!lensConnected?.id) return;
    setTransactionLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await unfollowSig(
        followCollect?.follower?.id,
        dispatch,
        address!,
        clientWallet,
        publicClient,
        () => refetchProfile(dispatch, lensConnected?.id),
        t
      );

      if (
        followCollect?.type === "collect" &&
        followCollect?.collect?.item?.followerOnly
      ) {
        dispatch(
          setFollowCollect({
            actionType: "collect",
            actionCollect: {
              id: followCollect?.collect?.id,
              stats: followCollect?.collect?.stats,
              item: followCollect?.collect?.item,
            },
            actionFollower: {
              ...followCollect?.follower,
              operations: {
                ...followCollect?.follower?.operations,
                isFollowedByMe: {
                  ...followCollect?.follower?.operations?.isFollowedByMe,
                  value: true,
                },
              },
            },
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setTransactionLoading(false);
  };

  const handleFollow = async () => {
    if (!lensConnected?.id) return;
    setTransactionLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await followSig(
        [
          {
            profileId:
              (followCollect?.type === "collect" &&
                !followCollect?.collect?.item?.followerOnly) ||
              (followCollect?.type === "collect" &&
                followCollect?.collect?.item?.followerOnly &&
                followCollect?.follower?.operations?.isFollowedByMe?.value)
                ? followCollect?.collect?.id
                : followCollect?.follower?.id,
            followModule:
              followCollect?.follower?.followModule?.__typename ==
              "FeeFollowModuleSettings"
                ? {
                    feeFollowModule: {
                      amount: {
                        currency: (
                          followCollect?.follower
                            ?.followModule as FeeFollowModuleSettings
                        )?.amount?.asset?.contract?.address,
                        value: (
                          followCollect?.follower
                            ?.followModule as FeeFollowModuleSettings
                        )?.amount?.value,
                      },
                    },
                  }
                : undefined,
          },
        ],
        clientWallet,
        publicClient,
        address!,
        dispatch,
        t,
        () => refetchProfile(dispatch, lensConnected?.id)
      );

      if (
        followCollect?.type === "collect" &&
        followCollect?.collect?.item?.followerOnly
      ) {
        dispatch(
          setFollowCollect({
            actionType: "collect",
            actionCollect: {
              id: followCollect?.collect?.id,
              stats: followCollect?.collect?.stats,
              item: followCollect?.collect?.item,
            },
            actionFollower: {
              ...followCollect?.follower,
              operations: {
                ...followCollect?.follower?.operations,
                isFollowedByMe: {
                  ...followCollect?.follower?.operations?.isFollowedByMe,
                  value: true,
                },
              },
            },
          })
        );
      } else {
        dispatch(
          setFollowCollect({
            actionType: undefined,
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setTransactionLoading(false);
  };

  const handleCollect = async () => {
    if (
      followCollect?.type === "collect" &&
      Number(followCollect?.collect?.item?.collectLimit) ==
        Number(followCollect?.collect?.stats) &&
      Number(followCollect?.collect?.item?.collectLimit || 0) > 0
    )
      return;
    if (!lensConnected?.id) return;

    const balance = await findBalance(
      publicClient,
      followCollect?.type === "collect"
        ? followCollect?.collect?.item?.amount?.asset?.contract?.address
        : (followCollect?.follower?.followModule as FeeFollowModuleSettings)
            ?.amount?.asset?.contract?.address,
      address as `0x${string}`
    );

    if (
      Number(balance) <
      Number(
        followCollect?.type === "collect"
          ? followCollect?.collect?.item?.amount?.value
          : (followCollect?.follower?.followModule as FeeFollowModuleSettings)
              ?.amount?.value
      )
    ) {
      dispatch(setError(true));
      return;
    }

    setTransactionLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await collectSig(
        followCollect?.type === "collect"
          ? followCollect?.collect?.id
          : followCollect?.follower?.id,
        followCollect?.collect?.item?.__typename!,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient,
        t
      );

      dispatch(
        setFollowCollect({
          actionType: undefined,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setTransactionLoading(false);
  };

  const approveSpend = async () => {
    setTransactionLoading(true);
    try {
      const { data } = await currencyApprove({
        allowance: {
          currency:
            followCollect?.type === "collect"
              ? followCollect?.collect?.item?.amount?.asset.contract.address!
              : (
                  followCollect?.follower
                    ?.followModule as FeeFollowModuleSettings
                )?.amount.asset.contract.address!,
          value:
            followCollect?.type === "collect"
              ? followCollect?.collect?.item?.amount?.value!
              : (
                  followCollect?.follower
                    ?.followModule as FeeFollowModuleSettings
                )?.amount.value!,
        },
        module: {
          openActionModule:
            (followCollect?.type === "collect" &&
              !followCollect?.collect?.item?.followerOnly) ||
            (followCollect?.type === "collect" &&
              followCollect?.collect?.item?.followerOnly &&
              followCollect?.follower?.operations?.isFollowedByMe?.value)
              ? followCollect?.collect?.item?.type
              : undefined,
          followModule:
            (followCollect?.type === "collect" &&
              followCollect?.collect?.item?.followerOnly &&
              !followCollect?.follower?.operations?.isFollowedByMe?.value) ||
            followCollect?.type === "follow"
              ? followCollect?.follower?.followModule?.type
              : undefined,
        },
      });

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const res = await clientWallet.sendTransaction({
        to: data?.generateModuleCurrencyApprovalData?.to as `0x${string}`,
        account: data?.generateModuleCurrencyApprovalData
          ?.from as `0x${string}`,
        data: data?.generateModuleCurrencyApprovalData?.data,
        value: BigInt("0"),
      });
      await publicClient.waitForTransactionReceipt({ hash: res });
      setApproved(true);
    } catch (err: any) {
      console.error(err.message);
    }
    setTransactionLoading(false);
  };

  const checkCurrencyApproved = async () => {
    if (!lensConnected?.id) return;
    setInformationLoading(true);
    try {
      const { data } = await isApprovedData({
        currencies:
          followCollect?.type === "collect"
            ? [followCollect?.collect?.item?.amount?.asset.contract.address]
            : [
                (
                  followCollect?.follower
                    ?.followModule as FeeFollowModuleSettings
                )?.amount.asset.contract.address,
              ],
      });
      if (data && data.approvedModuleAllowanceAmount?.[0]) {
        parseInt(data.approvedModuleAllowanceAmount?.[0].allowance.value) >
        (followCollect?.type === "collect"
          ? parseInt(followCollect?.collect?.item?.amount?.value || "")
          : parseInt(
              (followCollect?.follower?.followModule as FeeFollowModuleSettings)
                ?.amount.value || ""
            ))
          ? setApproved(true)
          : setApproved(false);
      } else {
        setApproved(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setInformationLoading(false);
  };

  useEffect(() => {
    if (
      (followCollect.type === "collect" &&
        followCollect?.follower?.followModule?.__typename ==
          "FeeFollowModuleSettings") ||
      (followCollect.type === "follow" &&
        followCollect?.follower?.followModule?.__typename ==
          "FeeFollowModuleSettings") ||
      (followCollect?.type === "collect" &&
        Number(followCollect?.collect?.item?.amount?.value) > 0)
    ) {
      checkCurrencyApproved();
    }
  }, [followCollect.type]);

  useEffect(() => {
    if (postCollectGif?.type) {
      if (postCollectGif.collectTypes?.[postCollectGif?.id!]) {
        setOpenMeasure((prev) => ({
          ...prev,
          award:
            postCollectGif.collectTypes?.[postCollectGif?.id!]?.amount?.value ||
            Number(
              postCollectGif.collectTypes?.[postCollectGif?.id!]?.amount?.value
            )
              ? "Yes"
              : "No",
          whoCollectsOpen: false,
          creatorAwardOpen: false,
          currencyOpen: false,
          editionOpen: false,
          edition: postCollectGif.collectTypes?.[postCollectGif?.id!]
            ?.collectLimit
            ? "Yes"
            : "No",
          timeOpen: false,
          time: postCollectGif.collectTypes?.[postCollectGif?.id!]?.endsAt
            ? "Yes"
            : "No",
        }));
      }
    }
  }, [postCollectGif?.type]);

  return {
    approved,
    transactionLoading,
    informationLoading,
    handleCollect,
    handleFollow,
    approveSpend,
    openMeasure,
    setOpenMeasure,
    handleGif,
    gifsLoading,
    handleUnfollow,
  };
};

export default useFollowCollect;
