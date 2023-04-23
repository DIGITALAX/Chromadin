import { FunctionComponent } from "react";
import { DropsProps } from "../types/collections.types";
import { setMainNFT } from "@/redux/reducers/mainNFTSlice";
import { Collection } from "@/components/Home/types/home.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import { setOptions } from "@/redux/reducers/optionsSlice";

const Drops: FunctionComponent<DropsProps> = ({
  collections,
  dispatch,
  dispatchCollections,
  collectionsLoading,
}): JSX.Element => {
  return (
    <div className="relative w-[80%] h-full p-4 flex flex-row gap-4">
      {collectionsLoading
        ? Array.from({ length: 7 }).map((_: any, index: number) => {
            return (
              <div
                className="relative w-60 h-40 flex flex-col items-center shrink-0 cursor-pointer opacity-30 animate-pulse"
                key={index}
              >
                <div
                  className="relative w-full h-full border-white border"
                  id="staticLoad"
                ></div>
                <div className="relative w-full h-fit flex flex-row items-center gap-2">
                  <div className="rounded-full bg-verde h-2 w-2"></div>
                  <div className="relative w-fit h-fit font-geom text-xs text-verde whitespace-nowrap">
                    TboPcMv^&fN
                  </div>
                  <div className="relative w-fit h-fit font-geom text-xs text-white whitespace-nowrap">
                    {" "}
                    — H!lPn&bQ@f
                  </div>
                </div>
              </div>
            );
          })
        : (collections?.length < 0 ? dispatchCollections : collections)?.map(
            (collection: Collection, index: number) => {
              const profileImage = createProfilePicture(
                collection?.profile,
                false
              );
              return (
                <div
                  className="relative w-60 h-40 flex flex-col items-center shrink-0 cursor-pointer"
                  key={index}
                  onClick={() => {
                    dispatch(
                      setMainNFT({
                        name: collection?.name,
                        media: collection?.uri?.image?.split("ipfs://")[1],
                        description: collection?.uri?.description,
                        type: collection?.uri?.type,
                        drop: collection?.drop,
                        creator: {
                          media: profileImage,
                          name: collection?.profile?.handle,
                        },
                        price: collection?.basePrices,
                        acceptedTokens: collection?.acceptedTokens,
                        tokenIds: collection?.tokenIds,
                        tokensSold: collection?.soldTokens,
                      })
                    );
                    dispatch(setOptions("fulfillment"));
                  }}
                >
                  <div
                    className="relative w-full h-full border-white border"
                    id="staticLoad"
                  >
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/${
                        collection.uri.image.split("ipfs://")[1]
                      }`}
                      layout="fill"
                      objectFit="cover"
                      objectPosition="top"
                      className="w-full h-full"
                      draggable={false}
                    />
                  </div>
                  <div className="relative w-full h-fit flex flex-row items-center gap-2">
                    <div className="rounded-full bg-verde h-2 w-2"></div>
                    <div className="relative w-fit h-fit font-geom text-xs text-verde whitespace-nowrap">
                      {collection?.drop?.name?.length > 15
                        ? collection?.drop?.name.slice(0, 15) + "..."
                        : collection?.drop?.name}
                    </div>
                    <div className="relative w-fit h-fit font-geom text-xs text-white whitespace-nowrap">
                      {" "}
                      —{" "}
                      {collection?.name?.length > 7
                        ? collection?.name.slice(0, 7) + "..."
                        : collection?.name}
                    </div>
                  </div>
                </div>
              );
            }
          )}
    </div>
  );
};

export default Drops;
