import { QuestState, setQuestRedux } from "@/redux/reducers/questSlice";
import { useEffect, useState } from "react";
import { Quest } from "../types/controls.types";
import {
  getQuestById,
  getQuestVideos,
} from "@/graphql/subgraph/queries/getQuests";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { Profile } from "@/components/Home/types/generated";
import { Dispatch } from "redux";
import checkGates from "@/lib/helpers/checkGates";
import { PublicClient } from "viem";
import { ethers } from "ethers";
import toHexWithLeadingZero from "@/lib/helpers/leadingZero";
import { Dispatch as KinoraDispatch } from "kinora-sdk";
import { setQuestGates } from "@/redux/reducers/questGatesSlice";
import { setModal } from "@/redux/reducers/modalSlice";
import { setQuestSuccess } from "@/redux/reducers/questSuccessSlice";

const useQuests = (
  quests: QuestState,
  lensProfile: Profile | undefined,
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  kinoraDispatch: KinoraDispatch
) => {
  const [questsLoading, setQuestsLoading] = useState<boolean>(false);
  const [allVideoQuests, setAllVideoQuests] = useState<Quest[]>([]);
  const [joinLoading, setJoinLoading] = useState<boolean[]>([]);

  const handleJoinQuest = async (quest: Quest) => {
    if (!lensProfile?.id || !address) return;
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

        dispatch(
          setQuestGates({
            erc20: data?.erc20,
            erc721: data?.erc721,
            oneOf: quest?.gate?.oneOf,
          })
        );
        return;
      }

      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        137
      );
      const signer = provider.getSigner();

      const { error, errorMessage } = await kinoraDispatch.playerJoinQuest(
        `${toHexWithLeadingZero(
          Number(quest?.profileId)
        )}-${toHexWithLeadingZero(Number(quest?.pubId))}` as `0x${string}`,
        signer as any
      );

      if (error) {
        console.error(errorMessage);
        dispatch(
          setModal({
            actionOpen: true,
            actionMessage: "Something went wrong. Try again?",
          })
        );
      } else {
        dispatch(
          setQuestSuccess({
            actionOpen: true,
            actionImage: quest?.questMetadata?.cover?.includes("ipfs://")
              ? quest?.questMetadata?.cover?.split("ipfs://")?.[1]
              : quest?.questMetadata?.cover,
          })
        );

        dispatch(
          setQuestRedux({
            actionOpen: false,
          })
        );
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
      const videos = await getQuestVideos(
        parseInt(quests?.video?.id?.split("-")?.[1], 16),
        parseInt(quests?.video?.id?.split("-")?.[0], 16)
      );

      const videoPromises = videos?.data?.videos
        .filter(
          (v: { questId: string }, i: number, arr: { questId: string }[]) =>
            arr.findIndex(
              (t: { questId: string }) => t.questId === v.questId
            ) === i
        )
        ?.map(async (video: { questId: string }) => {
          const data = await getQuestById(video?.questId);

          if (
            data?.data?.questInstantiateds?.[0] &&
            !data?.data?.questInstantiateds?.[0]?.questMetadata
          ) {
            const fetched = await fetchIPFSJSON(
              data?.data?.questInstantiateds?.[0]?.uri
            );
            data.data.questInstantiateds[0] = {
              ...data?.data?.questInstantiateds?.[0],
              questMetadata: fetched,
            };
          }

          return {
            ...data?.data?.questInstantiateds?.[0],
          };
        });

      setAllVideoQuests(await Promise.all(videoPromises));
    } catch (err: any) {
      console.error(err.message);
    }
    setQuestsLoading(false);
  };

  useEffect(() => {
    if (quests?.open) {
      getQuests();
    } else {
      setAllVideoQuests([]);
    }
  }, [quests?.open]);

  return {
    questsLoading,
    allVideoQuests,
    handleJoinQuest,
    joinLoading,
  };
};

export default useQuests;
