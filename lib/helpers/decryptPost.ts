import {
  Mirror,
  Post,
  Quote,
  Comment,
} from "@/components/Home/types/generated";
import { LensEnvironment, LensGatedSDK } from "@lens-protocol/sdk-gated";
import fetchIPFSJSON from "./fetchIPFSJSON";
import { Web3Provider } from "@ethersproject/providers";

export const decryptPostArray = async (
  address: `0x${string}` | undefined,
  sortedArr: (Post | Quote | Mirror)[]
): Promise<(Post | Quote | Mirror)[]> => {
  if (address) {
    const provider = new Web3Provider((window as any)?.ethereum as any);
    const signer = provider?.getSigner();
    if (signer) {
      const sdk = await LensGatedSDK.create({
        provider,
        signer,
        env: LensEnvironment.Polygon,
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
              const fetch = (
                post.__typename === "Mirror"
                  ? post.mirrorOn?.metadata?.rawURI
                  : (post as Post | Quote)?.metadata?.rawURI
              )
                ?.split("ipfs://")?.[1]
                ?.replace(/"/g, "")
                ?.trim();

              const data = await fetchIPFSJSON(fetch);
              const { decrypted } = await sdk.gated.decryptMetadata(data);
              if (decrypted) {
                return {
                  ...post,
                  decrypted,
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
    }
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
  post: Post | Comment | Quote | Mirror
): Promise<Post | Comment | Quote | Mirror> => {
  if (address) {
    const provider = new Web3Provider((window as any)?.ethereum as any);
    const signer = provider?.getSigner();
    if (signer) {
      const sdk = await LensGatedSDK.create({
        provider: new Web3Provider((window as any)?.ethereum as any),
        signer: signer as any,
        env: LensEnvironment.Polygon,
      });

      if (
        (post.__typename !== "Mirror" ? (post as Post) : post.mirrorOn)
          ?.operations.canDecrypt &&
        (post.__typename !== "Mirror" ? (post as Post) : post.mirrorOn)
          ?.isEncrypted
      ) {
        try {
          const data = await fetchIPFSJSON(
            (post.__typename !== "Mirror" ? (post as Post) : post.mirrorOn)
              ?.metadata.rawURI
          );
          const { decrypted } = await sdk.gated.decryptMetadata(data);
          if (decrypted) {
            post = {
              ...post,
              decrypted,
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
