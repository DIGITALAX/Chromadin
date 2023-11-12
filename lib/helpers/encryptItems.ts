import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { PreRoll } from "@/components/Common/NFT/types/nft.types";
import { Details } from "@/redux/reducers/fulfillmentDetailsSlice";

export const encryptItems = async (
  client: LitJsSdk.LitNodeClient | undefined,
  information: {
    sizes: string[];
    colors: string[];
    collectionIds: number[];
    collectionAmounts: number[];
  },
  fulfillerGroups: { [key: string]: PreRoll[] },
  fulfillmentDetails: Details,
  address: `0x${string}`,
  authSigFiat?: any
): Promise<{ client: any; fulfillerDetails: string[] } | undefined> => {
  try {
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

      const accessControlConditions = [
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
      ];

      const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
        {
          accessControlConditions,
          authSig,
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
          ciphertext,
          dataToEncryptHash,
          accessControlConditions,
        })
      );
    }

    return { fulfillerDetails, client };
  } catch (err: any) {
    console.error(err.message);
  }
};
