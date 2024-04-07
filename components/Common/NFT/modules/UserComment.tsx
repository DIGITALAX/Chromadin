import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FormEvent, FunctionComponent, KeyboardEvent } from "react";
import { UserCommentProps } from "../types/nft.types";
import syncScroll from "@/lib/helpers/syncScroll";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import ImageUploads from "./ImageUploads";
import { AiOutlineLoading } from "react-icons/ai";
import { Profile } from "@/components/Home/types/generated";
import OptionsPost from "../../Wavs/modules/OptionsPost";
import handleImageError from "@/lib/helpers/handleImageError";

const UserComment: FunctionComponent<UserCommentProps> = ({
  lensProfile,
  handleLensSignIn,
  openConnectModal,
  commentDescription,
  commentLoading,
  handleCommentDescription,
  textElement,
  caretCoord,
  comment,
  t,
  mentionProfiles,
  profilesOpen,
  handleMentionClick,
  dispatch,
  handleKeyDownDelete,
  secondaryComment,
  preElement,
  connected,
  postCollectGif,
  id,
  setMediaLoading,
  mediaLoading,
  main,
}): JSX.Element => {
  return (
    <div className="relative w-full h-96 galaxy:h-80 sm:h-full border-y border-l border-white flex flex-col bg-pink">
      <div className="relative w-full h-full rounded-br-2xl rounded-tr-2xl bg-offBlack p-4 flex flex-col gap-3">
        <ImageUploads
          commentLoading={commentLoading}
          postCollectGif={postCollectGif}
          dispatch={dispatch}
          id={id}
        />
        <div className="relative w-full h-full border border-white p-px rounded-md">
          <div className="relative w-full h-full border border-white p-px rounded-md grid grid-flow-col auto-cols-auto">
            <textarea
              id="post"
              onScroll={() => syncScroll(textElement, preElement)}
              onInput={(e: FormEvent) => {
                handleCommentDescription(e);
                syncScroll(textElement, preElement);
              }}
              onKeyDown={(e: KeyboardEvent<Element>) => handleKeyDownDelete(e)}
              style={{ resize: "none" }}
              className="relative w-full h-full bg-offBlack font-arcade text-white p-2 z-1 rounded-lg overflow-y-auto"
              ref={textElement}
              value={commentDescription}
            ></textarea>
            <pre
              id="highlighting"
              className={`absolute w-full h-full bg-offBlack font-arcade text-white p-2 rounded-lg overflow-y-auto break-words whitespace-pre-wrap`}
              ref={preElement}
            >
              <code
                id="highlighted-content"
                className={`w-full h-full place-self-center text-left whitespace-pre-wrap overflow-y-auto z-0 break-words`}
              >
                {secondaryComment !== "" ? "Reply with a Comment?" : t("say")}
              </code>
            </pre>
            {mentionProfiles?.length > 0 && profilesOpen && (
              <div
                className={`absolute w-44 max-h-28 h-fit flex flex-col overflow-y-auto items-start justify-start z-2 rounded-sm border-x border-white`}
                style={{
                  top: caretCoord.y + 30,
                  left: caretCoord.x,
                }}
              >
                {mentionProfiles?.map((user: Profile, index: number) => {
                  const profileImage = createProfilePicture(
                    user?.metadata?.picture
                  );
                  return (
                    <div
                      key={index}
                      className={`relative w-full h-fit px-3 py-2 bg-black flex flex-row gap-3 cursor-pointer items-center justify-center border-b border-white hover:bg-ama/70 z-2`}
                      onClick={() => {
                        handleMentionClick(user);
                      }}
                    >
                      <div className="relative flex flex-row w-full h-full text-white font-mana lowercase place-self-center gap-2">
                        <div
                          className={`relative rounded-full flex bg-white w-3 h-3 items-center justify-center col-start-1`}
                          id="crt"
                        >
                          {profileImage && (
                            <Image
                              src={profileImage}
                              onError={(e) => handleImageError(e)}
                              objectFit="cover"
                              alt="pfp"
                              layout="fill"
                              className="relative w-fit h-fit rounded-full items-center justify-center flex"
                              draggable={false}
                            />
                          )}
                        </div>
                        <div className="relative col-start-2 items-center justify-center w-fit h-fit text-xs flex">
                          {user?.handle?.suggestedFormatted?.localName}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="relative w-full h-fit galaxy:h-12 flex flex-row items-center gap-3 flex-wrap galaxy:flex-nowrap">
          <div className="relative w-fit h-fit flex flex-row items-center gap-2 justify-start">
            <div className="relative w-3 h-3 rounded-full" id="chrome"></div>
            <div className="relative w-3 h-3 rounded-full" id="chrome"></div>
            <OptionsPost
              mediaLoading={mediaLoading}
              postLoading={commentLoading}
              postCollectGif={postCollectGif}
              setMediaLoading={setMediaLoading}
              dispatch={dispatch}
              index={0}
              id={id}
            />
          </div>
          <div className="relative w-full h-fit justify-end flex flex-row gap-2 items-center">
            <div
              className="relative w-24 min-w-fit h-10 border-white border rounded-tr-xl rounded-bl-xl py-2 px-4 flex items-center cursor-pointer active:scale-95 hover:bg-moda justify-center"
              onClick={
                !connected && !lensProfile?.id
                  ? openConnectModal
                  : connected && !lensProfile?.id
                  ? () => handleLensSignIn()
                  : !commentLoading
                  ? () => comment(id, 0, main)
                  : () => {}
              }
            >
              <div
                className={`relative w-full h-full flex text-white font-arcade items-center text-center justify-center ${
                  commentLoading && "animate-spin"
                }`}
              >
                {!connected && !lensProfile?.id ? (
                  t("con")
                ) : connected && !lensProfile?.id ? (
                  t("sig")
                ) : commentLoading ? (
                  <AiOutlineLoading size={10} color="white" />
                ) : (
                  t("send")
                )}
              </div>
            </div>
            <Image
              alt="gear"
              src={`${INFURA_GATEWAY}/ipfs/QmY72fgrYJvDrc8iDSYRiyTpdsxbPMbPk7hxT2jrH9jrXJ`}
              width={15}
              height={15}
              className="relative w-7 h-7 flex justify-end"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserComment;
