import { useContext, useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { ethers } from "ethers-v5";
import { Dispatch } from "kinora-sdk";
import { ModalContext } from "@/app/providers";
import { useAccount } from "wagmi";
import { Quest } from "../types/modals.types";
import { chains } from "@lens-chain/sdk/viem";
import {
  getQuestById,
  getQuestVideos,
} from "../../../../../graph/queries/getQuests";
import checkGates from "@/app/lib/helpers/checkGates";

const useQuests = (dict: any) => {
  const context = useContext(ModalContext);
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: chains.mainnet,
    transport: http(`https://rpc.lens.xyz`),
  });
  const kinoraDispatch = new Dispatch({
    playerAuthedApolloClient: context?.lensConectado?.apollo as any,
  });
  const [questsLoading, setQuestsLoading] = useState<boolean>(false);
  const [allVideoQuests, setAllVideoQuests] = useState<Quest[]>([]);
  const [joinLoading, setJoinLoading] = useState<boolean[]>([]);

  const handleJoinQuest = async (quest: Quest) => {
    if (!context?.lensConectado?.profile || !address) return;
    const index = allVideoQuests?.findIndex(
      (ques) => ques?.questId == quest?.questId
    );
    setJoinLoading((prev) => {
      const arr = [...prev];
      arr[index] = true;
      return arr;
    });
    try {
      const data = await checkGates(quest?.gate!, publicClient, address!);

      if (
        (data?.erc20 && data?.erc20?.length > 0) ||
        (data?.erc721 && data?.erc721?.length > 0)
      ) {
        setJoinLoading((prev) => {
          const arr = [...prev];
          arr[index] = false;
          return arr;
        });

        context?.setGates({
          erc20: data?.erc20,
          erc721: data?.erc721,
          oneOf: quest?.gate?.oneOf,
        });
        return;
      }

      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        137
      );
      const signer = provider.getSigner();

      const { error, errorMessage } = await kinoraDispatch.playerJoinQuest(
        quest?.postId,
        signer as any
      );

      if (error) {
        console.error(errorMessage);
        context?.setModalOpen(dict?.wrong);
      } else {
        context?.setQuestSuccess(
          quest?.questMetadata?.cover?.includes("ipfs://")
            ? quest?.questMetadata?.cover?.split("ipfs://")?.[1]
            : quest?.questMetadata?.cover
        );

        context?.setQuest(undefined);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setJoinLoading((prev) => {
      const arr = [...prev];
      arr[index] = false;
      return arr;
    });
  };

  const getQuests = async () => {
    setQuestsLoading(true);
    try {
      const videos = await getQuestVideos(context?.quest?.id!);

      const videoPromises = videos?.data?.videos
        .filter(
          (v: { questId: string }, i: number, arr: { questId: string }[]) =>
            arr.findIndex(
              (t: { questId: string }) => t.questId === v.questId
            ) === i
        )
        ?.map(async (video: { questId: string }) => {
          const data = await getQuestById(video?.questId);

          return data?.data?.questInstantiateds?.[0];
        });

      setAllVideoQuests(await Promise.all(videoPromises));
    } catch (err: any) {
      console.error(err.message);
    }
    setQuestsLoading(false);
  };

  useEffect(() => {
    if (context?.quest) {
      getQuests();
    } else {
      setAllVideoQuests([]);
    }
  }, [context?.quest]);

  return {
    questsLoading,
    allVideoQuests,
    handleJoinQuest,
    joinLoading,
  };
};

export default useQuests;
