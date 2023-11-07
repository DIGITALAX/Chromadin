import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { connectLit } from "./connectLit";
import { AnyAction, Dispatch } from "redux";

export const encryptToken = async (
  litClient: LitJsSdk.LitNodeClient | undefined,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}`,
  authSig: any,
  currentPKP: string
): Promise<string | undefined> => {
  try {
    let encryptedTokenId: string | undefined;
    let client = litClient;
    if (!client) {
      client = await connectLit(dispatch);
    }

    const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
      {
        accessControlConditions: [
          {
            contractAddress: "",
            standardContractType: "",
            chain: "polygon",
            method: "",
            parameters: [":userAddress"],
            returnValueTest: {
              comparator: "=",
              value: address?.toLowerCase() as string,
            },
          },
        ],
        authSig: authSig,
        chain: "polygon",
        dataToEncrypt: currentPKP,
      },
      client!
    );

    encryptedTokenId = JSON.stringify({
      ciphertext: ciphertext,
      dataToEncryptHash: dataToEncryptHash,
    });

    return encryptedTokenId;
  } catch (err: any) {
    console.error(err.message);
  }
};
