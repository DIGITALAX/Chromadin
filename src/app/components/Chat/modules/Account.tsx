import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { IoGlobeOutline } from "react-icons/io5";
import { MdOutlineShareLocation } from "react-icons/md";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { AccountProps } from "../types/chat.types";
import descriptionRegex from "@/app/lib/helpers/descriptionRegex";
import { Collection } from "../../Common/types/common.types";
import { useRouter } from "next/navigation";
import { ModalContext } from "@/app/providers";

const Account: FunctionComponent<AccountProps> = ({
  profile,
  dict,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit flex flex-col gap-2 items-start justify-center break-words">
      <div
        className="relative w-full h-44 rounded-md items-start flex justify-center"
        id="crt"
      >
        {profile?.metadata?.coverPicture && (
          <Image
            src={handleProfilePicture(profile?.metadata?.coverPicture)}
            draggable={false}
            className="rounded-md flex w-full h-full"
            layout="fill"
            objectFit="cover"
            objectPosition={"middle"}
          />
        )}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute top-2 right-2 w-fit h-fit flex flex-row gap-2 items-center justify-end ml-auto text-xs font-dosis text-white">
          <div
            className="relative w-fit h-fit flex bg-black/30 p-1 rounded-md cursor-pointer active:scale-95"
            onClick={() => context?.setFollow(profile)}
          >
            {profile?.operations?.isFollowedByMe
              ? dict?.Common?.unfo
              : dict?.Common?.foll}
          </div>
          {profile?.operations?.isFollowingMe && (
            <div className="relative w-fit h-fit flex bg-gray-400/30 p-1 rounded-md">
              {dict?.Common?.you}
            </div>
          )}
        </div>
      </div>
      <div className="relative w-full h-fit flex sm:flex-nowrap flex-wrap flex-col items-start justify-center -top-10 px-4 gap-2">
        <div className="relative w-full h-fit flex flex-row items-center justify-start gap-2 sm:flex-nowrap flex-wrap">
          <div
            className="relative w-20 h-20 rounded-full flex items-center justify-center"
            id="crt"
          >
            <Image
              src={handleProfilePicture(profile?.metadata?.picture)}
              onError={(e) => handleImageError(e)}
              className="rounded-full flex w-full h-full"
              layout="fill"
              objectFit="cover"
              objectPosition={"middle"}
              draggable={false}
            />
          </div>
          <div
            className="relative w-fit h-fit items-center justify-center font-dosis flex"
            id="username1"
          >
            {profile?.username?.localName}
          </div>
          <div className="relative justify-start preG:justify-end items-center w-full preG:w-fit h-fit font-dosis text-white flex flex-row gap-3 flex ml-auto text-sm preG:pt-0 pt-5">
            <div className="relative w-fit h-fit flex items-center justify-end flex flex-col">
              <div
                className="relative w-full h-fit items-center justify-end"
                id="username1"
              >
                {dict?.Common?.followers}
              </div>
              <div className="relative w-full h-fit items-center justify-end">
                {profile?.stats?.graphFollowStats?.followers}
              </div>
            </div>
            <div className="relative w-fit h-fit flex items-center justify-end flex flex-col">
              <div
                className="relative w-full h-fit items-center justify-end"
                id="username1"
              >
                {dict?.Common?.following}
              </div>
              <div className="relative w-full h-fit items-center justify-end">
                {profile?.stats?.graphFollowStats?.following}
              </div>
            </div>
          </div>
        </div>
        <div
          className="relative w-full break-words h-fit justify-start items-start text-left flex text-white font-dosis text-xs"
          dangerouslySetInnerHTML={{
            __html: descriptionRegex(profile?.metadata?.bio || ""),
          }}
        ></div>
        <div className="relative w-full h-fit flex flex-row items-start justify-center text-xs font-dosis text-white sm:flex-nowrap flex-wrap sm:gap-0 gap-3">
          <div className="relative w-full h-fit flex flex-row gap-4 justify-start items-center">
            {profile?.metadata?.attributes?.find(
              (attribute) => attribute.key === "location"
            )?.value && (
              <div className="relative w-fit h-fit flex flex-row justify-center items-center gap-1">
                <div className="relative flex w-fit h-fit justify-center items-center">
                  <MdOutlineShareLocation color="white" size={10} />
                </div>
                <div className="relative flex w-fit h-fit justify-center items-center">
                  {
                    profile?.metadata?.attributes?.find(
                      (attribute) => attribute.key === "location"
                    )?.value
                  }
                </div>
              </div>
            )}
            {profile?.metadata?.attributes?.find(
              (attribute) => attribute.key === "website"
            )?.value && (
              <div className="relative w-fit h-fit flex flex-row justify-center items-center gap-1">
                <div className="relative flex w-fit h-fit justify-center items-center">
                  <IoGlobeOutline color="white" size={10} />
                </div>
                <div
                  className="relative flex w-fit h-fit justify-center items-center cursor-pointer text-bird break-all"
                  onClick={() =>
                    window.open(
                      profile?.metadata?.attributes
                        ?.find((attribute) => attribute.key === "website")
                        ?.value?.includes("https://")
                        ? profile?.metadata?.attributes?.find(
                            (attribute) => attribute.key === "website"
                          )?.value
                        : `https://${
                            profile?.metadata?.attributes?.find(
                              (attribute) => attribute.key === "website"
                            )?.value
                          }`
                    )
                  }
                >
                  {
                    profile?.metadata?.attributes?.find(
                      (attribute) => attribute.key === "website"
                    )?.value
                  }
                </div>
              </div>
            )}
          </div>
          <div className="relative w-full h-fit flex flex-row gap-2 items-start justify-start sm:justify-end text-gray-400 flex-wrap">
            <div className="relative w-fit h-fit flex items-center justify-start sm:justify-end flex flex-col">
              <div className="relative w-full h-fit items-center justify-start sm:justify-end">
                {dict?.Common?.collects}
              </div>
              <div className="relative w-full h-fit items-center justify-start sm:justify-end">
                {profile?.stats?.feedStats?.collects}
              </div>
            </div>
            <div className="relative w-fit h-fit flex items-center justify-start sm:justify-end flex flex-col">
              <div className="relative w-full h-fit items-center justify-start sm:justify-end">
                {dict?.Common?.comments}
              </div>
              <div className="relative w-full h-fit items-center justify-start sm:justify-end">
                {profile?.stats?.feedStats?.comments}
              </div>
            </div>
            <div className="relative w-fit h-fit flex items-center justify-start sm:justify-end flex flex-col">
              <div className="relative w-full h-fit items-center justify-start sm:justify-end">
                {dict?.Common?.posts}
              </div>
              <div className="relative w-full h-fit items-center justify-start sm:justify-end">
                {profile?.stats?.feedStats?.posts}
              </div>
            </div>
            <div className="relative w-fit h-fit flex items-center justify-start sm:justify-end flex flex-col">
              <div className="relative w-full h-fit items-center justify-start sm:justify-end">
                {dict?.Common?.mirrors}
              </div>
              <div className="relative w-full h-fit items-center justify-start sm:justify-end">
                {profile?.stats?.feedStats?.reposts}
              </div>
            </div>
          </div>
        </div>
      </div>
      {profile?.collections?.length > 0 && (
        <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto overflow-x-scroll">
          <div className="relative w-fit h-full overflow-x-scroll grid grid-flow-col auto-cols-auto gap-2">
            {profile?.collections?.map((coll: Collection, index: number) => {
              return (
                <div
                  key={index}
                  className="relative rounded-md cursor-pointer active:scale-95 h-28 w-28 flex-shrink-0"
                  id="crt"
                  onClick={() =>
                    router.push(
                      `/autograph/${
                        profile?.username?.localName
                      }/collection/${coll?.metadata?.title
                        ?.replace(/\s/g, "_")
                        .toLowerCase()}`
                    )
                  }
                >
                  <Image
                    layout="fill"
                    className="rounded-md w-full h-full flex"
                    objectFit="cover"
                    objectPosition={"center"}
                    src={`${INFURA_GATEWAY}/ipfs/${
                      (coll?.metadata?.video
                        ? coll?.metadata?.mediaCover
                        : coll?.metadata?.images?.[0]
                      )?.split("ipfs://")[1]
                    }`}
                    draggable={false}
                  />
                  <div className="relative absolute top-0 left-0 bg-black opacity-60 w-full h-full rounded-md hover:opacity-0"></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
