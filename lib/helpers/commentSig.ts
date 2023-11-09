import { InputMaybe, RelaySuccess } from "@/components/Home/types/generated";
import broadcast from "@/graphql/lens/mutations/broadcast";
import { createCommentTypedData } from "@/graphql/lens/mutations/comment";
import LensHubProxy from "./../../abis/LensHubProxy.json";
import { OpenActionModuleInput } from "@lens-protocol/client";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../constants";
import { omit } from "lodash";
import { polygon } from "viem/chains";
import { PublicClient, WalletClient } from "viem";
import handleIndexCheck from "./handleIndexCheck";
import { AnyAction, Dispatch } from "redux";

const commentSig = async (
  commentOn: string,
  contentURI: string,
  openActionModules: InputMaybe<OpenActionModuleInput[]> | undefined,
  clientWallet: WalletClient,
  publicClient: PublicClient,
  address: `0x${string}`,
  dispatch: Dispatch<AnyAction>,
  clearComment: () => void
) => {
  try {
    const result = await createCommentTypedData({
      commentOn,
      contentURI,
      openActionModules,
    });

    const typedData = result?.data?.createOnchainCommentTypedData.typedData;

    const signature = await clientWallet.signTypedData({
      domain: omit(typedData?.domain, ["__typename"]),
      types: omit(typedData?.types, ["__typename"]),
      primaryType: "Comment",
      message: omit(typedData?.value, ["__typename"]),
      account: address as `0x${string}`,
    });

    const broadcastResult = await broadcast({
      id: result?.data?.createOnchainCommentTypedData?.id,
      signature,
    });

    if (broadcastResult?.data?.broadcastOnchain?.__typename === "RelayError") {

      const { request } = await publicClient.simulateContract({
        address: LENS_HUB_PROXY_ADDRESS_MATIC,
        abi: LensHubProxy,
        functionName: "comment",
        chain: polygon,
        args: [
          {
            profileId: typedData?.value.profileId,
            contentURI: typedData?.value.contentURI,
            pointedProfileId: typedData?.value.pointedProfileId,
            pointedPubId: typedData?.value.pointedPubId,
            referrerProfileIds: typedData?.value.referrerProfileIds,
            referrerPubIds: typedData?.value.referrerPubIds,
            referenceModuleData: typedData?.value.referenceModuleData,
            actionModules: typedData?.value.actionModules,
            actionModulesInitDatas: typedData?.value.actionModulesInitDatas,
            referenceModule: typedData?.value.referenceModule,
            referenceModuleInitData: typedData?.value.referenceModuleInitData,
          },
        ],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      clearComment();
      await publicClient.waitForTransactionReceipt({ hash: res });

      const tx = await publicClient.waitForTransactionReceipt({ hash: res });

      await handleIndexCheck({
        forTxHash: tx.transactionHash,
      }, dispatch);
    } else {
      clearComment();
      setTimeout(async () => {
        await handleIndexCheck(
          (broadcastResult?.data?.broadcastOnchain as RelaySuccess)?.txHash,
          dispatch
        );
      }, 7000);
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default commentSig;
