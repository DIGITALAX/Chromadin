import { FunctionComponent } from "react";
import { DropsProps } from "../types/collections.types";
import { setMainNFT } from "@/redux/reducers/mainNFTSlice";
import { Collection } from "@/components/Home/types/home.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import createProfilePicture from "@/lib/helpers/createProfilePicture";

const Drops: FunctionComponent<DropsProps> = ({
  collections,
  dispatch,
  dispatchCollections,
}): JSX.Element => {
  return (
    <div className="relative w-[80%] h-full p-4 flex flex-row gap-4">
      {(collections.length < 0 ? dispatchCollections : collections)?.map(
        (collection: Collection, index: number) => {
          const profileImage = createProfilePicture(collection.profile, false);
          return (
            <div
              className="relative w-60 h-40 flex flex-col items-center shrink-0 cursor-pointer"
              key={index}
              onClick={() =>
                dispatch(
                  setMainNFT({
                    name: collection.name,
                    media: collection.uri.image.split("ipfs://")[1],
                    description: collection.uri.description,
                    type: collection.uri.type,
                    drop: collection.drop,
                    creator: {
                      media: profileImage,
                      name: collection.profile?.handle,
                    },
                    price: collection.prices,
                  })
                )
              }
            >
              <div className="relative w-full h-full border-white border">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${
                    collection.uri.image.split("ipfs://")[1]
                  }`}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                  draggable={false}
                />
              </div>
              <div className="relative w-full h-fit flex flex-row items-center gap-2">
                <div className="rounded-full bg-verde h-2 w-2"></div>
                <div className="relative w-fit h-fit font-geom text-xs text-verde whitespace-nowrap">
                  {collection?.drop?.name}
                </div>
                <div className="relative w-fit h-fit font-geom text-xs text-white whitespace-nowrap">
                  {" "}
                  —{" "}
                  {collection?.name?.length > 20
                    ? collection?.name.slice(0, 20) + "..."
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
