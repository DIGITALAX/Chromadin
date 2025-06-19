import Image from "next/legacy/image";
import {
  FormEvent,
  FunctionComponent,
  JSX,
  KeyboardEvent,
  useContext,
} from "react";
import { AiOutlineLoading } from "react-icons/ai";
import ImageUploads from "../../Main/modules/ImageUploads";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import { MakeCommentProps } from "../types/chat.types";
import syncScroll from "@/app/lib/helpers/syncScroll";
import useComment from "../hooks/useComment";
import { Account } from "@lens-protocol/client";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { useModal } from "connectkit";
import { useAccount } from "wagmi";
import useLens from "../../Common/hooks/useLens";
import OptionsPost from "../../Main/modules/OptionsPost";

const MakeComment: FunctionComponent<MakeCommentProps> = ({
  dict,
  post,
  setOpenComment,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const { isConnected, chainId, address } = useAccount();
  const { openOnboarding, openSwitchNetworks } = useModal();
  const { lensCargando, handleConectarse } = useLens(
    isConnected,
    address,
    dict
  );
  const {
    mentionProfiles,
    handleCommentDescription,
    handleKeyDownDelete,
    textElement,
    commentDetails,
    preElement,
    handleMentionClick,
    profilesOpen,
    caretCoord,
    comment,
    commentLoading,
  } = useComment(dict, post, setOpenComment);

  return (
    <div className="relative w-full h-60 flex flex-col">
      <div className="relative w-full h-full rounded-br-2xl rounded-tr-2xl border-2 border-black bg-gradient-to-r from-offBlack via-gray-600 to-black p-4 flex flex-col gap-3">
        <ImageUploads commentLoading={commentLoading} id={post?.id} />
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
              value={commentDetails?.description}
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
                {dict?.say}
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
                          <Image
                            src={handleProfilePicture(user?.metadata?.picture)}
                            onError={(e) => handleImageError(e)}
                            objectFit="cover"
                            alt="pfp"
                            layout="fill"
                            className="relative w-fit h-fit rounded-full items-center justify-center flex"
                            draggable={false}
                          />
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
        <div className="relative w-full h-fit preG:h-12 flex flex-row items-center gap-3 flex-wrap preG:flex-nowrap">
          <div className="relative w-fit h-fit flex flex-row items-center gap-2 justify-start">
            <div className="relative w-3 h-3 rounded-full" id="chrome"></div>
            <div className="relative w-3 h-3 rounded-full" id="chrome"></div>
            <OptionsPost id={post?.id} commentLoading={commentLoading} />
          </div>
          <div className="relative w-full h-fit justify-end flex flex-row gap-2 items-center">
            <div
              className="relative w-24 min-w-fit h-10 border-white border rounded-tr-xl rounded-bl-xl py-2 px-4 flex items-center cursor-pointer active:scale-95 hover:bg-moda justify-center"
              onClick={() =>
                !isConnected
                  ? chainId !== 232
                    ? openSwitchNetworks?.()
                    : openOnboarding?.()
                  : context?.lensConectado?.profile
                  ? comment()
                  : !lensCargando && handleConectarse()
              }
            >
              <div
                className={`relative w-full h-full flex text-white font-economicaB items-center text-center justify-center ${
                  commentLoading && "animate-spin"
                }`}
              >
                {!address && !context?.lensConectado?.profile ? (
                  dict?.con
                ) : address && !context?.lensConectado?.profile ? (
                  dict?.sig
                ) : commentLoading ? (
                  <AiOutlineLoading size={10} color="white" />
                ) : (
                  dict?.send
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

export default MakeComment;
