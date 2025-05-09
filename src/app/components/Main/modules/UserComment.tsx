import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { ModalContext } from "@/app/providers";
import { Account } from "@lens-protocol/client";
import Image from "next/legacy/image";
import {
  FormEvent,
  FunctionComponent,
  JSX,
  KeyboardEvent,
  useContext,
} from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useAccount } from "wagmi";
import useLens from "../../Common/hooks/useLens";
import { useModal } from "connectkit";
import syncScroll from "@/app/lib/helpers/syncScroll";
import { UserCommentProps } from "../types/main.types";
import ImageUploads from "./ImageUploads";
import OptionsPost from "./OptionsPost";

const UserComment: FunctionComponent<UserCommentProps> = ({
  dict,
  commentLoading,
  mentionProfiles,
  handleCommentDescription,
  handleKeyDownDelete,
  textElement,
  commentDetails,
  preElement,
  handleMentionClick,
  secondaryComment,
  profilesOpen,
  caretCoord,
  comment,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const { isConnected, address } = useAccount();
  const { handleConectarse, lensCargando } = useLens(
    isConnected,
    address,
    dict
  );

  const { openOnboarding } = useModal();
  return (
    <div className="relative w-full h-96 galaxy:h-80 sm:h-full border-y border-l border-white flex flex-col bg-pink">
      <div className="relative w-full h-full rounded-br-2xl rounded-tr-2xl bg-offBlack p-4 flex flex-col gap-3">
        <ImageUploads
          commentLoading={commentLoading}
          id={
            secondaryComment?.trim() == ""
              ? context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id!
              : secondaryComment
          }
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
              value={commentDetails?.description}
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
                {secondaryComment !== ""
                  ? "Reply with a Comment?"
                  : dict?.Common?.say}
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
                {mentionProfiles?.map((user: Account, index: number) => {
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
                          {user?.metadata?.picture?.split("ipfs://")?.[1] && (
                            <Image
                              src={`${INFURA_GATEWAY_INTERNAL}${
                                user?.metadata?.picture?.split("ipfs://")?.[1]
                              }`}
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
                          {user?.username?.localName}
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
              id={
                secondaryComment?.trim() == ""
                  ? context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id!
                  : secondaryComment
              }
              commentLoading={commentLoading}
            />
          </div>
          <div className="relative w-full h-fit justify-end flex flex-row gap-2 items-center">
            <div
              className="relative w-24 min-w-fit h-10 border-white border rounded-tr-xl rounded-bl-xl py-2 px-4 flex items-center cursor-pointer active:scale-95 hover:bg-moda justify-center"
              onClick={() =>
                !isConnected && !context?.lensConectado?.profile
                  ? openOnboarding()
                  : isConnected && !context?.lensConectado?.profile
                  ? !lensCargando && handleConectarse()
                  : !commentLoading &&
                    comment(
                      secondaryComment?.trim() == ""
                        ? context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id!
                        : secondaryComment
                    )
              }
            >
              <div
                className={`relative w-full h-full flex text-white font-arcade items-center text-center justify-center ${
                  commentLoading && "animate-spin"
                }`}
              >
                {!isConnected && !context?.lensConectado?.profile ? (
                  dict?.Common?.con
                ) : isConnected && !context?.lensConectado?.profile ? (
                  dict?.Common?.sig
                ) : commentLoading ? (
                  <AiOutlineLoading size={10} color="white" />
                ) : (
                  dict?.Common?.send
                )}
              </div>
            </div>
            <Image
              alt="gear"
              src={`${INFURA_GATEWAY_INTERNAL}QmY72fgrYJvDrc8iDSYRiyTpdsxbPMbPk7hxT2jrH9jrXJ`}
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
