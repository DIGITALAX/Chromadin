import {
  Profile,
  ProfileQuery,
  RelaySuccess,
  ApprovalAllowance,
} from "@/components/Home/types/generated";
import broadcast from "@/graphql/lens/mutations/broadcast";
import createFollowTypedData from "@/graphql/lens/mutations/follow";
import {
  getOneProfileAuth,
  getOneProfile,
} from "@/graphql/lens/queries/getProfile";
import checkApproved from "@/lib/helpers/checkApproved";
import handleIndexCheck from "@/lib/helpers/handleIndexCheck";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { RootState } from "@/redux/store";
import { splitSignature } from "ethers/lib/utils.js";
import { omit } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "@/lib/constants";
import LensHubProxy from "./../../../../abis/LensHubProxy.json";
import createFollowModule from "@/lib/helpers/createFollowModule";
import { setLensProfile } from "@/redux/reducers/lensProfileSlice";
import getDefaultProfile from "@/graphql/lens/queries/getDefaultProfile";
import { setModal } from "@/redux/reducers/modalSlice";
import { setFollowerOnly } from "@/redux/reducers/followerOnlySlice";
import pollUntilIndexed from "@/graphql/lens/queries/checkIndexed";
import createUnfollowTypedData from "@/graphql/lens/mutations/unfollow";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygon } from "viem/chains";
import { FetchResult } from "@apollo/client";

const useFollowers = () => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const dispatch = useDispatch();
  const { address } = useAccount();
  const [profile, setProfile] = useState<Profile | undefined>();
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const followerId = useSelector(
    (state: RootState) => state.app.followerOnlyReducer
  );
  const approvalArgs = useSelector(
    (state: RootState) => state.app.approvalArgsReducer.args
  );
  const [approved, setApproved] = useState<boolean>(false);
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );

  const getProfile = async (): Promise<void> => {
    try {
      let prof: FetchResult<ProfileQuery>;
      if (profileId) {
        prof = await getOneProfileAuth({
          forProfileId: followerId?.followerId,
        });
      } else {
        prof = await getOneProfile({
          forProfileId: followerId?.followerId,
        });
      }

      setProfile(prof?.data?.profile as Profile);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const approvedFollow = async (): Promise<void> => {
    const approvalData: ApprovalAllowance | void = await checkApproved(
      (profile?.followModule as any)?.amount?.asset?.address,
      null,
      (profile?.followModule as any)?.type,
      null,
      (profile?.followModule as any)?.amount?.value,
      dispatch,
      address,
      profileId
    );
    const isApproved = parseInt(approvalData?.allowance?.value as string, 16);
    setApproved(
      isApproved > (profile?.followModule as any)?.amount?.value ? true : false
    );
  };

  const callApprovalSign = async (): Promise<void> => {
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const res = await clientWallet.sendTransaction({
        to: approvalArgs?.to as `0x${string}`,
        account: approvalArgs?.from as `0x${string}`,
        value: BigInt(approvalArgs?.data as string),
      });
      await publicClient.waitForTransactionReceipt({ hash: res });
      await pollUntilIndexed({
        forTxHash: res,
      });
      await approvedFollow();
    } catch (err: any) {
      setFollowLoading(false);
      console.error(err.message);
    }
  };

  const approveCurrency = async (): Promise<void> => {
    setFollowLoading(true);
    try {
      await callApprovalSign();
    } catch (err: any) {
      console.error(err.message);
    }
    setFollowLoading(false);
  };

  const followProfile = async (): Promise<void> => {
    if (!profileId) {
      return;
    }

    setFollowLoading(true);

    const followModule = createFollowModule(
      profile?.followModule?.type as any,
      (profile?.followModule as any)?.amount?.value,
      (profile?.followModule as any)?.amount?.asset?.address,
      profile?.ownedBy?.address
    );

    try {
      const response = await createFollowTypedData({
        follow: [{ profileId: profile?.id, followModule }],
      });

      const typedData = response?.data?.createFollowTypedData?.typedData;

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const signature = await clientWallet.signTypedData({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]),
        primaryType: "Follow",
        message: omit(typedData?.value, ["__typename"]),
        account: address as `0x${string}`,
      });

      const broadcastResult = await broadcast({
        id: response?.data?.createFollowTypedData?.id,
        signature,
      });

      if (
        broadcastResult?.data?.broadcastOnchain?.__typename === "RelayError"
      ) {
        const { v, r, s } = splitSignature(signature);
        const { request } = await publicClient.simulateContract({
          address: LENS_HUB_PROXY_ADDRESS_MATIC,
          abi: LensHubProxy,
          functionName: "followWithSig",
          chain: polygon,
          args: [
            {
              followTokenIds: typedData?.value?.followTokenIds,
              followerProfileId: typedData?.value?.followerProfileId,
              idsOfProfilesToFollow: typedData?.value?.idsOfProfilesToFollow,
              datas: typedData?.value?.datas,
              sig: {
                v,
                r,
                s,
                deadline: typedData?.value?.deadline,
              },
            },
          ],
          account: address,
        });
        const res = await clientWallet.writeContract(request);
        clearFollow();
        await publicClient.waitForTransactionReceipt({ hash: res });

        await handleIndexCheck(res, dispatch);
        await refetchProfile();
      } else {
        clearFollow();
        setFollowLoading(false);
        setTimeout(async () => {
          await handleIndexCheck(
            (broadcastResult?.data?.broadcastOnchain as RelaySuccess)?.txHash,
            dispatch
          );
          await refetchProfile();
        }, 7000);
      }
    } catch (err: any) {
      setFollowLoading(false);
      if (err.message.includes("You do not have enough")) {
        dispatch(
          setModal({
            actionOpen: true,
            actionMessage: "Insufficient Balance to Follow.",
          })
        );
      } else {
        dispatch(setIndexModal("Unsuccessful. Please Try Again."));
      }
      console.error(err.message);
    }
  };

  const unfollowProfile = async () => {
    if (!profileId) {
      return;
    }

    setFollowLoading(true);

    try {
      const response = await createUnfollowTypedData({
        unfollow: [profileId],
      });

      const typedData = response?.data?.createUnfollowTypedData.typedData;

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const signature = await clientWallet.signTypedData({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]),
        primaryType: "Unfollow",
        message: omit(typedData?.value, ["__typename"]),
        account: address as `0x${string}`,
      });

      const broadcastResult = await broadcast({
        id: response?.data?.createUnfollowTypedData?.id,
        signature,
      });
      if (broadcastResult?.data?.broadcastOnchain?.__typename == "RelayError") {
        const { v, r, s } = splitSignature(signature);
        const { request } = await publicClient.simulateContract({
          address: LENS_HUB_PROXY_ADDRESS_MATIC,
          abi: LensHubProxy,
          functionName: "unfollowWithSig",
          chain: polygon,
          args: [
            {
              unfollowerProfileId: typedData?.value?.unfollowerProfileId,
              idsOfProfilesToUnfollow:
                typedData?.value?.idsOfProfilesToUnfollow,
              sig: {
                v,
                r,
                s,
                deadline: typedData?.value?.deadline,
              },
            },
          ],
          account: address,
        });
        const res = await clientWallet.writeContract(request);
        clearFollow();
        await publicClient.waitForTransactionReceipt({ hash: res });

        await handleIndexCheck(res, dispatch);
        await refetchProfile();
      } else {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Indexing Interaction",
          })
        );
        setTimeout(async () => {
          await handleIndexCheck(
            (broadcastResult?.data?.broadcastOnchain as RelaySuccess)?.txHash,
            dispatch
          );
          await refetchProfile();
        }, 7000);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setFollowLoading(false);
  };

  const refetchProfile = async (): Promise<void> => {
    try {
      const profile = await getDefaultProfile({
        for: address,
      });
      dispatch(setLensProfile(profile?.data?.defaultProfile as Profile));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const clearFollow = () => {
    dispatch(
      setFollowerOnly({
        actionOpen: false,
        actionFollowerId: "",
        actionId: "",
        actionIndex: undefined,
      })
    );
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Indexing Interaction",
      })
    );
  };

  useEffect(() => {
    if (followerId.open) {
      getProfile();
      if (profile?.followModule?.type === "FeeFollowModule") {
        approvedFollow();
      }
    }
  }, [followerId.open]);

  return {
    profile,
    followProfile,
    followLoading,
    approved,
    approveCurrency,
    unfollowProfile,
  };
};

export default useFollowers;
