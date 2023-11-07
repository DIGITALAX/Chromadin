import { joinSignature } from "@ethersproject/bytes";
import { serialize } from "@ethersproject/transactions";
import { AnyAction, Dispatch } from "redux";
import { ethers } from "ethers";
import { connectLit } from "./connectLit";

export const litExecute = async (
  provider: ethers.providers.JsonRpcProvider,
  dispatch: Dispatch<AnyAction>,
  litClient: any,
  tx: any,
  sigName: string,
  authSig: any,
  retryCount: number = 0
) => {
  let client = litClient;
  if (!client) {
    client = await connectLit(dispatch);
  }

  const maxRetries = 5;

  try {
    const results = await client.executeJs({
      ipfsId: process.env.IPFS_CID_PKP!,
      authSig,
      jsParams: {
        publicKey: process.env.PKP_PUBLIC_KEY!,
        tx,
        sigName,
      },
    });

    const signature = results.signatures[sigName];
    const sig: {
      r: string;
      s: string;
      recid: number;
      signature: string;
      publicKey: string;
      dataSigned: string;
    } = signature as {
      r: string;
      s: string;
      recid: number;
      signature: string;
      publicKey: string;
      dataSigned: string;
    };

    const encodedSignature = joinSignature({
      r: "0x" + sig.r,
      s: "0x" + sig.s,
      recoveryParam: sig.recid,
    });
    const serialized = serialize(tx as any, encodedSignature);
    const transactionHash = await provider.sendTransaction(serialized);

    await transactionHash.wait();
  } catch (err: any) {
    if (
      (err.message.includes("timeout") ||
        err.message.includes("underpriced")) &&
      retryCount < maxRetries
    ) {
      console.warn(`Retry attempt ${retryCount + 1} after timeout error.`);
      await litExecute(
        provider,
        dispatch,
        litClient,
        tx,
        sigName,
        authSig,
        retryCount + 1
      );
    } else {
      console.error(err.message);
    }
  }
};
