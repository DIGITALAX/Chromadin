import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { MainDropProps } from "../types/nft.types";
import { setImageViewer } from "@/redux/reducers/imageViewerSlice";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import handleImageError from "@/lib/helpers/handleImageError";

const MainDrop: FunctionComponent<MainDropProps> = ({
  mainNFT,
  collectionsLoading,
  dispatch,
  router,
}): JSX.Element => {
  const pfp = createProfilePicture(mainNFT?.publication?.by?.metadata?.picture);
  return (
    <div className="relative w-full h-96 sm:h-full flex">
      <div className="relative w-full h-full flex" id="staticLoad">
        {(mainNFT?.collectionMetadata?.images?.[0] ||
          mainNFT?.collectionMetadata?.video) &&
          (!mainNFT?.collectionMetadata?.mediaTypes?.includes("video") ? (
            <Image
              src={`${INFURA_GATEWAY}/ipfs/${
                mainNFT?.collectionMetadata?.images?.[0]?.split("ipfs://")?.[1]
              }`}
              layout="fill"
              objectFit="cover"
              draggable={false}
              objectPosition="top"
              key={mainNFT?.collectionMetadata?.images?.[0]}
            />
          ) : (
            <video
              muted
              autoPlay
              playsInline
              loop
              key={mainNFT?.collectionMetadata?.video}
              className="w-full h-full object-cover"
            >
              <source
                src={`${INFURA_GATEWAY}/ipfs/${
                  mainNFT?.collectionMetadata?.video?.split("ipfs://")?.[1]
                }`}
                type="video/mp4"
              />
            </video>
          ))}
      </div>
      <div className="absolute bottom-0 w-full h-fit flex flex-row pl-1 pr-3 py-1 gap-2 items-center grow">
        <div
          className="relative w-6 h-6 rounded-full border-white border cursor-pointer"
          id="crt"
          onClick={() =>
            router.push(
              `/autograph/${
                mainNFT?.publication?.by?.handle?.suggestedFormatted?.localName?.split(
                  "@"
                )?.[1]
              }`
            )
          }
        >
          {pfp && (
            <Image
              src={pfp}
              layout="fill"
              alt="pfp"
              onError={(e) => handleImageError(e)}
              className="flex rounded-full w-full h-full"
              draggable={false}
            />
          )}
        </div>
        <div className="relative flex flex-col w-fit h-full">
          <div className="relative w-full h-fit flex justify-start">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmWTqEMUT7gFC76t8FBHRUQZDWbdwwnPKXFzutGf2uc6sx`}
              width={130}
              height={30}
              alt="playing"
              className="flex"
              draggable={false}
            />
          </div>
          <div
            className="relative text-pesa text-sm font-geom capitalize flex cursor-pointer"
            id="glow"
            onClick={() =>
              router.push(
                `/autograph/${
                  mainNFT?.publication?.by?.handle?.suggestedFormatted?.localName?.split(
                    "@"
                  )?.[1]
                }/collection/${mainNFT?.collectionMetadata?.title
                  ?.replaceAll(" ", "_")
                  .toLowerCase()}`
              )
            }
          >
            {collectionsLoading
              ? "7zXj@tE$vU^%"
              : mainNFT?.collectionMetadata?.title}
          </div>
        </div>
        <div
          className="relative w-5 h-5 cursor-pointer justify-end items-end flex ml-auto"
          onClick={() =>
            dispatch(
              setImageViewer({
                actionValue: true,
                actionImage: `${INFURA_GATEWAY}/ipfs/${
                  mainNFT?.collectionMetadata?.images?.[0]?.split(
                    "ipfs://"
                  )?.[1] ||
                  mainNFT?.collectionMetadata?.video?.split("ipfs://")?.[1]
                }`,
                actionType: mainNFT?.collectionMetadata?.mediaTypes,
              })
            )
          }
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmVpncAteeF7voaGu1ZV5qP63UpZW2xmiCWVftL1QnL5ja`}
            alt="expand"
            layout="fill"
            className="flex items-center"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default MainDrop;
