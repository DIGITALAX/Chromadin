import { AnyAction, Dispatch } from "redux";
import { omit } from "lodash";
import { WalletClient, PublicClient } from "viem";
import { polygon } from "viem/chains";
import broadcast from "@/graphql/lens/mutations/broadcast";
import handleIndexCheck from "./handleIndexCheck";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../constants";
import LensHubProxy from "../../abis/LensHubProxy.json";
import { setError } from "@/redux/reducers/errorSlice";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import collect from "@/graphql/lens/mutations/collect";
import { ActOnOpenActionInput } from "@/components/Home/types/generated";
import { TFunction } from "i18next";

const actSig = async (
  pubId: string,
  actOn: ActOnOpenActionInput,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient,
  t: TFunction<"common", undefined>
): Promise<boolean | void> => {
  try {
    const { data } = await collect({
      for: pubId,
      actOn,
    });

    const typedData = data?.createActOnOpenActionTypedData.typedData;

    const signature = await clientWallet.signTypedData({
      domain: omit(typedData?.domain, ["__typename"]),
      types: omit(typedData?.types, ["__typename"]),
      primaryType: "Act",
      message: omit(typedData?.value, ["__typename"]),
      account: address as `0x${string}`,
    });

    const broadcastResult = await broadcast({
      id: data?.createActOnOpenActionTypedData?.id,
      signature,
    });

    if (
      broadcastResult?.data?.broadcastOnchain?.__typename === "RelaySuccess"
    ) {
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
        functionName: "act",
        chain: polygon,
        args: [
          {
            publicationActedProfileId: parseInt(
              typedData?.value.publicationActedProfileId,
              16
            ),
            publicationActedId: parseInt(
              typedData?.value.publicationActedId,
              16
            ),
            actorProfileId: parseInt(typedData?.value.actorProfileId, 16),
            referrerProfileIds: typedData?.value.referrerProfileIds,
            referrerPubIds: typedData?.value.referrerPubIds,
            actionModuleAddress: typedData?.value.actionModuleAddress,
            actionModuleData: typedData?.value.actionModuleData,
          },
        ],
        account: address,
      });

      const res = await clientWallet.writeContract(request);
      const tx = await publicClient.waitForTransactionReceipt({ hash: res });

      dispatch(
        setIndexModal({
          actionOpen: true,
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

      dispatch(
        setIndexModal({
          actionOpen: false,
          actionMessage: undefined,
        })
      );
    }
    return true;
  } catch (err: any) {
    dispatch(setError(true));
    console.error(err.message);
  }
};

export default actSig;
