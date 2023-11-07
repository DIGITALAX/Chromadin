import {
  ACCEPTED_TOKENS,
  CHROMADIN_MARKETPLACE_CONTRACT,
  CHROMADIN_MARKETPLACE_CONTRACT_UPDATED,
  COIN_OP_MARKET,
  COIN_OP_ORACLE,
} from "@/lib/constants";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import ChromadinMarketplaceABI from "./../../../../abis/ChromadinMarketplace.json";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { setSuccess } from "@/redux/reducers/successSlice";
import { setError } from "@/redux/reducers/errorSlice";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygon } from "viem/chains";
import { setFulfillmentDetails } from "@/redux/reducers/fulfillmentDetailsSlice";
import { setEncryptedInfo } from "@/redux/reducers/encryptedInformationSlice";
import { setModal } from "@/redux/reducers/modalSlice";
import { removeFulfillmentDetailsLocalStorage } from "@/lib/subgraph/utils";
import CoinOpMarketABI from "./../../../../abis/CoinOpMarketABI.json";
import { encryptItems } from "@/lib/helpers/encryptItems";
import { PreRoll } from "../../NFT/types/nft.types";
import { setLitClient } from "@/redux/reducers/litClientSlice";

const useFulfillment = () => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const dispatch = useDispatch();
  const mainNFT = useSelector(
    (state: RootState) => state.app.mainNFTReducer.value
  );
  const litClient = useSelector(
    (state: RootState) => state.app.litClientReducer.value
  );
  const encrypted = useSelector(
    (state: RootState) => state.app.encryptedInformationReducer
  );
  const success = useSelector((state: RootState) => state.app.successReducer);
  const fulfillmentDetails = useSelector(
    (state: RootState) => state.app.fulfillmentDetailsReducer.value
  );
  const { address } = useAccount();
  const [viewScreenNFT, setViewScreenNFT] = useState<boolean>(true);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [oracleValue, setOracleValue] = useState<number>(1);
  const [cryptoCheckoutLoading, setCryptoCheckoutLoading] =
    useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [tokenId, setTokenId] = useState<string>();
  const [selectSize, setSelectSize] = useState<number>(0);
  const [baseColor, setBaseColor] = useState<number>(0);
  const [currency, setCurrency] = useState<string>(
    ACCEPTED_TOKENS.filter(
      (token) =>
        token[1]?.toLowerCase() === mainNFT?.acceptedTokens?.[0]?.toLowerCase()
    )?.[0]?.[0] ?? "MONA"
  );
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(
    !Number.isNaN(mainNFT?.price?.[0]) && isFinite(Number(mainNFT?.price?.[0]))
      ? Number(mainNFT?.price?.[0]) /
          (mainNFT?.acceptedTokens?.[0] ===
          "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
            ? 10 ** 6
            : 10 ** 18)
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
        args: [
          address as `0x${string}`,
          Number(mainNFT?.blockNumber) < 45189643
            ? CHROMADIN_MARKETPLACE_CONTRACT
            : CHROMADIN_MARKETPLACE_CONTRACT_UPDATED,
        ],
      });

      if (data && address) {
        if (
          Number((data as any)?.toString()) /
            (currency === "USDT" ? 10 ** 6 : 10 ** 18) >=
          totalAmount
        ) {
          setApproved(true);
        } else {
          setApproved(false);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getTotalAmount = async () => {
    let number;

    if (viewScreenNFT) {
      if (
        mainNFT?.acceptedTokens.find(
          (token) =>
            token ===
            ACCEPTED_TOKENS.find(
              (token) => token[0].toLowerCase() === currency?.toLowerCase()
            )?.[1]!
        )
      ) {
        number = Number(
          mainNFT?.price[
            mainNFT?.acceptedTokens.indexOf(
              ACCEPTED_TOKENS.find(
                (token) => token[0].toLowerCase() === currency?.toLowerCase()
              )?.[1]!
            )
          ]
        );
      } else {
        setCurrency(
          ACCEPTED_TOKENS.find(
            (token) =>
              token[1]?.toLowerCase() ===
              mainNFT?.acceptedTokens[0]?.toLowerCase()
          )?.[0]!
        );
        number = Number(
          mainNFT?.price[
            mainNFT?.acceptedTokens.indexOf(
              ACCEPTED_TOKENS.find(
                (token) =>
                  token[1].toLowerCase() ===
                  mainNFT?.acceptedTokens[0].toLowerCase()
              )?.[1]?.toLowerCase()!
            )
          ]
        );
      }
    } else {
      const data = await publicClient.readContract({
        address: COIN_OP_ORACLE.toLowerCase() as `0x${string}`,
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "_tokenAddress",
                type: "address",
              },
            ],
            name: "getRateByAddress",
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
        functionName: "getRateByAddress",
        args: [
          ACCEPTED_TOKENS.find(
            ([token]) => token === currency
          )?.[1].toLowerCase() as `0x${string}`,
        ],
      });

      const oracle = Number(data as any) / 10 ** 18;
      setOracleValue(oracle);
      number = Number(mainNFT?.coinOp?.price[0]) / Number(oracle);
    }

    setTotalAmount(
      currency === "USDT"
        ? Number((number / 10 ** 6).toFixed(2))
        : Number((number / 10 ** 18).toFixed(2))
    );
  };

  const getTokenId = (): void => {
    if (!mainNFT?.tokensSold || mainNFT?.tokensSold.length == 0) {
      setTokenId(mainNFT?.tokenIds[0]);
    } else {
      for (let i = 0; i < mainNFT?.tokenIds.length; i++) {
        if (!mainNFT?.tokensSold.includes(mainNFT?.tokenIds[i])) {
          setTokenId(mainNFT?.tokenIds[i]);
        }
      }
    }
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
          address: ACCEPTED_TOKENS.filter(
            (token) => token[0].toLowerCase() === currency?.toLowerCase()
          )?.[0]?.[1] as `0x${string}`,
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
          args: [
            Number(mainNFT?.blockNumber) < 45189643
              ? CHROMADIN_MARKETPLACE_CONTRACT
              : CHROMADIN_MARKETPLACE_CONTRACT_UPDATED,
            ethers.utils.parseEther(totalAmount.toString()),
          ],
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
    if (!tokenId) return;
    setPurchaseLoading(true);
    setCurrency(currency);
    const clientWallet = createWalletClient({
      chain: polygon,
      transport: custom((window as any).ethereum),
    });
    let simulateResult;
    try {
      simulateResult = await publicClient.simulateContract({
        address:
          Number(mainNFT?.blockNumber) < 45189643
            ? CHROMADIN_MARKETPLACE_CONTRACT
            : CHROMADIN_MARKETPLACE_CONTRACT_UPDATED,
        abi: ChromadinMarketplaceABI,
        args: [
          [Number(tokenId)],
          ACCEPTED_TOKENS.filter(
            (token) => token[0].toLowerCase() === currency?.toLowerCase()
          )?.[0]?.[1] as `0x${string}`,
        ],
        functionName: "buyTokens",
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

    const res = await clientWallet.writeContract(simulateResult.request);
    await publicClient.waitForTransactionReceipt({ hash: res });
    try {
      dispatch(
        setSuccess({
          actionOpen: true,
          actionMedia: success.media?.includes("ipfs://")
            ? success.media?.split("ipfs://")[1]
            : success.media,
          actionName: success.name,
          actionCoinOp: false,
        })
      );
      setTimeout(() => {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Purchase Successful",
          })
        );
      }, 5000);
      setTimeout(() => {
        dispatch(
          setIndexModal({
            actionValue: false,
            actionMessage: undefined,
          })
        );
      }, 8000);
    } catch (err: any) {
      setPurchaseLoading(false);
      if (!err.message.includes("User rejected")) {
        dispatch(setError(true));
      }
      console.error(err.message);
    }
    setPurchaseLoading(false);
  };

  const handleCheckoutCrypto = async () => {
    if (
      fulfillmentDetails.address.trim() === "" ||
      fulfillmentDetails.city.trim() === "" ||
      fulfillmentDetails.contact.trim() === "" ||
      fulfillmentDetails.country.trim() === "" ||
      fulfillmentDetails.name.trim() === "" ||
      fulfillmentDetails.state.trim() === "" ||
      fulfillmentDetails.zip.trim() === ""
    ) {
      dispatch(
        setModal({
          actionOpen: true,
          actionMessage: "Fill out your Contact & Shipment details first.",
        })
      );
      return;
    }

    setCryptoCheckoutLoading(true);
    try {
      let fulfillerGroups: { [key: string]: PreRoll[] } = {};

      fulfillerGroups[mainNFT?.coinOp?.fulfillerAddress!] = [mainNFT?.coinOp!];

      const returned = await encryptItems(
        litClient,
        dispatch,
        {
          sizes: [mainNFT?.coinOp?.chosenSize!],
          colors: [mainNFT?.coinOp?.chosenColor!],
          collectionIds: [Number(mainNFT?.coinOp?.collectionId)],
          collectionAmounts: [1],
        },
        fulfillerGroups,
        fulfillmentDetails,
        address!
      );

      const { request, result } = await publicClient.simulateContract({
        address: COIN_OP_MARKET.toLowerCase() as `0x${string}`,
        abi: CoinOpMarketABI,
        functionName: "buyTokens",
        args: [
          {
            preRollIds: [Number(mainNFT?.coinOp?.collectionId)],
            preRollAmounts: [1],
            preRollIndexes: [0],
            customIds: [],
            customAmounts: [],
            customIndexes: [],
            customURIs: [],
            fulfillmentDetails: JSON.stringify(returned?.fulfillerDetails),
            pkpTokenId: "",
            chosenTokenAddress: ACCEPTED_TOKENS.find(
              ([token]) => token === currency
            )?.[1],
            sinPKP: true,
          },
        ],
        account: address?.toLowerCase() as `0x${string}`,
      });

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      removeFulfillmentDetailsLocalStorage();
      dispatch(
        setFulfillmentDetails({
          name: "",
          contact: "",
          address: "",
          zip: "",
          city: "",
          state: "",
          country: "",
        })
      );

      dispatch(
        setSuccess({
          actionOpen: true,
          actionMedia: success.media?.includes("ipfs://")
            ? success.media?.split("ipfs://")[1]
            : success.media,
          actionName: success.name,
          actionCoinOp: true,
        })
      );
    } catch (err: any) {
      dispatch(setError(true));
      console.error(err.message);
    }
    setCryptoCheckoutLoading(false);
  };

  useEffect(() => {
    if (mainNFT?.acceptedTokens) {
      getTotalAmount();
    }
    setImageIndex(0);
  }, [currency, mainNFT, viewScreenNFT]);

  useEffect(() => {
    if (address) {
      getAllowance();
    }
  }, [address, totalAmount, mainNFT, viewScreenNFT]);

  useEffect(() => {
    if (mainNFT) {
      getTokenId();
      if (!mainNFT.coinOp && !viewScreenNFT) {
        setViewScreenNFT(true);
      }
    }
    dispatch(
      setSuccess({
        actionOpen: false,
        actionMedia: mainNFT?.media?.includes("ipfs://")
          ? mainNFT?.media?.split("ipfs://")[1]
          : mainNFT?.media,
        actionName: mainNFT?.name,
        actionCoinOp: false,
      })
    );
  }, [mainNFT]);

  return {
    baseColor,
    selectSize,
    setBaseColor,
    setSelectSize,
    currency,
    setCurrency,
    totalAmount,
    approved,
    buyNFT,
    approveSpend,
    purchaseLoading,
    viewScreenNFT,
    setViewScreenNFT,
    cryptoCheckoutLoading,
    oracleValue,
    handleCheckoutCrypto,
    imageIndex,
    setImageIndex,
  };
};

export default useFulfillment;
