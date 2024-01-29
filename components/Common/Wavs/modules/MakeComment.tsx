import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FormEvent, FunctionComponent, KeyboardEvent } from "react";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import { AiOutlineLoading } from "react-icons/ai";
import syncScroll from "@/lib/helpers/syncScroll";
import { MakeCommentProps } from "../types/wavs.types";
import OptionsPost from "./OptionsPost";
import { Profile } from "@/components/Home/types/generated";
import ImageUploads from "../../NFT/modules/ImageUploads";
import handleImageError from "@/lib/helpers/handleImageError";

const MakeComment: FunctionComponent<MakeCommentProps> = ({
  comment,
  handleLensSignIn,
  openConnectModal,
  commentDescription,
  commentLoading,
  handleCommentDescription,
  textElement,
  caretCoord,
  mentionProfiles,
  profilesOpen,
  handleMentionClick,
  mediaLoading,
  dispatch,
  handleKeyDownDelete,
  address,
  preElement,
  lensProfile,
  postCollectGif,
  id,
  setMediaLoading,
  index,
  main
}): JSX.Element => {
  return (
    <div className="relative w-full h-60 flex flex-col">
      <div className="relative w-full h-full rounded-br-2xl rounded-tr-2xl border-2 border-black bg-gradient-to-r from-offBlack via-gray-600 to-black p-4 flex flex-col gap-3">
        {postCollectGif?.media?.[id]?.length !== 0 && (
          <ImageUploads
            commentLoading={commentLoading}
            postCollectGif={postCollectGif}
            id={id}
            dispatch={dispatch}
          />
        )}
        <div className="relative w-full h-full rounded-md" id="boxBg1">
          <div className="relative w-full h-full rounded-md grid grid-flow-col auto-cols-auto">
            <textarea
              id="post2"
              onScroll={(e: any) => syncScroll(textElement, preElement)}
              onInput={(e: FormEvent) => {
                handleCommentDescription(e);
                syncScroll(textElement, preElement);
              }}
              onKeyDown={(e: KeyboardEvent<Element>) => handleKeyDownDelete(e)}
              style={{ resize: "none" }}
              className="relative w-full h-full bg-black font-economicaB text-white p-2 z-1 rounded-lg overflow-y-auto"
              ref={textElement}
              value={commentDescription}
              disabled={commentLoading ? true : false}
            ></textarea>
            <pre
              id="highlighting2"
              className={`absolute w-full h-full bg-black font-economicaB text-white p-2 rounded-lg overflow-y-auto`}
              ref={preElement}
            >
              <code
                id="highlighted-content2"
                className={`w-full h-full place-self-center text-left whitespace-pre-wrap overflow-y-auto z-0`}
              >
                {"Have Something to Say?"}
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
        <div className="relative w-full h-fit preG:h-12 flex flex-row items-center gap-3 flex-wrap preG:flex-nowrap">
          <div className="relative w-fit h-fit flex flex-row items-center gap-2 justify-start">
            <div className="relative w-3 h-3 rounded-full" id="chrome"></div>
            <div className="relative w-3 h-3 rounded-full" id="chrome"></div>
            <OptionsPost
              id={id}
              mediaLoading={mediaLoading}
              postLoading={commentLoading}
              dispatch={dispatch}
              setMediaLoading={setMediaLoading}
              index={index}
              postCollectGif={postCollectGif}
            />
          </div>
          <div className="relative w-full h-fit justify-end flex flex-row gap-2 items-center">
            <div
              className="relative w-24 min-w-fit h-10 border-white border rounded-tr-xl rounded-bl-xl py-2 px-4 flex items-center cursor-pointer active:scale-95 hover:bg-moda justify-center"
              onClick={
                !lensProfile?.id && !address
                  ? openConnectModal
                  : address && !lensProfile?.id
                  ? () => handleLensSignIn()
                  : !commentLoading
                  ? () => comment(id, index, main)
                  : () => {}
              }
            >
              <div
                className={`relative w-full h-full flex text-white font-economicaB items-center text-center justify-center ${
                  commentLoading && "animate-spin"
                }`}
              >
                {!address && !lensProfile?.id ? (
                  "CONNECT"
                ) : address && !lensProfile?.id ? (
                  "SIGN IN"
                ) : commentLoading ? (
                  <AiOutlineLoading size={10} color="white" />
                ) : (
                  "SEND IT"
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

export default MakeComment;
