import { useSignMessage } from "wagmi";
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
import { setIsCreator } from "@/redux/reducers/isCreatorSlice";
import { NextRouter } from "next/router";
import { PublicClient } from "viem";
import { Erc20, Profile } from "@/components/Home/types/generated";
import { setWalletConnectedRedux } from "@/redux/reducers/walletConnectedSlice";
import { Dispatch } from "redux";
import { PRINT_ACCESS_CONTROL } from "@/lib/constants";
import { OracleData } from "../../Wavs/types/wavs.types";
import { setOracleData } from "@/redux/reducers/oracleDataSlice";
import { getOracleData } from "@/graphql/subgraph/queries/getOracleData";
import availableCurrencies from "@/lib/helpers/availableCurrencies";

const useConnect = (
  router: NextRouter,
  address: `0x${string}` | undefined,
  isConnected: boolean,
  dispatch: Dispatch,
  connectModalOpen: boolean,
  publicClient: PublicClient,
  oracleData: OracleData[],
  openAccountModal: (() => void) | undefined,
  enabledCurrencies: Erc20[]
) => {
  const [signInLoading, setSignInLoading] = useState<boolean>(false);

  const getWriter = async () => {
    try {
      const data = await publicClient.readContract({
        address: PRINT_ACCESS_CONTROL,
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "_address",
                type: "address",
              },
            ],
            name: "isDesigner",
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
        functionName: "isDesigner",
        args: [address as `0x${string}`],
      });

      dispatch(setIsCreator(data as boolean));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleOracles = async (): Promise<void> => {
    try {
      const data = await getOracleData();

      dispatch(setOracleData(data?.data?.currencyAddeds));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const { signMessageAsync } = useSignMessage();

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

  const handleLogout = async (): Promise<void> => {
    try {
      if (openAccountModal) {
        openAccountModal();
      }
      dispatch(setLensProfile(undefined));
      removeAuthenticationToken();
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const handleAuthentication = async () => {
      dispatch(setWalletConnectedRedux(isConnected));
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
    if (connectModalOpen) {
      dispatch(
        setNoHandle({
          actionValue: false,
          actionMessage: "",
        })
      );
    }
  }, [connectModalOpen]);

  useEffect(() => {
    if (router && address) {
      getWriter();
    }

    if (!oracleData || oracleData?.length < 1) {
      handleOracles();
    }
  }, [address, isConnected]);

  useEffect(() => {
    if (enabledCurrencies?.length < 1) {
      availableCurrencies(dispatch);
    }
  }, []);

  return {
    handleLensSignIn,
    handleRefreshProfile,
    signInLoading,
    handleLogout,
  };
};

export default useConnect;
