import { getCollectionNamesCoinOp } from "@/graphql/subgraph/queries/getCollectionNames";
import fetchIPFSJSON from "./fetchIPFSJSON";
import { Collection } from "@/components/Home/types/home.types";
import { PreRoll } from "@/components/Common/NFT/types/nft.types";

export const getCoinOpCollection = async (
  collection: Collection
): Promise<PreRoll | undefined> => {
  try {
    const coinOp = await getCollectionNamesCoinOp(collection.name);

    if (coinOp?.data?.collectionCreateds?.[0]) {
      const uri = await fetchIPFSJSON(
        (coinOp?.data?.collectionCreateds?.[0].uri as any)?.split("ipfs://")[1]
      );

      const modifiedObj = {
        ...coinOp?.data?.collectionCreateds?.[0],
        uri,
        chosenSize:
          coinOp?.data?.collectionCreateds?.[0].printType === "sticker"
            ? '2"x2"'
            : coinOp?.data?.collectionCreateds?.[0].printType === "poster"
            ? '11"x17"'
            : "M",
        chosenColor: "#ffffff",
        colors:
          coinOp?.data?.collectionCreateds?.[0].printType === "sticker"
            ? ["#ffffff"]
            : coinOp?.data?.collectionCreateds?.[0].printType === "poster"
            ? ["#ffffff"]
            : ["#030D6B", "#FBDB86", "#ffffff", "#000000"],
        sizes:
          coinOp?.data?.collectionCreateds?.[0].printType === "sticker"
            ? ['2"x2"', '4"x4"', '6"x6"']
            : coinOp?.data?.collectionCreateds?.[0].printType === "poster"
            ? ['11"x17"', '18"x24"', '24"x36"']
            : ["XS", "S", "M", "L", "XL"],
        bgColor:
          coinOp?.data?.collectionCreateds?.[0].printType === "hoodie"
            ? "#32C5FF"
            : coinOp?.data?.collectionCreateds?.[0].printType === "shirt"
            ? "#6236FF"
            : coinOp?.data?.collectionCreateds?.[0].printType === "poster"
            ? "#FFC800"
            : coinOp?.data?.collectionCreateds?.[0].printType === "sleeve"
            ? "#29C28A"
            : "#B620E0",
        currentIndex: 0,
      };

      return modifiedObj;
    } else {
      return undefined;
    }
  } catch (err: any) {
    console.error(err.message);
  }
};
