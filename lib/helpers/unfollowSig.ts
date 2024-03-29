import { omit } from "lodash";
import LensHubProxy from "./../../abis/LensHubProxy.json";
import { AnyAction, Dispatch } from "redux";
import { WalletClient, PublicClient } from "viem";
import { polygon } from "viem/chains";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import handleIndexCheck from "./handleIndexCheck";
import createUnfollowTypedData from "@/graphql/lens/mutations/unfollow";
import broadcast from "@/graphql/lens/mutations/broadcast";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../constants";

const unfollowSig = async (
  id: string,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient,
  refetchProfile: () => Promise<void>
): Promise<void> => {
  const { data } = await createUnfollowTypedData({
    unfollow: [id],
  });

  const typedData = data?.createUnfollowTypedData.typedData;

  const signature = await clientWallet.signTypedData({
    domain: omit(typedData?.domain, ["__typename"]),
    types: omit(typedData?.types, ["__typename"]),
    primaryType: "Unfollow",
    message: omit(typedData?.value, ["__typename"]),
    account: address as `0x${string}`,
  });

  const broadcastResult = await broadcast({
    id: data?.createUnfollowTypedData?.id,
    signature,
  });

  if (broadcastResult?.data?.broadcastOnchain?.__typename === "RelaySuccess") {
    dispatch(
      setIndexModal({
        actionOpen: true,
        actionMessage: "Indexing Interaction",
      })
    );

    await handleIndexCheck(
      {
        forTxId: broadcastResult?.data?.broadcastOnchain?.txId,
      },
      dispatch
    );
  } else {
    const { request } = await publicClient.simulateContract({
      address: LENS_HUB_PROXY_ADDRESS_MATIC,
      abi: LensHubProxy,
      functionName: "unfollow",
      chain: polygon,
      args: [
        typedData?.value?.unfollowerProfileId,
        typedData?.value?.idsOfProfilesToUnfollow,
      ],
      account: address,
    });
    const res = await clientWallet.writeContract(request);
    await refetchProfile();
    const tx = await publicClient.waitForTransactionReceipt({ hash: res });

    await handleIndexCheck(
      {
        forTxHash: tx.transactionHash,
      },
      dispatch
    );
  }

  setTimeout(() => {
    dispatch(
      setIndexModal({
        actionValue: false,
        actionMessage: undefined,
      })
    );
  }, 3000);
};

export default unfollowSig;
