import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import {
  ClipboardEvent,
  FormEvent,
  FunctionComponent,
  KeyboardEvent,
} from "react";
import { UserCommentProps } from "../types/nft.types";
import syncScroll from "@/lib/helpers/syncScroll";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import Options from "./Options";
import ImageUploads from "./ImageUploads";
import { AiOutlineLoading } from "react-icons/ai";
import CollectInput from "../../Buttons/CollectInput";
import CollectButton from "../../Buttons/CollectButton";
import { setModal } from "@/redux/reducers/modalSlice";
import { Profile } from "@/components/Home/types/generated";

const UserComment: FunctionComponent<UserCommentProps> = ({
  lensProfile,
  commentVideo,
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
  videoLoading,
  imageLoading,
  uploadImage,
  uploadVideo,
  mappedFeaturedFiles,
  postImagesDispatched,
  handleRemoveImage,
  handleGifSubmit,
  handleGif,
  results,
  handleSetGif,
  setGifOpen,
  gifOpen,
  collectOpen,
  collectNotif,
  referral,
  setCollectible,
  collectibleDropDown,
  setCollectibleDropDown,
  collectible,
  setAudienceDropDown,
  audienceType,
  audienceTypes,
  chargeCollect,
  limit,
  limitedEdition,
  audienceDropDown,
  setAudienceType,
  setTimeLimit,
  timeLimit,
  timeLimitDropDown,
  setTimeLimitDropDown,
  setLimitedEdition,
  limitedDropDown,
  setLimitedDropDown,
  setReferral,
  setLimit,
  setChargeCollect,
  setCurrencyDropDown,
  chargeCollectDropDown,
  setChargeCollectDropDown,
  enabledCurrencies,
  enabledCurrency,
  currencyDropDown,
  setEnabledCurrency,
  value,
  setValue,
  dispatch,
  handleKeyDownDelete,
  commentId,
  canComment,
  preElement,
  handleImagePaste,
  clientRendered,
  connected,
}): JSX.Element => {
  return (
    <div className="relative w-full h-96 galaxy:h-80 sm:h-full border-y border-l border-white flex flex-col bg-pink">
      <div className="relative w-full h-full rounded-br-2xl rounded-tr-2xl bg-offBlack p-4 flex flex-col gap-3">
        {clientRendered &&
          (mappedFeaturedFiles?.length !== 0 ||
            postImagesDispatched?.length !== 0) && (
            <ImageUploads
              handleRemoveImage={handleRemoveImage}
              commentLoading={commentLoading}
              postImagesDispatched={postImagesDispatched}
            />
          )}
        {gifOpen ? (
          <div className="relative w-full h-full grid grid-flow-row auto-rows-auto overflow-y-scroll">
            <div className="relative w-full h-fit flex flex-row gap-2">
              <input
                className={`relative row-start-1 col-start-1 h-10 bg-offBlack border border-white font-geom text-white p-2 rounded-md caret-transparent w-full text-sm`}
                name="gif"
                onChange={(e: FormEvent) => handleGif(e)}
              />
              <div
                className="relative w-20 border border-white flex items-center text-center justify-center text-white font-arcade rounded-md cursor-pointer active:scale-95"
                onClick={() => handleGifSubmit()}
              >
                Search
              </div>
            </div>
            {results?.length !== 0 && (
              <div className="relative w-full h-full grid grid-cols-3 overflow-y-scroll gap-2 pt-3">
                {results?.map((result: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-16 h-12 bg-white cursor-pointer active:scale-95 place-self-center"
                      onClick={() =>
                        handleSetGif(result?.media_formats?.gif?.url)
                      }
                    >
                      <Image
                        layout="fill"
                        objectFit="cover"
                        src={result?.media_formats?.gif?.url}
                        draggable={false}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : collectOpen ? (
          <div className="relative w-full h-full flex overflow-y-scroll">
            <div className="relative w-fit h-full flex auto-rows-auto gap-10">
              <div className="relative w-fit h-fit row-start-1 flex flex-col flex-wrap place-self-start gap-3">
                <div className="relative flex flex-col galaxy:flex-row">
                  <CollectButton
                    col={"1"}
                    row={"1"}
                    selectFunction={setCollectible}
                    openDropdown={collectibleDropDown}
                    handleOpenDropdown={setCollectibleDropDown}
                    selectValue={collectible}
                    label={"Collectible?"}
                  />
                  {collectible === "yes" && (
                    <CollectButton
                      col={"1"}
                      row={"1"}
                      values={audienceTypes}
                      selectFunction={setAudienceType}
                      openDropdown={audienceDropDown}
                      handleOpenDropdown={setAudienceDropDown}
                      selectValue={audienceType}
                      label={"Who can collect?"}
                    />
                  )}
                  {collectible === "yes" && (
                    <CollectButton
                      col={"1"}
                      row={"1"}
                      selectFunction={setChargeCollect}
                      openDropdown={chargeCollectDropDown}
                      handleOpenDropdown={setChargeCollectDropDown}
                      selectValue={chargeCollect}
                      label={"Creator award?"}
                    />
                  )}
                </div>
                <div className="relative flex flex-col galaxy:flex-row">
                  {collectible === "yes" && chargeCollect === "yes" && (
                    <CollectButton
                      col={"1"}
                      row={"1"}
                      selectFunction={setTimeLimit}
                      openDropdown={timeLimitDropDown}
                      handleOpenDropdown={setTimeLimitDropDown}
                      selectValue={timeLimit}
                      label={"24 Hour Collect"}
                    />
                  )}
                  {collectible === "yes" && (
                    <CollectButton
                      col={"1"}
                      row={"1"}
                      selectFunction={setLimitedEdition}
                      openDropdown={limitedDropDown}
                      handleOpenDropdown={setLimitedDropDown}
                      selectValue={limitedEdition}
                      label={"Limited edition?"}
                    />
                  )}
                  {collectible === "yes" && limitedEdition === "yes" && (
                    <CollectInput
                      min="1"
                      step="1"
                      defaultValue={limit.toString()}
                      placeholder={limit.toString()}
                      id="collectLimit"
                      label="Edition Amount"
                      name="collectLimit"
                      col={"1"}
                      row={"1"}
                      handleValueChange={setLimit}
                    />
                  )}
                </div>
                <div className="relative flex flex-col galaxy:flex-row w-full">
                  {collectible === "yes" && chargeCollect === "yes" && (
                    <CollectButton
                      col={"1"}
                      row={"1"}
                      values={enabledCurrencies}
                      selectFunction={setEnabledCurrency}
                      openDropdown={currencyDropDown}
                      handleOpenDropdown={setCurrencyDropDown}
                      selectValue={enabledCurrency}
                      label={"Award currency"}
                    />
                  )}
                  {collectible === "yes" && chargeCollect === "yes" && (
                    <CollectInput
                      min="0"
                      defaultValue={value.toString()}
                      placeholder={value.toString()}
                      id="valueAmount"
                      label="Award amount"
                      name="valueAmount"
                      col={"1"}
                      row={"1"}
                      step="0.00001"
                      handleValueChange={setValue}
                    />
                  )}
                  {collectible === "yes" && chargeCollect === "yes" && (
                    <CollectInput
                      min="0"
                      defaultValue={referral.toString()}
                      placeholder={referral.toString()}
                      id="referral"
                      label="Mirrored posts (%)"
                      name="referral"
                      col={"1"}
                      row={"1"}
                      step="0.1"
                      handleValueChange={setReferral}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full border border-white p-px rounded-md">
            <div className="relative w-full h-full border border-white p-px rounded-md grid grid-flow-col auto-cols-auto">
              <textarea
                id="post"
                onScroll={() => syncScroll(textElement, preElement)}
                onInput={(e: FormEvent) => {
                  handleCommentDescription(e);
                  syncScroll(textElement, preElement);
                }}
                onKeyDown={(e: KeyboardEvent<Element>) =>
                  handleKeyDownDelete(e)
                }
                onPaste={(e: ClipboardEvent<HTMLTextAreaElement>) =>
                  handleImagePaste(e)
                }
                style={{ resize: "none" }}
                className="relative w-full h-full bg-offBlack font-arcade text-white p-2 z-1 rounded-lg overflow-y-auto"
                ref={textElement}
                value={commentDescription}
                disabled={commentLoading || !canComment ? true : false}
              ></textarea>
              <pre
                id="highlighting"
                className={`absolute w-full h-full bg-offBlack font-arcade text-white p-2 rounded-lg overflow-y-auto break-words whitespace-pre-wrap ${
                  !canComment && "opacity-70"
                }`}
                ref={preElement}
              >
                <code
                  id="highlighted-content"
                  className={`w-full h-full place-self-center text-left whitespace-pre-wrap overflow-y-auto z-0 break-words`}
                >
                  {!canComment
                    ? "Looks Like Only Select Profiles Can Comment on this Post ATM"
                    : commentId !== ""
                    ? "Reply with a Comment?"
                    : "Have Something to Say?"}
                </code>
              </pre>
              {mentionProfiles?.length > 0 && profilesOpen && (
                <div
                  className={`absolute w-44 max-h-28 h-fit flex flex-col overflow-y-scroll items-start justify-start z-2 rounded-lg`}
                  style={{
                    top: caretCoord.y + 30,
                    left: caretCoord.x,
                  }}
                >
                  {mentionProfiles?.map((user: Profile, index: number) => {
                    const profileImage = createProfilePicture(
                      user.metadata?.picture
                    );
                    return (
                      <div
                        key={index}
                        className={`relative w-full h-fit px-3 py-2 bg-white flex flex-row gap-3 cursor-pointer items-center justify-center border-y border-black hover:bg-rosa/70 z-2`}
                        onClick={() => {
                          handleMentionClick(user);
                        }}
                      >
                        <div className="relative flex flex-row w-full h-full text-black font-earl lowercase place-self-center gap-2">
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
        )}
        <div className="relative w-full h-fit galaxy:h-12 flex flex-row items-center gap-3 flex-wrap galaxy:flex-nowrap">
          <div className="relative w-fit h-fit flex flex-row items-center gap-2 justify-start">
            <div className="relative w-3 h-3 rounded-full" id="chrome"></div>
            <div className="relative w-3 h-3 rounded-full" id="chrome"></div>
            <Options
              videoLoading={videoLoading}
              imageLoading={imageLoading}
              commentLoading={commentLoading}
              uploadImage={uploadImage}
              uploadVideo={uploadVideo}
              setGifOpen={setGifOpen}
              gifOpen={gifOpen}
              collectOpen={collectOpen}
              dispatch={dispatch}
              postImages={postImagesDispatched}
            />
          </div>
          <div className="relative w-full h-fit justify-end flex flex-row gap-2 items-center">
            <div className="relative w-24 min-w-fit h-10 border-white border rounded-tr-xl rounded-bl-xl py-2 px-4 flex items-center cursor-pointer active:scale-95 hover:bg-moda justify-center">
              <div
                className={`relative w-full h-full flex text-white font-arcade items-center text-center justify-center ${
                  commentLoading && "animate-spin"
                }`}
                onClick={
                  !connected && !lensProfile?.id
                    ? openConnectModal
                    : connected && !lensProfile?.id
                    ? () => handleLensSignIn()
                    : commentLoading
                    ? () => {}
                    : collectNotif !== ""
                    ? () =>
                        dispatch(
                          setModal({
                            actionOpen: true,
                            actionMessage: collectNotif,
                          })
                        )
                    : () => commentVideo()
                }
              >
                {!connected && !lensProfile?.id ? (
                  "CONNECT"
                ) : connected && !lensProfile?.id ? (
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

export default UserComment;
