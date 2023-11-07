import createFollowTypedData from "@/graphql/lens/mutations/follow";
import { LENS_CREATORS, LENS_HUB_PROXY_ADDRESS_MATIC } from "@/lib/constants";
import createFollowModule from "@/lib/helpers/createFollowModule";
import splitSignature from "@/lib/helpers/splitSignature";
import { setModal } from "@/redux/reducers/modalSlice";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import LensHubProxy from "./../../../../abis/LensHubProxy.json";
import { omit } from "lodash";
import broadcast from "@/graphql/lens/mutations/broadcast";
import handleIndexCheck from "@/lib/helpers/handleIndexCheck";
import getDefaultProfile from "@/graphql/lens/queries/getDefaultProfile";
import { setLensProfile } from "@/redux/reducers/lensProfileSlice";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { RootState } from "@/redux/store";
import { setSuperFollow } from "@/redux/reducers/superFollowSlice";
import { setRainRedux } from "@/redux/reducers/rainSlice";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygon } from "viem/chains";
import { Profile } from "@/components/Home/types/generated";

const useSuperCreator = () => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const [superCreatorLoading, setSuperCreatorLoading] =
    useState<boolean>(false);
  const [followArgs, setFollowArgs] = useState<any>();
  const dispatch = useDispatch();
  const { address } = useAccount();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<MutableRefObject<number | null>>(null);
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
  );
  const rain = useSelector((state: RootState) => state.app.rainReducer.value);

  const refetchProfile = async (): Promise<void> => {
    try {
      const profile = await getDefaultProfile({
        for: address,
      });
      dispatch(setLensProfile(profile?.data?.defaultProfile as Profile));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const followSuper = async () => {
    setSuperCreatorLoading(true);

    let res: `0x${string}` = "0x";
    const batchSize = 15;
    const numBatches = Math.ceil(LENS_CREATORS.length / batchSize);
    for (let batchIndex = 0; batchIndex < numBatches; batchIndex++) {
      const batchStart = batchIndex * batchSize;
      const batchEnd = Math.min(
        LENS_CREATORS.length,
        (batchIndex + 1) * batchSize
      );
      let followers = [];

      for (let i = batchStart; i < batchEnd; i++) {
        const followModule = createFollowModule(
          quickProfiles[i]?.followModule?.type as any,
          (quickProfiles[i]?.followModule as any)?.amount?.value,
          (quickProfiles[i]?.followModule as any)?.amount?.asset?.address,
          quickProfiles[i].ownedBy
        );

        followers.push({
          profileId: LENS_CREATORS[i],
          followModule,
        });
      }

      try {
        const response = await createFollowTypedData({
          follow: followers,
        });

        const typedData = response?.data?.createFollowTypedData?.typedData;

        const clientWallet = createWalletClient({
          chain: polygon,
          transport: custom((window as any).ethereum),
        });

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

        if (
          broadcastResult?.data?.broadcastOnchain?.__typename === "RelayError"
        ) {
          const { v, r, s } = splitSignature(signature);
          const { request } = await publicClient.simulateContract({
            address: LENS_HUB_PROXY_ADDRESS_MATIC,
            abi: LensHubProxy,
            functionName: "followWithSig",
            chain: polygon,
            args: [
              {
                followerProfileId: typedData?.value?.followerProfileId,
                idsOfProfilesToFollow: typedData?.value?.idsOfProfilesToFollow,
                followTokenIds: typedData?.value?.followTokenIds,
                datas: typedData?.value?.datas,
                sig: {
                  v,
                  r,
                  s,
                  deadline: typedData?.value?.deadline,
                },
              },
            ],
            account: address,
          });
          res = await clientWallet.writeContract(request);
          await publicClient.waitForTransactionReceipt({ hash: res });
        }
      } catch (err: any) {
        if (err.message.includes("You do not have enough")) {
          dispatch(
            setModal({
              actionOpen: true,
              actionMessage: "Insufficient Balance to Follow.",
            })
          );
        } else {
          dispatch(setIndexModal("Unsuccessful. Please Try Again."));
        }
        console.error(err.message);
      }
    }

    try {
      setSuperCreatorLoading(false);
      await handleIndexCheck(res, dispatch);
      await refetchProfile();
      setSuperCreatorLoading(false);
      dispatch(setRainRedux(true));
      setTimeout(() => {
        dispatch(setRainRedux(false));
        dispatch(setSuperFollow(false));
      }, 4000);
    } catch (err: any) {}
    setSuperCreatorLoading(false);
  };

  useEffect(() => {
    if (rain) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      const width = window.innerWidth;
      const height = window.innerHeight;
      const particles: any[] = [];

      if (canvas && context) {
        canvas.width = width;
        canvas.height = height;

        class Particle {
          constructor() {
            (this as any).x = Math.random() * width;
            (this as any).y = 0;
            (this as any).speed = 3 + Math.random() * 7;
            (this as any).length = 30 + Math.random() * 60;
            (this as any).opacity = Math.random();
          }

          update() {
            (this as any).y += (this as any).speed;
            if ((this as any).y > height) {
              (this as any).y = 0;
              (this as any).x = Math.random() * width;
            }
          }

          draw() {
            context?.beginPath();
            context?.moveTo((this as any).x, (this as any).y);
            context?.lineTo(
              (this as any).x,
              (this as any).y + (this as any).length
            );
            context!.strokeStyle = `rgba(255, 215, 0, ${
              (this as any).opacity
            })`;
            context?.stroke();
          }
        }
        const createParticles = (count: number) => {
          for (let i = 0; i < count; i++) {
            particles.push(new Particle());
          }
        };

        const updateParticles = () => {
          context.clearRect(0, 0, width, height);
          particles.forEach((particle) => {
            particle.update();
            particle.draw();
          });

          (animationRef.current as any) =
            requestAnimationFrame(updateParticles);
        };

        createParticles(200);

        (animationRef.current as any) = requestAnimationFrame(updateParticles);

        const fadeOut = () => {
          context.fillStyle = "rgba(0, 0, 0, 0.1)";
          context.fillRect(0, 0, width, height);
          setTimeout(() => {
            cancelAnimationFrame(animationRef.current as any);
          }, 4000);
        };

        fadeOut();

        return () => {
          cancelAnimationFrame(animationRef.current as any);
        };
      }
    }
  }, [rain]);

  return { superCreatorLoading, followSuper, canvasRef };
};

export default useSuperCreator;
