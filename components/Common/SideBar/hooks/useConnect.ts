import { useConnectModal } from "@rainbow-me/rainbowkit";
import { UseConnectResults } from "../types/sidebar.types";
import { useAccount, useSignMessage } from "wagmi";
import { useDispatch } from "react-redux";
import { setAuthStatus } from "@/redux/reducers/authStatusSlice";
import { setLensProfile } from "@/redux/reducers/lensProfileSlice";
import {
  getAuthenticationToken,
  isAuthExpired,
  refreshAuth,
  removeAuthenticationToken,
  setAuthenticationToken,
} from "@/lib/lens/utils";
import authenticate from "@/graphql/lens/mutations/authenticate";
import { useEffect, useState } from "react";
import generateChallenge from "@/graphql/lens/queries/generateChallenge";
import getDefaultProfile from "@/graphql/lens/queries/getDefaultProfile";

const useConnect = (): UseConnectResults => {
  const { openConnectModal } = useConnectModal();
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const [connected, setConnected] = useState<boolean>(false);

  const { signMessageAsync } = useSignMessage({
    onError() {
      dispatch(setAuthStatus(false));
    },
  });

  const handleConnect = (): void => {
    openConnectModal && openConnectModal();
  };

  const handleLensSignIn = async (): Promise<void> => {
    try {
      const challengeResponse = await generateChallenge(address);
      const signature = await signMessageAsync({
        message: challengeResponse.data.challenge.text,
      });
      const accessTokens = await authenticate(
        address as string,
        signature as string
      );
      if (accessTokens) {
        setAuthenticationToken({ token: accessTokens.data.authenticate });
        const profile = await getDefaultProfile(address);
        if (profile?.data) {
          dispatch(setLensProfile(profile?.data?.defaultProfile));
          dispatch(setAuthStatus(true));
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleRefreshProfile = async (): Promise<void> => {
    try {
      const profile = await getDefaultProfile(address);
      if (profile?.data?.defaultProfile !== null) {
        dispatch(setLensProfile(profile?.data?.defaultProfile));
        dispatch(setAuthStatus(true));
      } else {
        dispatch(setAuthStatus(false));
        removeAuthenticationToken();
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    setConnected(isConnected);
    const token = getAuthenticationToken();
    if (isConnected && !token) {
      dispatch(setLensProfile(undefined));
      removeAuthenticationToken();
    } else if (isConnected && token) {
      if (isAuthExpired(token?.exp)) {
        const refreshedAccessToken = refreshAuth();
        if (!refreshedAccessToken) {
          dispatch(setLensProfile(undefined));
          removeAuthenticationToken();
        }
      }
      handleRefreshProfile();
    }
  }, [isConnected]);

  return { handleConnect, handleLensSignIn, handleRefreshProfile, connected };
};

export default useConnect;
