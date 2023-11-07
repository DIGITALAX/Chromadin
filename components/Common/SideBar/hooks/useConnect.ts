import { useConnectModal } from "@rainbow-me/rainbowkit";
import { UseConnectResults } from "../types/sidebar.types";
import { useAccount, useSignMessage } from "wagmi";
import { useDispatch } from "react-redux";
import { setLensProfile } from "@/redux/reducers/lensProfileSlice";
import {
  getAddress,
  getAuthenticationToken,
  isAuthExpired,
  refreshAuth,
  removeAuthenticationToken,
  setAddress,
  setAuthenticationToken,
} from "@/lib/lens/utils";
import authenticate from "@/graphql/lens/mutations/authenticate";
import { useEffect, useState } from "react";
import generateChallenge from "@/graphql/lens/queries/generateChallenge";
import getDefaultProfile from "@/graphql/lens/queries/getDefaultProfile";
import { setNoHandle } from "@/redux/reducers/noHandleSlice";
import { CHROMADIN_ACCESS_CONTROLS } from "@/lib/constants";
import { setIsCreator } from "@/redux/reducers/isCreatorSlice";
import { useRouter } from "next/router";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { Profile } from "@/components/Home/types/generated";
import { setConnectedRedux } from "@/redux/reducers/connectedSlice";

const useConnect = (): UseConnectResults => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const { openConnectModal } = useConnectModal();
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const [signInLoading, setSignInLoading] = useState<boolean>(false);
  const router = useRouter();

  const getWriter = async () => {
    try {
      const data = await publicClient.readContract({
        address: CHROMADIN_ACCESS_CONTROLS,
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "_writer",
                type: "address",
              },
            ],
            name: "isWriter",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "isWriter",
        args: [address as `0x${string}`],
      });

      dispatch(setIsCreator(data as boolean));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const { signMessageAsync } = useSignMessage();

  const handleConnect = (): void => {
    openConnectModal;
    dispatch(
      setNoHandle({
        actionValue: false,
        actionMessage: "",
      })
    );
  };

  const handleLensSignIn = async (): Promise<void> => {
    setSignInLoading(true);
    try {
      const profile = await getDefaultProfile({
        for: address,
      });
      const challengeResponse = await generateChallenge({
        for: profile.data?.defaultProfile?.id,
        signedBy: address,
      });
      const signature = await signMessageAsync({
        message: challengeResponse.data?.challenge.text!,
      });
      const accessTokens = await authenticate({
        id: challengeResponse.data?.challenge.id,
        signature: signature,
      });
      if (accessTokens) {
        setAuthenticationToken({ token: accessTokens.data?.authenticate! });
        setAddress(address as string);

        if (profile?.data?.defaultProfile) {
          dispatch(
            setNoHandle({
              actionValue: false,
              actionMessage: "",
            })
          );
          dispatch(setLensProfile(profile?.data?.defaultProfile as Profile));
        } else {
          dispatch(
            setNoHandle({
              actionValue: true,
              actionMessage:
                "Own Your Digital Roots. Claim A Lens Handle to Sign In & Collect.",
            })
          );
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSignInLoading(false);
  };

  const handleRefreshProfile = async (): Promise<void> => {
    try {
      const profile = await getDefaultProfile({
        for: address,
      });
      if (profile?.data?.defaultProfile) {
        dispatch(setLensProfile(profile?.data?.defaultProfile as Profile));
      } else {
        removeAuthenticationToken();
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const handleAuthentication = async () => {
      dispatch(setConnectedRedux(isConnected));
      const newAddress = getAddress();

      if (
        (newAddress && newAddress?.replace(/^"|"$/g, "") === address) ||
        (!newAddress && address)
      ) {
        const token = getAuthenticationToken();
        setAddress(address as string);
        if (isConnected && !token) {
          dispatch(setLensProfile(undefined));
          removeAuthenticationToken();
        } else if (isConnected && token) {
          if (isAuthExpired(token?.exp)) {
            const refreshedAccessToken = await refreshAuth(); // await the refreshAuth promise
            if (!refreshedAccessToken) {
              dispatch(setLensProfile(undefined));
              removeAuthenticationToken();
            }
          }
          await handleRefreshProfile(); // await the handleRefreshProfile promise
        }
      } else if (isConnected && address !== newAddress) {
        dispatch(setLensProfile(undefined));
        removeAuthenticationToken();
      }
    };

    handleAuthentication(); // Call the inner async function
  }, [isConnected]);

  useEffect(() => {
    if (router && address) {
      getWriter();
    }
  }, [address, isConnected]);

  return {
    handleConnect,
    handleLensSignIn,
    handleRefreshProfile,
    signInLoading,
  };
};

export default useConnect;
