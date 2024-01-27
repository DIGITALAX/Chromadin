import {
  Mirror,
  Post,
  Quote,
  Comment,
} from "@/components/Home/types/generated";
import { Address, WalletClient } from "viem";
import {
  AnyEncryptablePublicationMetadataFragment,
  LensClient,
  production,
} from "@lens-protocol/client/gated";

export const decryptPostArray = async (
  address: `0x${string}` | undefined,
  sortedArr: (Post | Quote | Mirror)[],
  clientWallet: WalletClient
): Promise<(Post | Quote | Mirror)[]> => {
  if (address) {
    const client = new LensClient({
      environment: production,
      authentication: {
        domain: "chromadin",
        uri: "https://chromadin.xyz",
      },
      signer: {
        ...clientWallet,
        getAddress: async (): Promise<Address> => {
          const addresses = await clientWallet.getAddresses();
          return addresses?.[0] ?? "default-address-or-null";
        },

        signMessage: async (message: string): Promise<string> => {
          const account = (await clientWallet.getAddresses())?.[0];
          if (!account) {
            throw new Error("No account found for signing");
          }
          return clientWallet.signMessage({ account, message });
        },
      },
    });

    sortedArr = await Promise.all(
      sortedArr.map(async (post) => {
        if (
          (post.__typename === "Mirror"
            ? post.mirrorOn
            : (post as Post | Quote)
          )?.operations?.canDecrypt?.result &&
          (post.__typename !== "Mirror" ? (post as Post) : post.mirrorOn)
            ?.isEncrypted
        ) {
          try {
            const result =
              await client.gated.decryptPublicationMetadataFragment(
                (post as Post)
                  .metadata as AnyEncryptablePublicationMetadataFragment
              );
            if (!result.isFailure()) {
              return {
                ...post,
                decrypted: result.value,
              };
            } else {
              return {
                ...post,
                gated: true,
              };
            }
          } catch (err: any) {
            console.error(err.message);
            return {
              ...post,
              gated: true,
            };
          }
        } else if (
          (post as Post | Quote)?.metadata?.content?.includes(
            "This publication is gated"
          ) ||
          (post.__typename === "Mirror" &&
            post?.mirrorOn?.metadata?.content?.includes(
              "This publication is gated"
            ))
        ) {
          return {
            ...post,
            gated: true,
          };
        } else {
          return post;
        }
      })
    );
  } else {
    sortedArr = sortedArr.map((post) => {
      if (
        (post as Post | Quote)?.metadata?.content?.includes(
          "This publication is gated"
        ) ||
        (post.__typename === "Mirror" &&
          post.mirrorOn?.metadata?.content?.includes(
            "This publication is gated"
          ))
      ) {
        return {
          ...post,
          gated: true,
        };
      } else {
        return post;
      }
    });
  }

  return sortedArr;
};

export const decryptPostIndividual = async (
  address: `0x${string}` | undefined,
  post: Post | Comment | Quote | Mirror,
  clientWallet: WalletClient
): Promise<Post | Comment | Quote | Mirror> => {
  if (address) {
    const client = new LensClient({
      environment: production,
      authentication: {
        domain: "chromadin",
        uri: "https://chromadin.xyz",
      },
      signer: {
        ...clientWallet,
        getAddress: async (): Promise<Address> => {
          const addresses = await clientWallet.getAddresses();
          return addresses?.[0] ?? "default-address-or-null";
        },

        signMessage: async (message: string): Promise<string> => {
          const account = (await clientWallet.getAddresses())?.[0];
          if (!account) {
            throw new Error("No account found for signing");
          }
          return clientWallet.signMessage({ account, message });
        },
      },
    });

    if (
      (post.__typename !== "Mirror" ? (post as Post) : post.mirrorOn)
        ?.operations.canDecrypt &&
      (post.__typename !== "Mirror" ? (post as Post) : post.mirrorOn)
        ?.isEncrypted
    ) {
      try {
        const result = await client.gated.decryptPublicationMetadataFragment(
          (post as Post).metadata as AnyEncryptablePublicationMetadataFragment
        );
        if (!result.isFailure()) {
          post = {
            ...post,
            decrypted: result.value,
          } as any;
        } else {
          post = {
            ...post,
            gated: true,
          } as any;
        }
      } catch (err: any) {
        console.error(err.message);
        post = {
          ...post,
          gated: true,
        } as any;
      }
    } else if (
      (post.__typename !== "Mirror"
        ? (post as Post)
        : post.mirrorOn
      )?.metadata?.content?.includes("This publication is gated")
    ) {
      post = {
        ...post,
        gated: true,
      } as any;
    } else {
      post = post;
    }
  } else {
    if (
      (post.__typename !== "Mirror"
        ? (post as Post)
        : post.mirrorOn
      )?.metadata?.content?.includes("This publication is gated")
    ) {
      post = {
        ...post,
        gated: true,
      } as any;
    } else {
      post = post;
    }
  }

  return post;
};
