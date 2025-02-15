import { omit } from "lodash";
import LensHubProxy from "./../../abis/LensHubProxy.json";
import { AnyAction, Dispatch } from "redux";
import { polygon } from "viem/chains";
import { PublicClient, WalletClient } from "viem";
import { mirror } from "@/graphql/lens/mutations/mirror";
import broadcast from "@/graphql/lens/mutations/broadcast";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import handleIndexCheck from "./handleIndexCheck";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../constants";
import { TFunction } from "i18next";

const mirrorSig = async (
  mirrorOn: string,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient,
  t: TFunction<"common", undefined>
): Promise<void> => {
  const data = await mirror({
    mirrorOn,
  });

  const typedData = data?.data?.createOnchainMirrorTypedData?.typedData;

  const signature = await clientWallet.signTypedData({
    domain: omit(typedData?.domain, ["__typename"]),
    types: omit(typedData?.types, ["__typename"]),
    primaryType: "Mirror",
    message: omit(typedData?.value, ["__typename"]),
    account: address as `0x${string}`,
  });

  const broadcastResult = await broadcast({
    id: data?.data?.createOnchainMirrorTypedData?.id,
    signature,
  });

  if (broadcastResult?.data?.broadcastOnchain?.__typename === "RelaySuccess") {
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: t("index"),
      })
    );
    await handleIndexCheck(
      {
        forTxId: broadcastResult?.data?.broadcastOnchain?.txId,
      },
      dispatch,
      t
    );
  } else {
    const { request } = await publicClient.simulateContract({
      address: LENS_HUB_PROXY_ADDRESS_MATIC,
      abi: LensHubProxy,
      functionName: "mirror",
      chain: polygon,
      args: [
        {
          profileId: typedData?.value.profileId,
          metadataURI: typedData?.value.metadataURI,
          pointedProfileId: typedData?.value.pointedProfileId,
          pointedPubId: typedData?.value.pointedPubId,
          referrerProfileIds: typedData?.value.referrerProfileIds,
          referrerPubIds: typedData?.value.referrerPubIds,
          referenceModuleData: typedData?.value.referenceModuleData,
        },
      ],
      account: address,
    });
    const res = await clientWallet.writeContract(request);
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: t("index"),
      })
    );
    const tx = await publicClient.waitForTransactionReceipt({ hash: res });
    await handleIndexCheck(
      {
        forTxHash: tx.transactionHash,
      },
      dispatch,
      t
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

export default mirrorSig;
