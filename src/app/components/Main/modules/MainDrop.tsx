import { INFURA_GATEWAY } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { FunctionComponent, JSX, useContext } from "react";

const MainDrop: FunctionComponent = (): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);

  return (
    <div className="relative w-full h-96 sm:h-full flex">
      <div className="relative w-full h-full flex" id="staticLoad">
        {(context?.collectionInfo?.main?.metadata?.images?.[0] ||
          context?.collectionInfo?.main?.metadata?.video) &&
          (!context?.collectionInfo?.main?.metadata?.mediaTypes?.includes(
            "video"
          ) ? (
            <Image
              src={`${INFURA_GATEWAY}/ipfs/${
                context?.collectionInfo?.main?.metadata?.images?.[0]?.split(
                  "ipfs://"
                )?.[1]
              }`}
              layout="fill"
              objectFit="cover"
              draggable={false}
              objectPosition="top"
              key={
                context?.collectionInfo?.main?.metadata?.images?.[0]
              }
            />
          ) : (
            <video
              muted
              autoPlay
              playsInline
              loop
              key={context?.collectionInfo?.main?.metadata?.video}
              className="w-full h-full object-cover"
            >
              <source
                src={`${INFURA_GATEWAY}/ipfs/${
                  context?.collectionInfo?.main?.metadata?.video?.split(
                    "ipfs://"
                  )?.[1]
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
              `/autograph/${context?.collectionInfo?.main?.publication?.author?.username?.localName}`
            )
          }
        >
          {context?.collectionInfo?.main?.publication?.author?.metadata?.picture?.split(
            "ipfs://"
          )?.[1] && (
            <Image
              src={`${INFURA_GATEWAY}/ipfs/${
                context?.collectionInfo?.main?.publication?.author?.metadata?.picture?.split(
                  "ipfs://"
                )?.[1]
              }`}
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
                  context?.collectionInfo?.main?.publication?.author?.username
                    ?.localName
                }/collection/${context?.collectionInfo?.main?.metadata?.title
                  ?.replaceAll(" ", "_")
                  .toLowerCase()}`
              )
            }
          >
            {!context?.collectionInfo?.main
              ? "7zXj@tE$vU^%"
              : context?.collectionInfo?.main?.metadata?.title}
          </div>
        </div>
        <div
          className="relative w-5 h-5 cursor-pointer justify-end items-end flex ml-auto"
          onClick={() =>
            context?.setVerImagen({
              item: `${INFURA_GATEWAY}/ipfs/${
                context?.collectionInfo?.main?.metadata?.images?.[0]?.split(
                  "ipfs://"
                )?.[1] ||
                context?.collectionInfo?.main?.metadata?.video?.split(
                  "ipfs://"
                )?.[1]
              }`,
              type: context?.collectionInfo?.main?.metadata
                ?.mediaTypes!,
            })
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
