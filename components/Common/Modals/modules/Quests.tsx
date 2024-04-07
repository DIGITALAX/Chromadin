import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { QuestsProps } from "../types/modals.types";
import { setQuestRedux } from "@/redux/reducers/questSlice";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import { VideoMetadataV3 } from "@/components/Home/types/generated";
import { Quest } from "../../Video/types/controls.types";
import { AiOutlineLoading } from "react-icons/ai";
import toHexWithLeadingZero from "@/lib/helpers/leadingZero";

const Quests: FunctionComponent<QuestsProps> = ({
  dispatch,
  quests,
  signInLoading,
  video,
  questsLoading,
  handleJoinQuest,
  joinLoading,
  lensProfile,
  address,
  openConnectModal,
  handleLensSignIn,
  t,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto overflow-x-scroll">
      <div className="relative w-full lg:w-[30vw] h-fit col-start-1 place-self-center bg-offBlack rounded-lg border-cost">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-4 pb-8">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={10}
                  onClick={() =>
                    dispatch(
                      setQuestRedux({
                        actionOpen: false,
                      })
                    )
                  }
                />
              </div>
              <div className="relative w-full h-fit flex flex-col items-center justify-center px-4 gap-10 overflow-x-scroll">
                <div className="relative w-full h-fit flex items-center w-full h-fit gap-6 flex-col justify-center text-white font-dosis">
                  <div className="relative w-full h-fit justify-center items-center text-lg text-center">
                    {t("kinora")}
                  </div>
                  <div className="relative w-5/6 h-fit flex items-center justify-start gap-3">
                    <div className="relative w-16 h-10 flex items-center justify-center rounded-sm border border-cost">
                      <Image
                        draggable={false}
                        layout="fill"
                        className="rounded-sm"
                        objectFit="cover"
                        src={`${INFURA_GATEWAY}/ipfs/${
                          (
                            video?.metadata as VideoMetadataV3
                          )?.asset?.cover?.raw?.uri?.split("ipfs://")?.[1]
                        }`}
                      />
                    </div>
                    <div className="relative w-full h-fit flex items-start justify-start flex-col gap-1">
                      <div className="relative w-fit h-fit flex items-center justify-center text-xs text-white font-dosis break-words">
                        {(video?.metadata as VideoMetadataV3)?.title?.length >
                        16
                          ? (video?.metadata as VideoMetadataV3)?.title?.slice(
                              0,
                              12
                            ) + "..."
                          : (video?.metadata as VideoMetadataV3)?.title}
                      </div>
                      <div className="relative w-fit h-fit flex items-center justify-center text-xs text-gray-600 font-dosis break-words">
                        {(video?.metadata as VideoMetadataV3)?.content?.length >
                        40
                          ? (
                              video?.metadata as VideoMetadataV3
                            )?.content?.slice(0, 40) + "..."
                          : (video?.metadata as VideoMetadataV3)?.content}
                      </div>
                    </div>
                  </div>
                  {quests?.length > 0 && (
                    <div className="relative w-full h-fit justify-center items-center text-lg text-center">
                      {t("all")}
                    </div>
                  )}
                  <div className="relative w-full justify-center items-center flex h-full max-h-[60vh] overflow-y-scroll flex-col">
                    <div className="relative w-full h-fit flex flex-col items-center justify-start gap-3">
                      {questsLoading ? (
                        Array.from({ length: 3 })?.map((_, index) => {
                          return (
                            <div
                              key={index}
                              className="relative w-full flex items-center justify-center flex-row gap-2 h-20"
                              id="staticLoad"
                            ></div>
                          );
                        })
                      ) : quests?.length > 0 ? (
                        quests?.map((quest: Quest, index: number) => {
                          return (
                            <div
                              key={index}
                              className="relative w-full flex items-center justify-between flex-row gap-2 h-fit"
                            >
                              <div className="relative w-fit h-full flex items-center justify-start flex-row gap-2">
                                <div
                                  className="relative w-32 h-20 flex items-center justify-center rounded-sm border border-cost cursor-pointer"
                                  onClick={() =>
                                    window.open(
                                      `https://kinora.irrevocable.dev/quest/${toHexWithLeadingZero(
                                        Number(quest?.profileId)
                                      )}-${toHexWithLeadingZero(
                                        Number(quest?.pubId)
                                      )}`
                                    )
                                  }
                                >
                                  <Image
                                    draggable={false}
                                    layout="fill"
                                    className="rounded-sm"
                                    objectFit="cover"
                                    src={`${INFURA_GATEWAY}/ipfs/${
                                      quest?.questMetadata?.cover?.split(
                                        "ipfs://"
                                      )?.[1]
                                    }`}
                                  />
                                </div>
                                <div className="relative w-fit h-fit flex items-start justify-between flex-col gap-1">
                                  <div className="relative w-fit h-fit flex items-center justify-center text-xs text-white font-dosis break-words">
                                    {quest?.questMetadata?.title?.length > 16
                                      ? quest?.questMetadata?.title?.slice(
                                          0,
                                          12
                                        ) + "..."
                                      : quest?.questMetadata?.title}
                                  </div>
                                  <div className="relative w-fit h-fit flex items-center justify-center text-xs text-gray-600 font-dosis break-words">
                                    {quest?.questMetadata?.description?.length >
                                    20
                                      ? quest?.questMetadata?.description?.slice(
                                          0,
                                          20
                                        ) + "..."
                                      : quest?.questMetadata?.description}
                                  </div>

                                  <div className="relative w-fit h-fit flex items-center justify-center">
                                    <div
                                      className={`relative w-20 h-7 flex items-center px-2 py-1 justify-center rounded-sm bg-black border border-cost ${
                                        !quest?.players?.some(
                                          (item) =>
                                            toHexWithLeadingZero(
                                              Number(item?.profileId)
                                            ) == lensProfile?.id
                                        )
                                          ? "cursor-pointer active:scale-95"
                                          : "opacity-70"
                                      }`}
                                      onClick={
                                        !address
                                          ? openConnectModal
                                          : !lensProfile?.id
                                          ? () => handleLensSignIn()
                                          : () =>
                                              !joinLoading?.[index] &&
                                              !quest?.players?.some(
                                                (item) =>
                                                  toHexWithLeadingZero(
                                                    Number(item?.profileId)
                                                  ) == lensProfile?.id
                                              ) &&
                                              handleJoinQuest(quest)
                                      }
                                    >
                                      <div
                                        className={`relative w-fit h-fit flex items-center justify-center text-xs ${
                                          signInLoading ||
                                          (joinLoading?.[index] &&
                                            "animate-spin")
                                        }`}
                                      >
                                        {joinLoading?.[index] ||
                                        signInLoading ? (
                                          <AiOutlineLoading
                                            size={10}
                                            color="#847FF2"
                                          />
                                        ) : quest?.players?.some(
                                            (item) =>
                                              toHexWithLeadingZero(
                                                Number(item?.profileId)
                                              ) == lensProfile?.id
                                          ) ? (
                                          t("join")
                                        ) : (
                                          t("quest")
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="relative w-fit h-fit flex items-start justify-start text-xs flex-col gap-1">
                                <div className="relative w-fit h-fit flex flex-row items-center justify-start text-white font-bit gap-3">
                                  <div className="relative w-fit h-fit flex items-center justify-center">
                                    {t("mil")}
                                  </div>
                                  <div className="relative w-fit h-fit flex items-center justify-center text-cost break-words">
                                    {quest?.milestoneCount}
                                  </div>
                                </div>
                                <div className="relative w-full h-fit flex flex-row items-center justify-start text-white font-bit gap-3">
                                  <div className="relative w-fit h-fit flex items-center text-white justify-center">{`Max Player Count: ${
                                    Number(quest?.maxPlayerCount) ==
                                    Number(quest?.players?.length)
                                      ? "Limit Reached"
                                      : `${Number(
                                          quest?.players?.length
                                        )} / ${Number(quest?.maxPlayerCount)}`
                                  }`}</div>
                                </div>
                                <div className="relative w-full h-fit flex flex-row items-center justify-start gap-1 break-words">
                                  <div className="relative w-fit h-fit flex items-center justify-center">
                                    {t("mix")}
                                  </div>
                                  <div className="relative w-fit h-fit flex items-center justify-center text-cost break-words">
                                    {(quest?.milestones
                                      ?.map(
                                        (item) =>
                                          item?.rewards?.filter(
                                            (rew) => rew?.type == "0"
                                          )?.length
                                      )
                                      ?.filter(Boolean)?.length! > 0
                                      ? quest?.milestones?.reduce(
                                          (acumulador, valorActual) =>
                                            acumulador +
                                            Number(
                                              valorActual?.rewards?.filter(
                                                (rew) => rew?.type == "0"
                                              )?.length
                                            ),
                                          0
                                        ) + " x ERC20 + "
                                      : "") +
                                      (quest?.milestones
                                        ?.map(
                                          (item) =>
                                            item?.rewards?.filter(
                                              (rew) => rew?.type == "1"
                                            )?.length
                                        )
                                        ?.filter(Boolean)?.length! > 0
                                        ? quest?.milestones?.reduce(
                                            (acumulador, valorActual) =>
                                              acumulador +
                                              Number(
                                                valorActual?.rewards?.filter(
                                                  (rew) => rew?.type == "1"
                                                )?.length
                                              ),
                                            0
                                          ) + " x ERC721"
                                        : "")}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="relative w-full h-fit flex items-center justify-center flex-col gap-5">
                          <div className="relative w-fit h-fit flex items-center justify-center text-xs font-dosis text-white">
                            {t("noQ")}
                          </div>
                          <div
                            className="relative w-fit h-7 flex items-center px-2 py-1 justify-center rounded-sm bg-black border border-cost cursor-pointer"
                            onClick={() =>
                              window.open(
                                `https://kinora.irrevocable.dev/envoke`
                              )
                            }
                          >
                            <div
                              className={`relative w-fit h-fit flex items-center justify-center text-xs`}
                            >
                              {t("env")}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quests;
