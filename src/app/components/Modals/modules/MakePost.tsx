import {
  FormEvent,
  FunctionComponent,
  JSX,
  KeyboardEvent,
  useContext,
} from "react";
import { ImCross } from "react-icons/im";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import { ModalContext } from "@/app/providers";
import ImageUploads from "../../Main/modules/ImageUploads";
import handleImageError from "@/app/lib/helpers/handleImageError";
import OptionsPost from "../../Main/modules/OptionsPost";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import Quote from "../../Chat/modules/Quote";
import { useAccount } from "wagmi";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { Account } from "@lens-protocol/client";
import useLens from "../../Common/hooks/useLens";
import { useModal } from "connectkit";
import syncScroll from "@/app/lib/helpers/syncScroll";
import useMakePost from "../hooks/useMakePost";

const MakePost: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  const { address, chainId, isConnected } = useAccount();
  const { lensCargando, handleConectarse } = useLens(
    isConnected,
    address,
    dict
  );
  const { openOnboarding, openSwitchNetworks } = useModal();
  const {
    postDescription,
    textElement,
    handlePostDescription,
    postLoading,
    caretCoord,
    mentionProfiles,
    profilesOpen,
    handleMentionClick,
    handleKeyDownDelete,
    handlePost,
    preElement,
  } = useMakePost(dict);

  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div
        className="relative w-[80vw] preG:w-[70vw] sm:w-[50vw] h-fit col-start-1 place-self-center rounded-lg"
        id="boxBg"
      >
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-4 pb-2">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-5 pt-5 cursor-pointer">
                <ImCross
                  color="white"
                  size={10}
                  onClick={() =>
                    context?.setMakePost({
                      open: false,
                    })
                  }
                />
              </div>
              <div className="relative w-full min-h-60 h-fit flex flex-col">
                <div className="relative w-full h-full px-4 pb-4 flex flex-col gap-3">
                  {typeof window !== "undefined" &&
                    context?.postInfo?.media?.["post"]?.length !== 0 && (
                      <ImageUploads id={"post"} commentLoading={postLoading} />
                    )}

                  <div className="relative w-full h-full p-px rounded-md">
                    <div className="relative w-full h-40 border border-white p-px rounded-md grid grid-flow-col auto-cols-auto">
                      <textarea
                        id="post3"
                        onScroll={() => syncScroll(textElement, preElement)}
                        onInput={(e: FormEvent) => {
                          handlePostDescription(e);
                          syncScroll(textElement, preElement);
                        }}
                        onKeyDown={(e: KeyboardEvent<Element>) =>
                          handleKeyDownDelete(e)
                        }
                        style={{ resize: "none" }}
                        className="relative w-full h-full bg-black font-economicaB text-white p-2 z-1 rounded-lg overflow-y-scroll"
                        ref={textElement}
                        value={postDescription}
                        disabled={postLoading ? true : false}
                      ></textarea>
                      <pre
                        id="highlighting3"
                        className={`absolute w-full h-full bg-black font-economicaB text-white p-2 rounded-lg overflow-y-auto whitespace-pre-wrap break-words`}
                        ref={preElement}
                      >
                        <code
                          id="highlighted-content3"
                          className={`w-full h-full place-self-center text-left whitespace-pre-wrap break-words overflow-y-auto z-0`}
                        >
                          {dict?.Common?.say}
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
                          {mentionProfiles?.map(
                            (user: Account, index: number) => {
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
                                        src={handleProfilePicture(
                                          user?.metadata?.picture
                                        )}
                                        objectFit="cover"
                                        alt="pfp"
                                        layout="fill"
                                        className="relative w-fit h-fit rounded-full items-center justify-center flex"
                                        draggable={false}
                                        onError={(e) => handleImageError(e)}
                                      />
                                    </div>
                                    <div className="relative col-start-2 items-center justify-center w-fit h-fit text-xs flex">
                                      {user?.username?.localName}
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative w-full h-fit preG:h-12 flex flex-row items-center gap-3 flex-wrap preG:flex-nowrap">
                    <div className="relative w-fit h-fit flex flex-row items-center gap-2 justify-start">
                      <div
                        className="relative w-3 h-3 rounded-full"
                        id="chrome"
                      ></div>
                      <div
                        className="relative w-3 h-3 rounded-full"
                        id="chrome"
                      ></div>
                      <OptionsPost commentLoading={postLoading} id={"post"} />
                    </div>
                    <div className="relative w-full h-fit justify-end flex flex-row gap-2 items-center">
                      <div
                        className="relative w-24 min-w-fit h-10 border-white border rounded-tr-xl rounded-bl-xl py-2 px-4 flex items-center cursor-pointer active:scale-95 hover:bg-moda justify-center"
                        onClick={() =>
                          !isConnected
                            ? chainId !== 232
                              ? openSwitchNetworks?.()
                              : openOnboarding?.()
                            : !context?.lensConectado?.profile && !lensCargando
                            ? handleConectarse()
                            : !postLoading &&
                              context?.lensConectado?.profile &&
                              handlePost()
                        }
                      >
                        <div
                          className={`relative w-full h-full flex text-white font-economicaB items-center text-center justify-center ${
                            postLoading && "animate-spin"
                          }`}
                        >
                          {!address && !context?.lensConectado?.profile ? (
                            dict?.Common?.con
                          ) : address && !context?.lensConectado?.profile ? (
                            dict?.Common?.sig
                          ) : postLoading ? (
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
              {context?.makePost?.quote && (
                <div
                  className="relative w-full h-72 overflow-y-hidden px-5 py-1 flex items-start justify-center"
                  id="fadedQuote"
                >
                  <div className="relative w-full h-fit p-2 flex items-center justify-start flex-col from-gray-400 via-gray-600 to-gray-800 bg-gradient-to-r rounded-md gap-5">
                    <div className="relative w-full h-fit flex cursor-pointer">
                      <Quote publication={context?.makePost?.quote} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakePost;
