import { ACCEPTED_TOKENS, CHROMADIN_OPEN_ACTION } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { chains } from "@lens-chain/sdk/viem";
import { useContext, useEffect, useState } from "react";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import findBalance from "@/app/lib/helpers/findBalance";
import { Collection, Indexar } from "../../Common/types/common.types";
import pollResult from "@/app/lib/helpers/pollResult";
import { executePostAction } from "@lens-protocol/client/actions";
import { blockchainData } from "@lens-protocol/client";
import { usePathname } from "next/navigation";

const useFulfillment = (dict: any, collection?: Collection) => {
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: chains.mainnet,
    transport: http(`https://rpc.lens.xyz`),
  });
  const path = usePathname();
  const coder = new ethers.AbiCoder();
  const context = useContext(ModalContext);
  const [approved, setApproved] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>(
    ACCEPTED_TOKENS.filter(
      (token) =>
        token[1]?.toLowerCase() ===
        (path?.includes("/autograph/")
          ? collection
          : context?.collectionInfo?.main
        )?.acceptedTokens?.[0]?.toLowerCase()
    )?.[0]?.[1] ?? ACCEPTED_TOKENS[1][1]
  );
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(
    !Number.isNaN(
      (path?.includes("/autograph/")
        ? collection
        : context?.collectionInfo?.main
      )?.price
    ) &&
      isFinite(
        Number(
          (path?.includes("/autograph/")
            ? collection
            : context?.collectionInfo?.main
          )?.price
        )
      )
      ? Number(
          (
            Number(
              (path?.includes("/autograph/")
                ? collection
                : context?.collectionInfo?.main
              )?.price
            ) /
            10 ** 18
          )?.toFixed(2)
        )
      : 0
  );

  const getAllowance = async () => {
    try {
      const data = await publicClient.readContract({
        address: ACCEPTED_TOKENS.filter(
          (token) => token[1].toLowerCase() === currency?.toLowerCase()
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
    let number: number = Number(
        (path?.includes("/autograph/")
          ? collection
          : context?.collectionInfo?.main
        )?.price
      ),
      currentCurrency = currency;

    if (!currentCurrency) {
      currentCurrency = ACCEPTED_TOKENS.find(
        (token) =>
          token[1].toLowerCase() ===
          (path?.includes("/autograph/")
            ? collection
            : context?.collectionInfo?.main
          )?.acceptedTokens?.[0]?.toLowerCase()
      )?.[1]!;
      setCurrency(
        ACCEPTED_TOKENS.find(
          (token) =>
            token[1].toLowerCase() ===
            (path?.includes("/autograph/")
              ? collection
              : context?.collectionInfo?.main
            )?.acceptedTokens?.[0]?.toLowerCase()
        )?.[1]!
      );

      number = Number(
        (path?.includes("/autograph/")
          ? collection
          : context?.collectionInfo?.main
        )?.price
      );
    }
    setTotalAmount(
      (Number(number) /
        Number(
          context?.oracleData?.find(
            (oracle) =>
              oracle.currency?.toLowerCase() === currentCurrency?.toLowerCase()
          )?.rate
        )) *
        Number(
          context?.oracleData?.find(
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
        chain: chains.mainnet,
        transport: custom((window as any).ethereum),
      });

      let simulateContract;
      try {
        simulateContract = await publicClient.simulateContract({
          address: ACCEPTED_TOKENS.find(
            (token) => token[1].toLowerCase() === currency?.toLowerCase()
          )?.[1] as `0x${string}`,
          abi: [
            {
              type: "function",
              name: "approve",
              inputs: [
                { name: "spender", type: "address", internalType: "address" },
                { name: "value", type: "uint256", internalType: "uint256" },
              ],
              outputs: [{ name: "", type: "bool", internalType: "bool" }],
              stateMutability: "nonpayable",
            },
          ],
          functionName: "approve",
          args: [CHROMADIN_OPEN_ACTION, BigInt(totalAmount * 1.1)],
          chain: chains.mainnet,
          account: address,
        });
      } catch (err: any) {
        if (err.message.includes("Insufficient Approval Allowance")) {
          context?.setModalOpen(dict?.pocket);
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
          (item) => item[1].toLowerCase() == currency?.toLowerCase()
        )?.[1]!,
        address as `0x${string}`
      );

      if (
        Number(balance) / 10 ** 18 <
        Number(
          (path?.includes("/autograph/")
            ? collection
            : context?.collectionInfo?.main
          )?.price
        ) /
          Number(
            context?.oracleData?.find(
              (oracle) =>
                oracle.currency?.toLowerCase() ===
                ACCEPTED_TOKENS?.find(
                  (item) => item[1].toLowerCase() == currency?.toLowerCase()
                )?.[1]?.toLowerCase()
            )?.rate
          )
      ) {
        context?.setModalOpen(dict?.wrong);
        setPurchaseLoading(false);
        return;
      }

      const res = await executePostAction(
        context?.lensConectado?.sessionClient!,
        {
          post: (path?.includes("/autograph/")
            ? collection
            : context?.collectionInfo?.main
          )?.postId,
          action: {
            unknown: {
              address: CHROMADIN_OPEN_ACTION,
              params: [
                {
                  key: ethers.keccak256(
                    ethers.toUtf8Bytes("lens.param.buyChromadin")
                  ),
                  data: blockchainData(
                    coder.encode(
                      ["string[]", "address[]", "uint256[]", "uint8[]"],
                      [
                        [],
                        [
                          ACCEPTED_TOKENS?.find(
                            (item) =>
                              item[1].toLowerCase() == currency?.toLowerCase()
                          )?.[1],
                        ],
                        [],
                        [1],
                      ]
                    )
                  ),
                },
              ],
            },
          },
        }
      );

      if (res.isErr()) {
        context?.setModalOpen?.(dict?.wrong);
        setPurchaseLoading(false);
        return;
      }

      if ((res.value as any)?.reason?.includes("Signless")) {
        context?.setSignless?.(true);
      } else if ((res.value as any)?.raw) {
        context?.setIndexar(dict?.indexCol);
        const provider = new ethers.BrowserProvider(window.ethereum);

        const signer = await provider.getSigner();

        const tx = {
          chainId: (res.value as any)?.raw?.chainId,
          from: (res.value as any)?.raw?.from,
          to: (res.value as any)?.raw?.to,
          nonce: (res.value as any)?.raw?.nonce,
          gasLimit: (res.value as any)?.raw?.gasLimit,
          maxFeePerGas: (res.value as any)?.raw?.maxFeePerGas,
          maxPriorityFeePerGas: (res.value as any)?.raw?.maxPriorityFeePerGas,
          value: (res.value as any)?.raw?.value,
          data: (res.value as any)?.raw?.data,
        };
        const txResponse = await signer.sendTransaction(tx);
        await txResponse.wait();

        context?.setIndexar(Indexar.Exito);
        context?.setSuccess({
          open: true,
          media: (path?.includes("/autograph/")
            ? collection
            : context?.collectionInfo?.main
          )?.metadata?.images?.[0],
        });
      } else if ((res.value as any)?.hash) {
        context?.setIndexar(Indexar.Indexando);
        if (
          await pollResult(
            (res.value as any)?.hash,
            context?.lensConectado?.sessionClient!
          )
        ) {
          context?.setIndexar(Indexar.Exito);
          context?.setSuccess({
            open: true,
            media: (path?.includes("/autograph/")
              ? collection
              : context?.collectionInfo?.main
            )?.metadata?.images?.[0],
          });
        } else {
          context?.setModalOpen?.(dict?.wrong);
        }
      } else {
        context?.setModalOpen?.(dict?.wrong);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setTimeout(() => {
      context?.setIndexar(Indexar.Inactivo);
    }, 3000);
    setPurchaseLoading(false);
  };

  useEffect(() => {
    if (
      (path?.includes("/autograph/")
        ? collection
        : context?.collectionInfo?.main
      )?.acceptedTokens &&
      context?.oracleData
    ) {
      getTotalAmount();
    }
  }, [
    currency,
    context?.collectionInfo?.main,
    collection,
    context?.oracleData,
  ]);

  useEffect(() => {
    if (address && totalAmount > 0 && currency) {
      getAllowance();
    }
  }, [
    address,
    totalAmount,
    context?.collectionInfo?.main,
    collection,
    currency,
  ]);

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
