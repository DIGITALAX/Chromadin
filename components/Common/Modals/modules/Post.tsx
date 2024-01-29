import { FormEvent, FunctionComponent, KeyboardEvent } from "react";
import { PostProps } from "../types/modals.types";
import { ImCross } from "react-icons/im";
import { setMakePost } from "@/redux/reducers/makePostSlice";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import { INFURA_GATEWAY } from "@/lib/constants";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import ImageUploads from "../../NFT/modules/ImageUploads";
import OptionsPost from "../../Wavs/modules/OptionsPost";
import syncScroll from "@/lib/helpers/syncScroll";
import Quote from "../../Wavs/modules/Quote";
import { Profile } from "@/components/Home/types/generated";
import handleImageError from "@/lib/helpers/handleImageError";

const Post: FunctionComponent<PostProps> = ({
  dispatch,
  postLoading,
  handlePostDescription,
  handleKeyDownDelete,
  postDescription,
  textElement,
  mentionProfiles,
  caretCoord,
  profilesOpen,
  handleMentionClick,
  mediaLoading,
  postCollectGif,
  handleLensSignIn,
  openConnectModal,
  address,
  lensProfile,
  handlePost,
  preElement,
  quote,
  setMediaLoading,
}): JSX.Element => {
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
                    dispatch(
                      setMakePost({
                        actionValue: false,
                        actionQuote: undefined,
                      })
                    )
                  }
                />
              </div>
              <div className="relative w-full min-h-60 h-fit flex flex-col">
                <div className="relative w-full h-full px-4 pb-4 flex flex-col gap-3">
                  {typeof window !== "undefined" &&
                    postCollectGif?.media?.["post"]?.length !== 0 && (
                      <ImageUploads
                        id={"post"}
                        dispatch={dispatch}
                        commentLoading={postLoading}
                        postCollectGif={postCollectGif}
                      />
                    )}

                  <div className="relative w-full h-full p-px rounded-md">
                    <div className="relative w-full h-40 border border-white p-px rounded-md grid grid-flow-col auto-cols-auto">
                      <textarea
                        id="post3"
                        onScroll={(e: any) =>
                          syncScroll(textElement, preElement)
                        }
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
                          Have Something to Say?
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
                            (user: Profile, index: number) => {
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
                                          objectFit="cover"
                                          alt="pfp"
                                          layout="fill"
                                          className="relative w-fit h-fit rounded-full items-center justify-center flex"
                                          draggable={false}
                                          onError={(e) => handleImageError(e)}
                                        />
                                      )}
                                    </div>
                                    <div className="relative col-start-2 items-center justify-center w-fit h-fit text-xs flex">
                                      {
                                        user?.handle?.suggestedFormatted
                                          ?.localName
                                      }
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
                      <OptionsPost
                        index={0}
                        mediaLoading={mediaLoading}
                        postLoading={postLoading}
                        setMediaLoading={setMediaLoading}
                        postCollectGif={postCollectGif}
                        id={"post"}
                        dispatch={dispatch}
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
                            : postLoading
                            ? () => {}
                            : () => handlePost(quote?.id)
                        }
                      >
                        <div
                          className={`relative w-full h-full flex text-white font-economicaB items-center text-center justify-center ${
                            postLoading && "animate-spin"
                          }`}
                        >
                          {!address && !lensProfile?.id ? (
                            "CONNECT"
                          ) : address && !lensProfile?.id ? (
                            "SIGN IN"
                          ) : postLoading ? (
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
              {quote && (
                <div
                  className="relative w-full h-72 overflow-y-hidden px-5 py-1 flex items-start justify-center"
                  id="fadedQuote"
                >
                  <div className="relative w-full h-fit p-2 flex items-center justify-start flex-col from-gray-400 via-gray-600 to-gray-800 bg-gradient-to-r rounded-md gap-5">
                    <div className="relative w-full h-fit flex cursor-pointer">
                      <Quote publication={quote} />
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

export default Post;
