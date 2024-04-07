import { LENS_CREATORS } from "@/lib/constants";
import createFollowModule from "@/lib/helpers/createFollowModule";
import { setModal } from "@/redux/reducers/modalSlice";
import { useState } from "react";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import { Profile } from "@/components/Home/types/generated";
import followSig from "@/lib/helpers/followSig";
import { AnyAction, Dispatch } from "redux";
import refetchProfile from "@/lib/helpers/refetchProfile";
import { TFunction } from "i18next";

const useSuperCreator = (
  publicClient: PublicClient,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}` | undefined,
  quickProfiles: Profile[],
  lensProfile: Profile | undefined,
  t: TFunction<"common", undefined>
) => {
  const [superCreatorLoading, setSuperCreatorLoading] =
    useState<boolean>(false);
  const [followedSuper, setFollowedSuper] = useState<boolean>(false);
  const followSuper = async () => {
    setSuperCreatorLoading(true);

    const batchSize = 15;
    const numBatches = Math.ceil(LENS_CREATORS.length / batchSize);
    for (let batchIndex = 0; batchIndex < numBatches; batchIndex++) {
      const batchStart = batchIndex * batchSize;
      const batchEnd = Math.min(
        LENS_CREATORS.length,
        (batchIndex + 1) * batchSize
      );
      let followers = [];

      for (let i = batchStart; i < batchEnd; i++) {
        if (!quickProfiles[i]?.operations?.isFollowedByMe?.value) {
          const followModule = createFollowModule(
            quickProfiles[i]?.followModule?.type as any,
            (quickProfiles[i]?.followModule as any)?.amount?.value,
            (quickProfiles[i]?.followModule as any)?.amount?.asset?.address
          );

          followers.push({
            profileId: LENS_CREATORS[i],
            followModule,
          });
        }
      }

      if (followers?.length < 1) {
        setFollowedSuper(true);
        setSuperCreatorLoading(false);
        return;
      }

      try {
        const clientWallet = createWalletClient({
          chain: polygon,
          transport: custom((window as any).ethereum),
        });

        await followSig(
          followers,
          clientWallet,
          publicClient,
          address as `0x${string}`,
          dispatch
        );

        await refetchProfile(dispatch, lensProfile?.id);
        setFollowedSuper(true);
      } catch (err: any) {
        if (err.message.includes("You do not have enough")) {
          dispatch(
            setModal({
              actionOpen: true,
              actionMessage: t("bal"),
            })
          );
        } else {
          dispatch(
            setIndexModal({
              actionValue: true,
              actionMessage: t("un"),
            })
          );
        }
        console.error(err.message);
      }
    }
    setSuperCreatorLoading(false);
  };
  return { superCreatorLoading, followSuper, followedSuper };
};

export default useSuperCreator;
