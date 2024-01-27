import moment from "moment";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { ProfileSideBarProps } from "../types/wavs.types";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import { INFURA_GATEWAY } from "@/lib/constants";
import Reactions from "./Reactions";

const Profile: FunctionComponent<ProfileSideBarProps> = ({
  publication,
  followerOnly,
  dispatch,
  index,
  collectPost,
  reactPost,
  mirrorPost,
  address,
  reactLoading,
  mirrorLoading,
  collectLoading,
  reactAmount,
  collectAmount,
  mirrorAmount,
  commentAmount,
  openComment,
  setMirrorLoader,
  setCollectLoader,
  setReactLoader,
  
  router,
  
  hasMirrored,
  hasReacted,
  hasCollected,
  openMirrorChoice,
  setOpenMirrorChoice,
}): JSX.Element => {
  const profileImage = createProfilePicture(
    publication?.__typename === "Mirror"
      ? publication?.mirrorOn?.by?.metadata?.picture
      : publication?.by?.metadata?.picture
  );
  return (
    <div
      className={`relative h-auto rounded-md pr-px py-px w-full sm:w-40 preG:min-w-[7.5rem]`}
      id="sideProfile"
    >
      <div
        className={`relative w-full h-full bg-shame rounded-md flex flex-col items-start sm:items-center py-1.5 px-1 gap-3`}
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmSjh6dsibg9yDfBwRfC5YSWFTmwpwPxRDTFG8DzLHzFyB`}
          layout="fill"
          objectFit="cover"
          className="absolute w-full h-full rounded-lg"
          draggable={false}
        />
        <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
          <div
            className={`w-20 relative h-8 rounded-full flex justify-self-center`}
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmfDmMCcgcseCFzGam9DbmDk5sQRbt6zrQVhvj4nTeuLGq`}
              layout="fill"
              alt="backdrop"
              priority
              draggable={false}
              className="rounded-full w-full h-full"
            />
          </div>
          <div
            className={`absolute rounded-full flex bg-white w-8 h-full justify-self-center sm:right-6 col-start-1 cursor-pointer active:scale-95 hover:opacity-80`}
            id="crt"
            onClick={() =>
              !router.asPath?.includes("/autograph/")
                ? router.push(
                    router.asPath.includes("&post=")
                      ? router.asPath.split("&post=")[0] +
                          `&profile=${
                            publication?.__typename !== "Mirror"
                              ? publication?.by?.handle?.suggestedFormatted?.localName?.split(
                                  "@"
                                )[1]
                              : publication?.mirrorOn?.by?.handle?.suggestedFormatted?.localName?.split(
                                  "@"
                                )[1]
                          }`
                      : router.asPath.includes("&profile=")
                      ? router.asPath.split("&profile=")[0] +
                        `&profile=${
                          publication?.__typename !== "Mirror"
                            ? publication?.by?.handle?.suggestedFormatted?.localName?.split(
                                "@"
                              )[1]
                            : publication?.mirrorOn?.by?.handle?.suggestedFormatted?.localName?.split(
                                "@"
                              )[1]
                        }`
                      : router.asPath.includes("?option=")
                      ? router.asPath +
                        `&profile=${
                          publication?.__typename !== "Mirror"
                            ? publication?.by?.handle?.suggestedFormatted?.localName?.split(
                                "@"
                              )[1]
                            : publication?.mirrorOn?.by?.handle?.suggestedFormatted?.localName?.split(
                                "@"
                              )[1]
                        }`
                      : router.asPath +
                        `?option=history&profile=${
                          publication?.__typename !== "Mirror"
                            ? publication?.by?.handle?.suggestedFormatted?.localName?.split(
                                "@"
                              )[1]
                            : publication?.mirrorOn?.by?.handle?.suggestedFormatted?.localName?.split(
                                "@"
                              )[1]
                        }`
                  )
                : router.replace(
                    `/#chat?option=history&profile=${
                      publication?.__typename !== "Mirror"
                        ? publication?.by?.handle?.suggestedFormatted?.localName?.split(
                            "@"
                          )[1]
                        : publication?.mirrorOn?.by?.handle?.suggestedFormatted?.localName?.split(
                            "@"
                          )[1]
                    }`
                  )
            }
          >
            {profileImage && (
              <Image
                src={profileImage}
                objectFit="cover"
                alt="pfp"
                layout="fill"
                className="relative w-full h-full rounded-full"
                draggable={false}
              />
            )}
          </div>
        </div>
        <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
          <div
            className={`relative w-fit h-fit font-dosis text-xs justify-self-center`}
            id={"username"}
          >
            {publication?.__typename !== "Mirror"
              ? publication?.by?.handle?.suggestedFormatted?.localName
                ? publication?.by?.handle?.suggestedFormatted?.localName
                    .length > 25
                  ? publication?.by?.handle?.suggestedFormatted?.localName.substring(
                      0,
                      20
                    ) + "..."
                  : publication?.by?.handle?.suggestedFormatted?.localName
                : ""
              : publication?.mirrorOn?.by?.handle?.suggestedFormatted?.localName
              ? publication?.mirrorOn?.by?.handle?.suggestedFormatted?.localName
                  ?.length > 20
                ? publication?.mirrorOn?.by?.handle?.suggestedFormatted?.localName?.substring(
                    0,
                    25
                  ) + "..."
                : publication?.mirrorOn?.by?.handle?.suggestedFormatted
                    ?.localName
              : ""}
          </div>
        </div>
        <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
          <div
            className={`relative w-fit h-fit ${
              publication?.by?.handle?.localName ? "row-start-2" : "row-start-1"
            } font-clash text-xs justify-self-center text-black`}
          >
            {publication?.__typename !== "Mirror"
              ? publication?.by?.handle?.localName?.length! > 15
                ? publication?.by?.handle?.localName?.substring(0, 10) + "..."
                : publication?.by?.handle?.suggestedFormatted?.localName
              : publication?.mirrorOn?.by?.handle?.suggestedFormatted?.localName
                  .length! > 15
              ? publication?.mirrorOn?.by?.handle?.suggestedFormatted?.localName?.substring(
                  0,
                  10
                ) + "..."
              : publication?.mirrorOn?.by?.handle?.suggestedFormatted
                  ?.localName}
          </div>
        </div>
        <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
          <div
            className={`relative w-fit h-fit text-offBlack font-dosis justify-self-center fo:pb-0 pb-2 text-xs `}
          >
            {moment(`${publication?.createdAt}`).fromNow()}
          </div>
        </div>
        <div className="relative w-full h-full grid grid-flow-col auto-cols-auto items-end pt-3">
          <Reactions
            id={publication?.id}
            textColor={"black"}
            commentColor={"#0AC7AB"}
            mirrorColor={"#712AF6"}
            collectColor={"#81A8F8"}
            heartColor={"red"}
            dispatch={dispatch}
            followerOnly={followerOnly as boolean}
            collectPost={collectPost}
            mirrorPost={mirrorPost}
            reactPost={reactPost}
            address={address!}
            publication={publication}
            index={index}
            reactLoading={reactLoading}
            mirrorLoading={mirrorLoading}
            collectLoading={collectLoading}
            reactAmount={reactAmount}
            collectAmount={collectAmount}
            mirrorAmount={mirrorAmount}
            commentAmount={commentAmount}
            openComment={openComment}
            hasCollected={hasCollected}
            hasMirrored={hasMirrored}
            hasReacted={hasReacted}
            setReactLoader={setReactLoader}
            setMirrorLoader={setMirrorLoader}
            setCollectLoader={setCollectLoader}
            
            
            router={router}
            openMirrorChoice={openMirrorChoice}
            setOpenMirrorChoice={setOpenMirrorChoice}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
