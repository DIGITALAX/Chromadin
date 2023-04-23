import { CHROMADIN_MARKETPLACE_CONTRACT } from "@/lib/constants";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { waitForTransaction } from "@wagmi/core";
import {
  usePrepareContractWrite,
  useContractWrite,
  useContractRead,
  useAccount,
} from "wagmi";
import { ethers } from "ethers";
import ChromadinMarketplaceABI from "./../../../../abis/ChromadinMarketplace.json";
import { setError } from "@/redux/reducers/errorSlice";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { setSuccess } from "@/redux/reducers/successSlice";

const useFulfillment = () => {
  const acceptedTokens: string[][] = [
    ["MATIC", "0x6199a505ec1707695ce49b59a07a147f2d50f22d"],
    ["WETH", "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"],
    ["USDT", "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"],
    ["MONA", "0x6968105460f67c3bf751be7c15f92f5286fd0ce5"],
  ];
  const dispatch = useDispatch();
  const mainNFT = useSelector(
    (state: RootState) => state.app.mainNFTReducer.value
  );
  const productType = useSelector(
    (state: RootState) => state.app.productTypeReducer.value
  );
  const success = useSelector((state: RootState) => state.app.successReducer);
  const { address } = useAccount();
  const [approved, setApproved] = useState<boolean>(false);
  const [tokenId, setTokenId] = useState<string>();
  const [selectSize, setSelectSize] = useState<number>(0);
  const [baseColor, setBaseColor] = useState<number>(0);
  const [currency, setCurrency] = useState<string>(
    acceptedTokens.filter(
      (token) =>
        token[1]?.toLowerCase() === mainNFT?.acceptedTokens?.[0]?.toLowerCase()
    )?.[0]?.[0]
  );
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false);
  const [posterSize, setPosterSize] = useState<number>(0);
  const [stickerPack, setStickerPack] = useState<number>(0);
  const [posterAmount, setPosterAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(
    !Number.isNaN(mainNFT?.price?.[0]) && isFinite(Number(mainNFT?.price?.[0]))
      ? Number(mainNFT?.price?.[0]) / 10 ** 18
      : 0
  );

  const { data } = useContractRead({
    address: acceptedTokens.filter(
      (token) =>
        token[1].toLowerCase() === mainNFT?.acceptedTokens?.[0].toLowerCase()
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
    args: [address as `0x${string}`, CHROMADIN_MARKETPLACE_CONTRACT],
    enabled: Boolean(address) || Boolean(approved),
  });

  const { config } = usePrepareContractWrite({
    address: acceptedTokens.filter(
      (token) =>
        token[1].toLowerCase() === mainNFT?.acceptedTokens?.[0].toLowerCase()
    )?.[0]?.[1] as `0x${string}`,
    abi: [
      {
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
    ],
    functionName: "approve",
    args: [
      CHROMADIN_MARKETPLACE_CONTRACT,
      ethers.utils.parseEther(totalAmount.toString()),
    ],
    enabled: Boolean(!Number.isNaN(totalAmount)),
  });

  const { config: buyNFTConfig } = usePrepareContractWrite({
    address: CHROMADIN_MARKETPLACE_CONTRACT,
    abi: ChromadinMarketplaceABI,
    args: [
      [tokenId],
      acceptedTokens.filter(
        (token) =>
          token[1].toLowerCase() === mainNFT?.acceptedTokens?.[0].toLowerCase()
      )?.[0]?.[1] as `0x${string}`,
    ],
    functionName: "buyTokens",
    enabled: Boolean(tokenId),
  });

  const { writeAsync } = useContractWrite(config);
  const { writeAsync: buyNFTAsync } = useContractWrite(buyNFTConfig);

  const getTotalAmount = () => {
    let number;
    if (
      mainNFT?.acceptedTokens.find(
        (token) =>
          token === acceptedTokens.find((token) => token[0] === currency)?.[1]!
      )
    ) {
      number =
        Number(
          mainNFT?.price[
            mainNFT?.acceptedTokens.indexOf(
              acceptedTokens.find((token) => token[0] === currency)?.[1]!
            )
          ]
        ) /
        10 ** 18;
    } else {
      setCurrency(
        acceptedTokens.find(
          (token) =>
            token[1]?.toLowerCase() ===
            mainNFT?.acceptedTokens[0]?.toLowerCase()
        )?.[0]!
      );
      number =
        Number(
          mainNFT?.price[
            mainNFT?.acceptedTokens.indexOf(
              acceptedTokens
                .find(
                  (token) =>
                    token[1].toLowerCase() ===
                    mainNFT?.acceptedTokens[0].toLowerCase()
                )?.[1]
                ?.toLowerCase()!
            )
          ]
        ) /
        10 ** 18;
    }
    setTotalAmount(number);
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
      const tx = await writeAsync?.();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      if (res.status === 1) {
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
    try {
      const tx = await buyNFTAsync?.();
      await waitForTransaction({
        hash: tx?.hash!,
      });
      dispatch(
        setSuccess({
          actionOpen: true,
          actionMedia: success.media,
          actionName: success.name,
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
      if (!err.message.includes("User rejected request")) {
        dispatch(setError(true));
      }
      console.error(err.message);
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
      if (Number(data?.toBigInt()?.toString()) / 10 ** 18 >= totalAmount) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    }
  }, [address, totalAmount, mainNFT, data]);

  useEffect(() => {
    if (mainNFT) {
      getTokenId();
    }
    dispatch(
      setSuccess({
        actionOpen: false,
        actionMedia: mainNFT?.media,
        actionName: mainNFT?.name,
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
    stickerPack,
    setStickerPack,
    posterSize,
    setPosterSize,
    posterAmount,
    setPosterAmount,
    totalAmount,
    approved,
    buyNFT,
    approveSpend,
    purchaseLoading,
  };
};

export default useFulfillment;
