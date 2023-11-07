import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { connectLit } from "./connectLit";
import { AnyAction, Dispatch } from "redux";
import { PreRoll } from "@/components/Common/NFT/types/nft.types";

export const encryptItems = async (
  litClient: LitJsSdk.LitNodeClient | undefined,
  dispatch: Dispatch<AnyAction>,
  information: {
    sizes: string[];
    colors: string[];
    collectionIds: number[];
    collectionAmounts: number[];
  },
  fulfillerGroups: { [key: string]: PreRoll[] },
  fulfillmentDetails: {
    name: string;
    contact: string;
    address: string;
    zip: string;
    city: string;
    state: string;
    country: string;
  },
  address: `0x${string}`,
  authSigFiat?: any
): Promise<{ client: any; fulfillerDetails: string[] } | undefined> => {
  try {
    let client = litClient;
    if (!client) {
      client = await connectLit(dispatch);
    }
    let authSig;
    if (!authSigFiat) {
      authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: "polygon",
      });
    } else {
      authSig = authSigFiat;
    }

    let fulfillerDetails = [];

    for (let fulfillerAddress in fulfillerGroups) {
      let fulfillerEditions: any[] = [];

      fulfillerGroups[fulfillerAddress].forEach((item) => {
        fulfillerEditions.push({
          contractAddress: "",
          standardContractType: "",
          chain: "polygon",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: item.fulfillerAddress.toLowerCase(),
          },
        });

        fulfillerEditions.push({
          operator: "or",
        });
      });

      const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
        {
          accessControlConditions: [
            ...fulfillerEditions,
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
          dataToEncrypt: JSON.stringify({
            ...fulfillmentDetails,
            ...information,
          }),
        },
        client!
      );

      fulfillerDetails.push(
        JSON.stringify({
          fulfillerAddress,
          ciphertext: ciphertext,
          dataToEncryptHash: dataToEncryptHash,
        })
      );
    }

    return { fulfillerDetails, client };
  } catch (err: any) {
    console.error(err.message);
  }
};
