import { omit } from "lodash";
import LensHubProxy from "./../../abis/LensHubProxy.json";
import { AnyAction, Dispatch } from "redux";
import { WalletClient, PublicClient } from "viem";
import { polygon } from "viem/chains";
import { FetchResult } from "@apollo/client";
import { BroadcastOnchainMutation } from "@/components/Home/types/generated";
import collect, { legacyCollectPost } from "@/graphql/lens/mutations/collect";
import broadcast from "@/graphql/lens/mutations/broadcast";
import handleIndexCheck from "./handleIndexCheck";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../constants";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { TFunction } from "i18next";

const collectSig = async (
  id: string,
  type: string,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient,
  t: TFunction<"common", undefined>
): Promise<void> => {
  let broadcastResult: FetchResult<BroadcastOnchainMutation>,
    functionName: string,
    args: any[];

  if (
    type === "SimpleCollectOpenActionSettings" ||
    type === "MultirecipientFeeCollectOpenActionSettings" ||
    type === "SimpleCollectOpenActionModule" ||
    type === "MultirecipientFeeCollectOpenActionModule"
  ) {
    const datos = await collect({
      for: id,
      actOn: {
        simpleCollectOpenAction:
          type === "SimpleCollectOpenActionSettings" ||
          type === "SimpleCollectOpenActionModule"
            ? true
            : undefined,
        multirecipientCollectOpenAction:
          type === "MultirecipientFeeCollectOpenActionSettings" ||
          type === "MultirecipientFeeCollectOpenActionModule"
            ? true
            : undefined,
      },
    });

    const typedData = datos?.data?.createActOnOpenActionTypedData.typedData;

    const signature = await clientWallet.signTypedData({
      domain: omit(typedData?.domain, ["__typename"]),
      types: omit(typedData?.types, ["__typename"]),
      primaryType: "Act",
      message: omit(typedData?.value, ["__typename"]),
      account: address as `0x${string}`,
    });

    broadcastResult = await broadcast({
      id: datos?.data?.createActOnOpenActionTypedData?.id,
      signature,
    });
    functionName = "act";
    args = [
      {
        publicationActedProfileId: typedData?.value.publicationActedProfileId,
        publicationActedId: typedData?.value.publicationActedId,
        actorProfileId: typedData?.value.actorProfileId,
        referrerProfileIds: typedData?.value.referrerProfileIds,
        referrerPubIds: typedData?.value.referrerPubIds,
        actionModuleAddress: typedData?.value.actionModuleAddress,
        actionModuleData: typedData?.value.actionModuleData,
      },
    ];
  } else {
    const datos = await legacyCollectPost({
      on: id,
    });

    const typedData = datos?.data?.createLegacyCollectTypedData.typedData;

    const signature = await clientWallet.signTypedData({
      domain: omit(typedData?.domain, ["__typename"]),
      types: omit(typedData?.types, ["__typename"]),
      primaryType: "CollectLegacy",
      message: omit(typedData?.value, ["__typename"]),
      account: address as `0x${string}`,
    });

    broadcastResult = await broadcast({
      id: datos?.data?.createLegacyCollectTypedData?.id,
      signature,
    });

    functionName = "collectLegacy";
    args = [
      {
        publicationCollectedProfileId:
          typedData?.value.publicationCollectedProfileId,
        publicationCollectedId: typedData?.value.publicationCollectedId,
        collectorProfileId: typedData?.value.collectorProfileId,
        referrerProfileId: typedData?.value.referrerProfileId,
        referrerPubId: typedData?.value.referrerPubId,
        collectModuleData: typedData?.value.collectModuleData,
      },
    ];
  }

  if (broadcastResult?.data?.broadcastOnchain?.__typename === "RelaySuccess") {
    await handleIndexCheck(
      {
        forTxId: broadcastResult?.data?.broadcastOnchain.txId,
      },
      dispatch,
      t
    );
  } else {
    const { request } = await publicClient.simulateContract({
      address: LENS_HUB_PROXY_ADDRESS_MATIC,
      abi: LensHubProxy,
      functionName,
      chain: polygon,
      args,
      account: address,
    });
    const res = await clientWallet.writeContract(request);
    const tx = await publicClient.waitForTransactionReceipt({ hash: res });
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: t("index"),
      })
    );

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

export default collectSig;
