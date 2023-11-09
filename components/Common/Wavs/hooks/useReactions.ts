import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import addReaction from "@/graphql/lens/mutations/react";
import { useAccount } from "wagmi";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import {
  getPublication,
  getPublicationAuth,
} from "@/graphql/lens/queries/getPublication";
import checkApproved from "@/lib/helpers/checkApproved";
import { setPostCollectValues } from "@/redux/reducers/postCollectSlice";
import { setModal } from "@/redux/reducers/modalSlice";
import { setFeedReactId } from "@/redux/reducers/feedReactIdSlice";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygon } from "viem/chains";
import {
  ApprovalAllowance,
  Post,
  PublicationQuery,
  PublicationReactionType,
} from "@/components/Home/types/generated";
import mirrorSig from "@/lib/helpers/mirrorSig";
import actSig from "@/lib/helpers/actSig";
import handleIndexCheck from "@/lib/helpers/handleIndexCheck";

const useReactions = () => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const feedDispatch = useSelector(
    (state: RootState) => state.app.feedReducer.value
  );
  const approvalArgs = useSelector(
    (state: RootState) => state.app.approvalArgsReducer.args
  );
  const purchase = useSelector((state: RootState) => state.app.purchaseReducer);
  const [approvalLoading, setApprovalLoading] = useState<boolean>(false);
  const [collectInfoLoading, setCollectInfoLoading] = useState<boolean>(false);
  const [mirrorFeedLoading, setMirrorFeedLoading] = useState<boolean[]>(
    Array.from({ length: feedDispatch.length }, () => false)
  );
  const [reactFeedLoading, setReactFeedLoading] = useState<boolean[]>(
    Array.from({ length: feedDispatch.length }, () => false)
  );
  const [collectFeedLoading, setCollectFeedLoading] = useState<boolean[]>(
    Array.from({ length: feedDispatch.length }, () => false)
  );
  const [openMirrorChoice, setOpenMirrorChoice] = useState<boolean[]>(
    Array.from({ length: feedDispatch.length }, () => false)
  );
  const dispatch = useDispatch();
  const { address } = useAccount();

  const reactPost = async (
    id: string,
    loader?: (e: any) => void,
    inputIndex?: number,
    mirrorId?: string
  ): Promise<void> => {
    if (!profileId) {
      return;
    }
    let index: number;
    if (inputIndex === undefined || inputIndex === null) {
      index = feedDispatch?.findIndex(
        (feed) => feed.id === (mirrorId !== undefined ? mirrorId : id)
      );
      setReactFeedLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = true;
        return updatedArray;
      });
    } else {
      loader!((prev: any) => {
        const updatedArray = [...prev];
        updatedArray[inputIndex] = true;
        return updatedArray as boolean[];
      });
    }

    try {
      await addReaction({
        reaction: PublicationReactionType.Upvote,
        for: id,
      });
      dispatch(
        setFeedReactId({
          actionValue: mirrorId ? mirrorId : id,
          actionType: 0,
        })
      );
    } catch (err: any) {
      if (
        err.message.includes(
          "You have already reacted to this publication with action UPVOTE"
        )
      ) {
        dispatch(
          setFeedReactId({
            actionValue: mirrorId ? mirrorId : id,
            actionType: 0,
          })
        );
      } else {
        console.error(err.message);
      }
    }
    if (inputIndex === undefined || inputIndex === null) {
      setReactFeedLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = false;
        return updatedArray;
      });
    } else {
      loader!((prev: any) => {
        const updatedArray = [...prev];
        updatedArray[inputIndex] = false;
        return updatedArray as boolean[];
      });
    }

    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Successfully Indexed",
      })
    );
    setTimeout(() => {
      dispatch(
        setIndexModal({
          actionValue: false,
          actionMessage: undefined,
        })
      );
    }, 4000);
  };

  const mirrorPost = async (
    id: string,
    loader?: (e: any) => void,
    inputIndex?: number,
    mirrorId?: string
  ): Promise<void> => {
    if (!profileId) {
      return;
    }
    let index: number;
    if (inputIndex === undefined || inputIndex === null) {
      index = feedDispatch.findIndex(
        (feed) => feed.id === (mirrorId !== undefined ? mirrorId : id)
      );

      setMirrorFeedLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = true;
        return updatedArray;
      });
    } else {
      loader!((prev: any) => {
        const updatedArray = [...prev];
        updatedArray[inputIndex] = true;
        return updatedArray as boolean[];
      });
    }

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await mirrorSig(
        id,
        clientWallet,
        publicClient,
        address as `0x${string}`,
        dispatch
      );

      dispatch(
        setFeedReactId({
          actionValue: mirrorId ? mirrorId : id,
          actionType: 1,
        })
      );
    } catch (err: any) {
      if (err.message.includes("data availability publication")) {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Momoka won't let you interact ATM.",
          })
        );
        setTimeout(() => {
          dispatch(
            setIndexModal({
              actionValue: false,
              actionMessage: "",
            })
          );
        }, 4000);
      }
      console.error(err.message);
    }
    if (inputIndex === undefined || inputIndex === null) {
      setMirrorFeedLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = false;
        return updatedArray;
      });
    } else {
      loader!((prev: any) => {
        const updatedArray = [...prev];
        updatedArray[inputIndex] = false;
        return updatedArray as boolean[];
      });
    }
  };

  const collectPost = async (
    id: string,
    loader?: (e: any) => void,
    inputIndex?: number,
    mirrorId?: string
  ): Promise<void> => {
    if (!profileId) {
      return;
    }
    let index: number;
    if (inputIndex === undefined || inputIndex === null) {
      index = feedDispatch.findIndex(
        (feed) => feed.id === (mirrorId !== undefined ? mirrorId : id)
      );
      setCollectFeedLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = true;
        return updatedArray;
      });
    } else {
      loader!((prev: any) => {
        const updatedArray = [...prev];
        updatedArray[inputIndex] = true;
        return updatedArray as boolean[];
      });
    }

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await actSig(
        id,
        {
          simpleCollectOpenAction: true,
        },
        clientWallet,
        publicClient,
        address as `0x${string}`,
        dispatch
      );

      dispatch(
        setFeedReactId({
          actionValue: mirrorId ? mirrorId : id,
          actionType: 2,
        })
      );
    } catch (err: any) {
      if (err.message.includes("You do not have enough")) {
        dispatch(
          setModal({
            actionOpen: true,
            actionMessage: "Insufficient Balance to Collect.",
          })
        );
      }
      if (err.message.includes("data availability publication")) {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Momoka won't let you interact ATM.",
          })
        );
        setTimeout(() => {
          dispatch(
            setIndexModal({
              actionValue: false,
              actionMessage: "",
            })
          );
        }, 4000);
      }
      console.error(err.message);
    }

    if (inputIndex === undefined || inputIndex === null) {
      setCollectFeedLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = false;
        return updatedArray;
      });
    } else {
      loader!((prev: any) => {
        const updatedArray = [...prev];
        updatedArray[inputIndex] = false;
        return updatedArray as boolean[];
      });
    }
  };

  const getCollectInfo = async (): Promise<void> => {
    setCollectInfoLoading(true);
    try {
      let pubData: PublicationQuery;
      if (profileId) {
        const { data } = await getPublicationAuth({
          forId: purchase.id,
        });
        pubData = data!;
      } else {
        const { data } = await getPublication({
          forId: purchase.id,
        });
        pubData = data!;
      }
      const collectModule =
        pubData?.publication?.__typename === "Mirror"
          ? pubData?.publication?.mirrorOn?.openActionModules?.[0]
          : (pubData?.publication as Post)?.openActionModules?.[0];

      if (collectModule?.__typename !== "SimpleCollectOpenActionSettings")
        return;

      const approvalData: ApprovalAllowance | void = await checkApproved(
        collectModule?.amount?.asset?.contract?.address,
        collectModule?.type,
        null,
        null,
        collectModule?.amount?.value,
        dispatch,
        address,
        profileId
      );
      const isApproved = parseInt(approvalData?.allowance.value as string, 16);

      dispatch(
        setPostCollectValues({
          actionType: collectModule?.type,
          actionLimit: collectModule?.collectLimit,
          actionRecipient: collectModule?.recipient,
          actionReferralFee: collectModule?.referralFee,
          actionEndTime: collectModule?.endsAt,
          actionValue: collectModule?.amount?.value,
          actionFollowerOnly: collectModule?.followerOnly,
          actionAmount: {
            asset: {
              address: collectModule?.amount?.asset?.contract,
              decimals: collectModule?.amount?.asset?.decimals,
              name: collectModule?.amount?.asset?.name,
              symbol: collectModule?.amount?.asset?.symbol,
            },
            value: collectModule?.amount?.value,
          },
          actionCanCollect:
            pubData?.publication?.__typename === "Mirror"
              ? !pubData?.publication?.mirrorOn?.operations.hasActed
              : !(pubData?.publication as Post)?.operations?.hasActed,
          actionApproved:
            (!collectModule?.amount?.value ||
              isApproved > Number(collectModule?.amount?.value)) &&
            (!collectModule?.endsAt ||
              (collectModule?.endsAt && Date.now() < collectModule?.endsAt)) &&
            (!collectModule.collectLimit ||
              (collectModule.collectLimit &&
                (pubData?.publication?.__typename === "Mirror"
                  ? pubData?.publication?.mirrorOn?.stats?.countOpenActions
                  : (pubData?.publication as Post)?.stats?.countOpenActions) <
                  Number(collectModule.collectLimit))),
          actionTotalCollects:
            pubData?.publication?.__typename === "Mirror"
              ? pubData?.publication?.mirrorOn?.stats?.countOpenActions
              : (pubData?.publication as Post)?.stats?.countOpenActions,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectInfoLoading(false);
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
      const tx = await publicClient.waitForTransactionReceipt({ hash: res });
      await handleIndexCheck(
        {
          forTxHash: tx.transactionHash,
        },
        dispatch
      );
      await getCollectInfo();
    } catch (err: any) {
      setApprovalLoading(false);
      console.error(err.message);
    }
  };

  const approveCurrency = async (): Promise<void> => {
    setApprovalLoading(true);
    try {
      await callApprovalSign();
    } catch (err: any) {
      console.error(err.message);
    }
    setApprovalLoading(false);
  };

  useEffect(() => {
    if (purchase.open) {
      getCollectInfo();
    }
  }, [purchase.open]);

  return {
    collectPost,
    mirrorPost,
    reactPost,
    mirrorFeedLoading,
    reactFeedLoading,
    collectFeedLoading,
    approvalLoading,
    collectInfoLoading,
    approveCurrency,
    openMirrorChoice,
    setOpenMirrorChoice,
  };
};

export default useReactions;
