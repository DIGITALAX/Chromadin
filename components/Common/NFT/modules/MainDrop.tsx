import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { MainDropProps } from "../types/nft.types";
import { setImageViewer } from "@/redux/reducers/imageViewerSlice";

const MainDrop: FunctionComponent<MainDropProps> = ({
  mainNFT,
  collectionsLoading,
  dispatch,
  router,
}): JSX.Element => {
  return (
    <div className="relative w-full h-96 sm:h-full flex">
      <div className="relative w-full h-full flex" id="staticLoad">
        {mainNFT?.media &&
          (!mainNFT?.type?.includes("video") ? (
            <Image
              src={`${INFURA_GATEWAY}/ipfs/${mainNFT?.media}`}
              layout="fill"
              objectFit="cover"
              draggable={false}
              objectPosition="top"
              alt="nft"
              key={mainNFT?.media}
            />
          ) : (
            <video
              muted
              autoPlay
              playsInline
              loop
              key={mainNFT?.media}
              className="w-full h-full object-cover"
            >
              <source
                src={`${INFURA_GATEWAY}/ipfs/${mainNFT?.media}`}
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
              `/autograph/${mainNFT?.creator?.name}`
            )
          }
        >
          {mainNFT?.creator?.media && (
            <Image
              src={mainNFT?.creator?.media}
              layout="fill"
              alt="pfp"
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
                  mainNFT?.creator?.name?.split(".lens")[0]
                }/collection/${mainNFT?.name
                  ?.replaceAll(" ", "_")
                  .toLowerCase()}`
              )
            }
          >
            {collectionsLoading ? "7zXj@tE$vU^%" : mainNFT?.name}
          </div>
        </div>
        <div
          className="relative w-5 h-5 cursor-pointer justify-end items-end flex ml-auto"
          onClick={() =>
            dispatch(
              setImageViewer({
                actionValue: true,
                actionImage: mainNFT?.media,
                actionType: mainNFT?.type,
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
