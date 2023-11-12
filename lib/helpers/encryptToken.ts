import * as LitJsSdk from "@lit-protocol/lit-node-client";

export const encryptToken = async (
  client: LitJsSdk.LitNodeClient | undefined,
  address: `0x${string}`,
  authSig: any,
  currentPKP: string
): Promise<string | undefined> => {
  try {
    let encryptedTokenId: string | undefined;

    const accessControlConditions = [
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
        authSig: authSig,
        chain: "polygon",
        dataToEncrypt: currentPKP,
      },
      client!
    );

    encryptedTokenId = JSON.stringify({
      ciphertext,
      dataToEncryptHash,
      accessControlConditions,
    });

    return encryptedTokenId;
  } catch (err: any) {
    console.error(err.message);
  }
};
