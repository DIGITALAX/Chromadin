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
import CoinOpMarketABI from "./../../../../abis/CoinOpMarketABI.json";
import { polygon } from "viem/chains";
import { setEncryptedInfo } from "@/redux/reducers/encryptedInformationSlice";
import { setLitClient } from "@/redux/reducers/litClientSlice";
import { encryptItems } from "@/lib/helpers/encryptItems";
import { PreRoll } from "@/components/Common/NFT/types/nft.types";
import { setModal } from "@/redux/reducers/modalSlice";
import { removeFulfillmentDetailsLocalStorage } from "@/lib/subgraph/utils";
import { setFulfillmentDetails } from "@/redux/reducers/fulfillmentDetailsSlice";

const usePurchase = () => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const dispatch = useDispatch();
  const autoDispatch = useSelector(
    (state: RootState) => state.app.autoCollectionReducer
  );
  const litClient = useSelector(
    (state: RootState) => state.app.litClientReducer.value
  );
  const fulfillmentDetails = useSelector(
    (state: RootState) => state.app.fulfillmentDetailsReducer.value
  );
  const encrypted = useSelector(
    (state: RootState) => state.app.encryptedInformationReducer
  );
  const viewScreenNFT = useSelector(
    (state: RootState) => state.app.nftScreenReducer.value
  );
  const success = useSelector((state: RootState) => state.app.successReducer);
  const { address } = useAccount();
  const [approved, setApproved] = useState<boolean>(false);
  const [tokenId, setTokenId] = useState<string>();
  const [oracleValue, setOracleValue] = useState<number>(1);
  const [cryptoCheckoutLoading, setCryptoCheckoutLoading] =
    useState<boolean>(false);
  const [currency, setCurrency] = useState<string>(
    ACCEPTED_TOKENS.filter(
      (token) =>
        token[1]?.toLowerCase() ===
        autoDispatch.collection?.acceptedTokens?.[0]?.toLowerCase()
    )?.[0]?.[0] ?? "MONA"
  );
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(
    !Number.isNaN(autoDispatch.collection?.basePrices?.[0]) &&
      isFinite(Number(autoDispatch.collection?.basePrices?.[0]))
      ? Number(autoDispatch.collection?.basePrices?.[0]) /
          (autoDispatch.collection?.acceptedTokens?.[0] ===
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
          Number(autoDispatch.collection?.blockNumber) < 45189643
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
        autoDispatch.collection?.acceptedTokens.find(
          (token) =>
            token ===
            ACCEPTED_TOKENS.find(
              (token) => token[0].toLowerCase() === currency?.toLowerCase()
            )?.[1]!
        )
      ) {
        number = Number(
          autoDispatch.collection?.basePrices[
            autoDispatch.collection?.acceptedTokens.indexOf(
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
              autoDispatch.collection?.acceptedTokens[0]?.toLowerCase()
          )?.[0]!
        );
        number = Number(
          autoDispatch.collection?.basePrices[
            autoDispatch.collection?.acceptedTokens.indexOf(
              ACCEPTED_TOKENS.find(
                (token) =>
                  token[1].toLowerCase() ===
                  autoDispatch.collection?.acceptedTokens[0].toLowerCase()
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
      number =
        Number(autoDispatch.collection?.coinOp?.price[0]) / Number(oracle);
    }
    setTotalAmount(
      currency === "USDT"
        ? Number((number / 10 ** 6).toFixed(2))
        : Number((number / 10 ** 18).toFixed(2))
    );
  };

  const getTokenId = (): void => {
    if (
      !autoDispatch.collection?.soldTokens ||
      autoDispatch.collection?.soldTokens.length == 0
    ) {
      setTokenId(autoDispatch.collection?.tokenIds[0]);
    } else {
      for (let i = 0; i < autoDispatch.collection?.tokenIds.length; i++) {
        if (
          !autoDispatch.collection?.soldTokens.includes(
            autoDispatch.collection?.tokenIds[i]
          )
        ) {
          setTokenId(autoDispatch.collection?.tokenIds[i]);
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
          chain: polygon,
          functionName: "approve",
          args: [
            Number(autoDispatch.collection?.blockNumber) < 45189643
              ? CHROMADIN_MARKETPLACE_CONTRACT
              : CHROMADIN_MARKETPLACE_CONTRACT_UPDATED,
            ethers.utils.parseEther(totalAmount.toString()),
          ],
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
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      let simulateContract;

      try {
        simulateContract = await publicClient.simulateContract({
          address:
            Number(autoDispatch.collection?.blockNumber) < 45189643
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

      const res = await clientWallet.writeContract(simulateContract.request);
      await publicClient.waitForTransactionReceipt({ hash: res });

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

      fulfillerGroups[autoDispatch?.collection?.coinOp?.fulfillerAddress!] = [
        autoDispatch?.collection?.coinOp!,
      ];

      const returned = await encryptItems(
        litClient,
        dispatch,
        {
          sizes: [autoDispatch?.collection?.coinOp?.chosenSize!],
          colors: [autoDispatch?.collection?.coinOp?.chosenColor!],
          collectionIds: [
            Number(autoDispatch?.collection?.coinOp?.collectionId),
          ],
          collectionAmounts: [1],
        },
        fulfillerGroups,
        fulfillmentDetails,
        address!
      );

      const { request } = await publicClient.simulateContract({
        address: COIN_OP_MARKET.toLowerCase() as `0x${string}`,
        abi: CoinOpMarketABI,
        functionName: "buyTokens",
        args: [
          {
            preRollIds: [
              Number(autoDispatch?.collection?.coinOp?.collectionId),
            ],
            preRollAmounts: [1],
            preRollIndexes: [0],
            customIds: [],
            customAmounts: [],
            customIndexes: [],
            fulfillmentDetails: JSON.stringify(returned?.fulfillerDetails),
            pkpTokenId: "",
            chosenTokenAddress: ACCEPTED_TOKENS.find(
              ([_, token]) => token === currency
            )?.[2],
            sinPKP: true,
          },
        ],
        account: address?.toLowerCase() as any,
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
    if (autoDispatch.collection?.acceptedTokens) {
      getTotalAmount();
    }
  }, [currency, autoDispatch.collection, viewScreenNFT]);

  useEffect(() => {
    if (address) {
      getAllowance();
    }
  }, [address, totalAmount, autoDispatch.collection, viewScreenNFT]);

  useEffect(() => {
    if (autoDispatch.collection) {
      getTokenId();
    }
    dispatch(
      setSuccess({
        actionOpen: false,
        actionMedia: autoDispatch.collection?.uri?.image?.includes("ipfs://")
          ? autoDispatch.collection?.uri?.image?.split("ipfs://")[1]
          : autoDispatch.collection?.uri?.image,
        actionName: autoDispatch.collection?.name,
        actionCoinOp: false,
      })
    );
  }, [autoDispatch.collection]);

  return {
    currency,
    setCurrency,
    totalAmount,
    approved,
    buyNFT,
    approveSpend,
    purchaseLoading,
    oracleValue,
    cryptoCheckoutLoading,
    handleCheckoutCrypto,
  };
};

export default usePurchase;
