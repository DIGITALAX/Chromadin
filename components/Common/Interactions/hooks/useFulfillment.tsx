import { ACCEPTED_TOKENS, CHROMADIN_OPEN_ACTION } from "@/lib/constants";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { setSuccess } from "@/redux/reducers/successSlice";
import { setError } from "@/redux/reducers/errorSlice";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import { MainNFT } from "../../NFT/types/nft.types";
import { AnyAction, Dispatch } from "redux";
import { AbiCoder } from "ethers/lib/utils";
import actPost from "@/lib/helpers/actPost";
import findBalance from "@/lib/helpers/findBalance";
import { OracleData } from "../../Wavs/types/wavs.types";
import { Collection } from "@/components/Home/types/home.types";

const useFulfillment = (
  publicClient: PublicClient,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}` | undefined,
  mainNFT: MainNFT | undefined | Collection,
  oracleData: OracleData[]
) => {
  const [approved, setApproved] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>(
    ACCEPTED_TOKENS.filter(
      (token) =>
        token[1]?.toLowerCase() === mainNFT?.acceptedTokens?.[0]?.toLowerCase()
    )?.[0]?.[0] ?? "MONA"
  );
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(
    !Number.isNaN(mainNFT?.prices?.[0]) &&
      isFinite(Number(mainNFT?.prices?.[0]))
      ? Number(mainNFT?.prices?.[0]) / 10 ** 18
      : 0
  );

  const getAllowance = async () => {
    try {
      const data = await publicClient.readContract({
        address: ACCEPTED_TOKENS.filter(
          (token) => token[0].toLowerCase() === currency?.toLowerCase()
        )?.[0]?.[1] as `0x${string}`,
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
            ],
            name: "allowance",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "allowance",
        args: [address as `0x${string}`, CHROMADIN_OPEN_ACTION],
      });

      if (Number(data as any) >= totalAmount) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getTotalAmount = async () => {
    let number: number = 0,
      currentCurrency: string | undefined = mainNFT?.acceptedTokens.find(
        (token) =>
          token ===
          ACCEPTED_TOKENS.find(
            (token) => token[0].toLowerCase() === currency?.toLowerCase()
          )?.[1]!
      );

    if (currentCurrency) {
      number = Number(mainNFT?.prices[0]);
    } else {
      currentCurrency = ACCEPTED_TOKENS.find(
        (token) =>
          token[1].toLowerCase() === mainNFT?.acceptedTokens?.[0]?.toLowerCase()
      )?.[1]!;
      setCurrency(
        ACCEPTED_TOKENS.find(
          (token) =>
            token[1].toLowerCase() ===
            mainNFT?.acceptedTokens?.[0]?.toLowerCase()
        )?.[0]!
      );
      number = Number(mainNFT?.prices?.[0]);
    }

    setTotalAmount(
      (Number(number) /
        Number(
          oracleData?.find(
            (oracle) =>
              oracle.currency?.toLowerCase() === currentCurrency?.toLowerCase()
          )?.rate
        )) *
        Number(
          oracleData?.find(
            (oracle) =>
              oracle.currency?.toLowerCase() === currentCurrency?.toLowerCase()
          )?.wei
        )
    );
  };

  const approveSpend = async () => {
    setPurchaseLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      let simulateContract;
      try {
        simulateContract = await publicClient.simulateContract({
          address: ACCEPTED_TOKENS.find(
            (token) => token[0].toLowerCase() === currency?.toLowerCase()
          )?.[1] as `0x${string}`,
          abi: [
            currency === "MONA"
              ? {
                  inputs: [
                    {
                      internalType: "address",
                      name: "spender",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "tokens",
                      type: "uint256",
                    },
                  ],
                  name: "approve",
                  outputs: [
                    { internalType: "bool", name: "success", type: "bool" },
                  ],
                  stateMutability: "nonpayable",
                  type: "function",
                }
              : currency === "WMATIC"
              ? {
                  constant: false,
                  inputs: [
                    { name: "guy", type: "address" },
                    { name: "wad", type: "uint256" },
                  ],
                  name: "approve",
                  outputs: [{ name: "", type: "bool" }],
                  payable: false,
                  stateMutability: "nonpayable",
                  type: "function",
                }
              : {
                  inputs: [
                    {
                      internalType: "address",
                      name: "spender",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "amount",
                      type: "uint256",
                    },
                  ],
                  name: "approve",
                  outputs: [
                    {
                      internalType: "bool",
                      name: "",
                      type: "bool",
                    },
                  ],
                  stateMutability: "nonpayable",
                  type: "function",
                },
          ] as any,
          functionName: "approve",
          args: [CHROMADIN_OPEN_ACTION, totalAmount.toString()],
          chain: polygon,
          account: address,
        });
      } catch (err: any) {
        if (err.message.includes("Insufficient Approval Allowance")) {
          dispatch(setError(true));
        }
        console.error(err.message);
        setPurchaseLoading(false);
        return;
      }

      const res = await clientWallet.writeContract(simulateContract.request);
      await publicClient.waitForTransactionReceipt({ hash: res });

      if (res) {
        setApproved(true);
      }
    } catch (err: any) {
      setPurchaseLoading(false);
      console.error(err.message);
    }
    setPurchaseLoading(false);
  };

  const buyNFT = async (): Promise<void> => {
    if (!address) return;
    setPurchaseLoading(true);
    try {

      const balance = await findBalance(
        publicClient,
        ACCEPTED_TOKENS?.find(
          (item) => item[0].toLowerCase() == currency?.toLowerCase()
        )?.[1]!,
        address as `0x${string}`
      );

      if (
        Number(balance) <
        ((Number(mainNFT?.prices?.[0]) * 10 ** 18) /
          Number(
            oracleData?.find(
              (oracle) =>
                oracle.currency?.toLowerCase() ===
                ACCEPTED_TOKENS?.find(
                  (item) => item[0].toLowerCase() == currency?.toLowerCase()
                )?.[1]?.toLowerCase()
            )?.rate
          )) *
          10 ** 18
      ) {
        dispatch(setError(true));
        setPurchaseLoading(false);
        return;
      }

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const coder = new AbiCoder();

      const complete = await actPost(
        mainNFT?.publication?.id,
        {
          unknownOpenAction: {
            address: CHROMADIN_OPEN_ACTION,
            data: coder.encode(
              ["address", "uint256"],
              [
                ACCEPTED_TOKENS?.find(
                  (item) => item[0].toLowerCase() == currency?.toLowerCase()
                )?.[1],
                1,
              ]
            ),
          },
        },
        dispatch,
        address!,
        clientWallet,
        publicClient
      );
      if (complete) {
        dispatch(
          setSuccess({
            actionOpen: true,
            actionMedia: (mainNFT as MainNFT)?.title
              ? (mainNFT as MainNFT)?.image || (mainNFT as MainNFT)?.mediaCover
              : (mainNFT as Collection)?.collectionMetadata?.images?.[0] ||
                (mainNFT as Collection)?.collectionMetadata?.mediaCover,
            actionName: (mainNFT as MainNFT)?.title
              ? (mainNFT as MainNFT)?.title
              : (mainNFT as Collection)?.collectionMetadata?.title,
          })
        );
      }
    } catch (err: any) {
      console.error(err.messgae);
    }
    setPurchaseLoading(false);
  };

  useEffect(() => {
    if (mainNFT?.acceptedTokens) {
      getTotalAmount();
    }
  }, [currency, mainNFT]);

  useEffect(() => {
    if (address) {
      getAllowance();
    }
  }, [address, totalAmount, mainNFT]);

  return {
    currency,
    setCurrency,
    totalAmount,
    approved,
    buyNFT,
    approveSpend,
    purchaseLoading,
  };
};

export default useFulfillment;
