import { Follow, RelaySuccess } from "@/components/Home/types/generated";
import broadcast from "@/graphql/lens/mutations/broadcast";
import LensHubProxy from "./../../abis/LensHubProxy.json";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../constants";
import { omit } from "lodash";
import { AnyAction, Dispatch } from "redux";
import { PublicClient, WalletClient } from "viem";
import { polygon } from "viem/chains";
import handleIndexCheck from "./handleIndexCheck";
import createFollowTypedData from "@/graphql/lens/mutations/follow";
import { TFunction } from "i18next";

const followSig = async (
  follow: Follow[],
  clientWallet: WalletClient,
  publicClient: PublicClient,
  address: `0x${string}`,
  dispatch: Dispatch<AnyAction>,
  t: TFunction<"common", undefined>,
  setFollowLoading?: (e: boolean) => void,
  clearFollow?: () => void,
  refetchProfile?: () => Promise<void>
) => {
  try {
    const response = await createFollowTypedData({
      follow,
    });

    const typedData = response?.data?.createFollowTypedData?.typedData;

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

    if (broadcastResult?.data?.broadcastOnchain?.__typename === "RelayError") {
      const { request } = await publicClient.simulateContract({
        address: LENS_HUB_PROXY_ADDRESS_MATIC,
        abi: LensHubProxy,
        functionName: "follow",
        chain: polygon,
        args: [
          typedData?.value?.followerProfileId,
          typedData?.value?.idsOfProfilesToFollow,
          typedData?.value?.followTokenIds,
          typedData?.value?.datas,
        ],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      clearFollow && clearFollow();
      const tx = await publicClient.waitForTransactionReceipt({ hash: res });

      await handleIndexCheck(
        {
          forTxHash: tx.transactionHash,
        },
        dispatch,
        t
      );
      refetchProfile && (await refetchProfile());
    } else {
      clearFollow && clearFollow();
      setFollowLoading && setFollowLoading(false);
      setTimeout(async () => {
        await handleIndexCheck(
          (broadcastResult?.data?.broadcastOnchain as RelaySuccess)?.txHash,
          dispatch,
          t
        );
        refetchProfile && (await refetchProfile());
      }, 7000);
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default followSig;
