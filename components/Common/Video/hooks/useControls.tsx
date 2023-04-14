import { FormEvent, useEffect, useRef, useState } from "react";
import { UseControlsResults } from "../types/controls.types";
import { useDispatch, useSelector } from "react-redux";
import { setVideoTime } from "@/redux/reducers/videoTimeSlice";
import { RootState } from "@/redux/store";
import addReaction from "@/graphql/lens/mutations/react";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useSignTypedData,
} from "wagmi";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "@/lib/constants";
import LensHubProxy from "../../../../abis/LensHubProxy.json";
import handleIndexCheck from "@/lib/helpers/handleIndexCheck";
import { splitSignature } from "ethers/lib/utils.js";
import broadcast from "@/graphql/lens/mutations/broadcast";
import { omit } from "lodash";
import { mirror, mirrorDispatcher } from "@/graphql/lens/mutations/mirror";
import checkDispatcher from "@/lib/helpers/checkDispatcher";
import collect from "@/graphql/lens/mutations/collect";
import useInteractions from "../../Interactions/hooks/useInteractions";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import pollUntilIndexed from "@/lib/helpers/checkIndexed";
import { ApprovedAllowanceAmount } from "@/components/Home/types/lens.types";
import {
  getPublication,
  getPublicationAuth,
} from "@/graphql/lens/queries/getPublication";
import checkApproved from "@/lib/helpers/checkApproved";
import { setPostCollectValues } from "@/redux/reducers/postCollectSlice";
import { setPurchase } from "@/redux/reducers/purchaseSlice";
import { setModal } from "@/redux/reducers/modalSlice";

const useControls = (): UseControlsResults => {
  const { commentors } = useInteractions();
  const streamRef = useRef<HTMLVideoElement>(null);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [volumeOpen, setVolumeOpen] = useState<boolean>(false);
  const [heart, setHeart] = useState<boolean>(false);
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [collectLoading, setCollectLoading] = useState<boolean>(false);
  const [mirrorLoading, setMirrorLoading] = useState<boolean>(false);
  const [mirrorArgs, setMirrorArgs] = useState<any>();
  const [collectArgs, setCollectArgs] = useState<any>();
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const [approvalLoading, setApprovalLoading] = useState<boolean>(false);
  const [collectInfoLoading, setCollectInfoLoading] = useState<boolean>(false);
  const [mirrorCommentLoading, setMirrorCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors?.length }, () => false)
  );
  const [likeCommentLoading, setLikeCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors?.length }, () => false)
  );
  const [collectCommentLoading, setCollectCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors?.length }, () => false)
  );
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const videoTime = useSelector(
    (state: RootState) => state.app.videoTimeReducer.value
  );
  const dispatcher = useSelector(
    (state: RootState) => state.app.dispatcherReducer.value
  );
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const mainVideo = useSelector(
    (state: RootState) => state.app.mainVideoReducer
  );
  const approvalArgs = useSelector(
    (state: RootState) => state.app.approvalArgsReducer.args
  );
  const purchase = useSelector((state: RootState) => state.app.purchaseReducer);

  const { config, isSuccess } = usePrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MATIC,
    abi: LensHubProxy,
    functionName: "mirrorWithSig",
    enabled: Boolean(mirrorArgs),
    args: [mirrorArgs],
  });

  const { writeAsync } = useContractWrite(config);

  const { config: collectConfig, isSuccess: isSuccessCollect } =
    usePrepareContractWrite({
      address: LENS_HUB_PROXY_ADDRESS_MATIC,
      abi: LensHubProxy,
      functionName: "collectWithSig",
      enabled: Boolean(collectArgs),
      args: [collectArgs],
    });
  const { writeAsync: collectWriteAsync } = useContractWrite(collectConfig);

  const handleHeart = () => {
    setHeart(true);
    setTimeout(() => {
      setHeart(false);
    }, 3000);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const handleVolumeChange = (e: FormEvent) => {
    setVolume(parseFloat((e.target as HTMLFormElement).value));
  };

  useEffect(() => {
    if (fullScreen) {
      if (!document.fullscreenElement) {
        streamRef!.current!.requestFullscreen();
        setFullScreen(false);
      }
    }
  }, [fullScreen]);

  useEffect(() => {
    if (streamRef.current) {
      dispatch(setVideoTime(streamRef.current.currentTime));
    }
  }, [streamRef, videoTime]);

  const likeVideo = async (id?: string): Promise<void> => {
    let index: any, react: any;
    if (!id) {
      setLikeLoading(true);
    } else {
      index = commentors?.findIndex((commentor) => commentor.id === id);
      if (index >= 0) {
        setLikeCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = true;
          return updatedArray;
        });
      }
    }
    setLikeLoading(true);
    if (!profileId && !authStatus) {
      setLikeLoading(false);
      if (index >= 0) {
        setLikeCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = false;
          return updatedArray;
        });
      }
      return;
    }
    try {
      react = await addReaction({
        profileId: profileId,
        reaction: "UPVOTE",
        publicationId: id ? id : mainVideo.id,
      });
    } catch (err: any) {
      setLikeLoading(false);
      console.error(err.message);
    }
    if (!id) {
      setLikeLoading(false);
    } else {
      setLikeCommentLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = false;
        return updatedArray;
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

  const mirrorVideo = async (id?: string): Promise<void> => {
    let index: any;

    if (!id) {
      setMirrorLoading(true);
    } else {
      index = commentors.findIndex((commentor) => commentor.id === id);
      if (index >= 0) {
        setMirrorCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = true;
          return updatedArray;
        });
      }
    }

    if (!profileId && !authStatus) {
      setMirrorLoading(false);
      if (index >= 0) {
        setMirrorCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = false;
          return updatedArray;
        });
      }
      return;
    }
    let mirrorPost: any;
    try {
      if (dispatcher) {
        mirrorPost = await mirrorDispatcher({
          profileId: profileId,
          publicationId: id ? id : mainVideo.id,
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        });
        setTimeout(async () => {
          await handleIndexCheck(
            mirrorPost?.data?.createMirrorViaDispatcher?.txHash,
            dispatch,
            true
          );
        }, 7000);
      } else {
        mirrorPost = await mirror({
          profileId: profileId,
          publicationId: id ? id : mainVideo.id,
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        });

        const typedData: any = mirrorPost.data.createMirrorTypedData.typedData;

        const signature: any = await signTypedDataAsync({
          domain: omit(typedData?.domain, ["__typename"]),
          types: omit(typedData?.types, ["__typename"]) as any,
          value: omit(typedData?.value, ["__typename"]) as any,
        });

        const broadcastResult: any = await broadcast({
          id: mirrorPost?.data?.createMirrorTypedData?.id,
          signature,
        });

        if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
          const { v, r, s } = splitSignature(signature);
          const mirrorArgs = {
            profileId: typedData.value.profileId,
            profileIdPointed: typedData.value.profileIdPointed,
            pubIdPointed: typedData.value.pubIdPointed,
            referenceModuleData: typedData.value.referenceModuleData,
            referenceModule: typedData.value.referenceModule,
            referenceModuleInitData: typedData.value.referenceModuleInitData,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          };
          setMirrorArgs(mirrorArgs);
        } else {
          setTimeout(async () => {
            await handleIndexCheck(
              broadcastResult?.data?.broadcast?.txHash,
              dispatch,
              true
            );
          }, 7000);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    if (!id) {
      setMirrorLoading(false);
    } else {
      setMirrorCommentLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = false;
        return updatedArray;
      });
    }
  };

  const mirrorWrite = async (): Promise<void> => {
    setMirrorLoading(true);
    try {
      const tx = await writeAsync?.();
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Indexing Interaction",
        })
      );
      const res = await tx?.wait();
      await handleIndexCheck(res?.transactionHash, dispatch, true);
    } catch (err: any) {
      setMirrorLoading(false);
      console.error(err.message);
    }
    setMirrorLoading(false);
  };

  const collectVideo = async (id?: string): Promise<void> => {
    let index: any;
    if (!id) {
      setCollectLoading(true);
    } else {
      index = commentors.findIndex((commentor) => commentor.id === id);
      if (index >= 0) {
        setCollectCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = true;
          return updatedArray;
        });
      }
    }

    if (!profileId && !authStatus) {
      setCollectLoading(false);
      if (index >= 0) {
        setCollectCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = false;
          return updatedArray;
        });
      }
      return;
    }
    try {
      const collectPost = await collect({
        publicationId: id ? id : mainVideo.id,
      });
      const typedData: any = collectPost.data.createCollectTypedData.typedData;
      const signature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });

      const broadcastResult: any = await broadcast({
        id: collectPost?.data?.createCollectTypedData?.id,
        signature,
      });

      if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
        const { v, r, s } = splitSignature(signature);
        const collectArgs = {
          collector: address,
          profileId: typedData.value.profileId,
          pubId: typedData.value.pubId,
          data: typedData.value.data,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          },
        };
        setCollectArgs(collectArgs);
      } else {
        setTimeout(async () => {
          await handleIndexCheck(
            broadcastResult?.data?.broadcast?.txHash,
            dispatch,
            false
          );
        }, 7000);
      }
    } catch (err: any) {
      setCollectLoading(false);
      if (err.message.includes("You do not have enough")) {
        dispatch(
          setModal({
            actionOpen: true,
            actionMessage: "Insufficient Balance to Collect.",
          })
        );
      }
      console.error(err.message);
    }
    if (!id) {
      setCollectLoading(false);
    } else {
      if (index >= 0) {
        setCollectCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = false;
          return updatedArray;
        });
      }
    }
  };

  const collectWrite = async (): Promise<void> => {
    setCollectLoading(true);
    try {
      const tx = await collectWriteAsync?.();
      dispatch(
        setPurchase({
          actionOpen: false,
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
      const res = await tx?.wait();
      await handleIndexCheck(res?.transactionHash, dispatch, false);
    } catch (err: any) {
      console.error(err.message);
      if (err.message.includes("You do not have enough")) {
        dispatch(
          setModal({
            actionOpen: true,
            actionMessage: "Insufficient Balance to Collect.",
          })
        );
      }
      setCollectLoading(false);
    }
    setCollectLoading(false);
  };

  useEffect(() => {
    if (isSuccess) {
      mirrorWrite();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessCollect) {
      collectWrite();
    }
  }, [isSuccessCollect]);

  useEffect(() => {
    checkDispatcher(dispatch, profileId);
  }, [profileId]);

  const getCollectInfo = async (): Promise<void> => {
    setCollectInfoLoading(true);
    try {
      let pubData: any;
      if (profileId) {
        const { data } = await getPublicationAuth({
          publicationId: purchase.id,
        });
        pubData = data;
      } else {
        const { data } = await getPublication({
          publicationId: purchase.id,
        });
        pubData = data;
      }
      const collectModule = pubData?.publication?.collectModule;

      const approvalData: ApprovedAllowanceAmount | void = await checkApproved(
        collectModule?.amount?.asset?.address,
        collectModule?.type,
        null,
        null,
        collectModule?.amount?.value,
        dispatch,
        address,
        profileId
      );
      const isApproved = parseInt(approvalData?.allowance as string, 16);
      dispatch(
        setPostCollectValues({
          actionType: collectModule?.type,
          actionLimit: collectModule?.collectLimit,
          actionRecipient: collectModule?.recipient,
          actionReferralFee: collectModule?.referralFee,
          actionEndTime: collectModule?.endTimestamp,
          actionValue: collectModule?.value,
          actionFollowerOnly: collectModule?.followerOnly,
          actionAmount: {
            asset: {
              address: collectModule?.amount?.asset?.address,
              decimals: collectModule?.amount?.asset?.decimals,
              name: collectModule?.amount?.asset?.name,
              symbol: collectModule?.amount?.asset?.symbol,
            },
            value: collectModule?.amount?.value,
          },
          actionCanCollect: pubData?.publication?.hasCollectedByMe,
          actionApproved:
            collectModule?.type === "FreeCollectModule" ||
            isApproved > collectModule?.amount?.value
              ? true
              : false,
          actionTotalCollects:
            pubData?.publication?.stats?.totalAmountOfCollects,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectInfoLoading(false);
  };

  const { config: approvalConfig } = usePrepareSendTransaction({
    request: {
      to: approvalArgs?.to as string,
      from: approvalArgs?.from as string,
      data: approvalArgs?.data as string,
    },
    // enabled: Boolean(approvalSendEnabled),
  });

  const { sendTransactionAsync, isSuccess: approvalSuccess } =
    useSendTransaction(approvalConfig);

  const callApprovalSign = async (): Promise<void> => {
    try {
      const tx = await sendTransactionAsync?.();
      await tx?.wait();
      await pollUntilIndexed(tx?.hash as string, false);
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
      setApprovalLoading(false);
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
    streamRef,
    setFullScreen,
    fullScreen,
    formatTime,
    duration,
    currentTime,
    volume,
    // handlePause,
    // handlePlay,
    // handleVolumeChange,
    isPlaying,
    volumeOpen,
    setVolumeOpen,
    handleHeart,
    heart,
    mirrorLoading,
    collectLoading,
    likeLoading,
    collectVideo,
    mirrorVideo,
    likeVideo,
    mainVideo,
    authStatus,
    profileId,
    videoLoading,
    setVideoLoading,
    mirrorCommentLoading,
    likeCommentLoading,
    collectCommentLoading,
    approvalLoading,
    collectInfoLoading,
    approveCurrency,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    handleVolumeChange
  };
};

export default useControls;
