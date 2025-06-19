import { FunctionComponent, JSX, useContext } from "react";
import { ImCross } from "react-icons/im";
import Image from "next/legacy/image";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { VideoMetadata } from "@lens-protocol/client";
import useQuests from "../hooks/useQuests";
import { AiOutlineLoading } from "react-icons/ai";
import useLens from "../../Common/hooks/useLens";
import { useAccount } from "wagmi";
import { useModal } from "connectkit";
import { usePathname } from "next/navigation";
import { handleImage } from "@/app/lib/helpers/handleImage";

const Quests: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  const { questsLoading, allVideoQuests, handleJoinQuest, joinLoading } =
    useQuests(dict);
  const { isConnected, address } = useAccount();
  const { lensCargando, handleConectarse } = useLens(
    isConnected,
    address,
    dict
  );
  const path = usePathname();
  const { openOnboarding } = useModal();
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
                  onClick={() => context?.setQuest(undefined)}
                />
              </div>
              <div className="relative w-full h-fit flex flex-col items-center justify-center px-4 gap-10 overflow-x-scroll">
                <div className="relative w-full h-fit flex items-center w-full h-fit gap-6 flex-col justify-center text-white font-dosis">
                  <div className="relative w-full h-fit justify-center items-center text-lg text-center">
                    {dict?.kinora}
                  </div>
                  <div className="relative w-5/6 h-fit flex items-center justify-start gap-3">
                    <div className="relative w-16 h-10 flex items-center justify-center rounded-sm border border-cost">
                      <Image
                        draggable={false}
                        layout="fill"
                        className="rounded-sm"
                        objectFit="cover"
                        src={handleImage(
                          (context?.quest?.metadata as VideoMetadata)?.video
                            ?.cover
                        )}
                      />
                    </div>
                    <div className="relative w-full h-fit flex items-start justify-start flex-col gap-1">
                      <div className="relative w-fit h-fit flex items-center justify-center text-xs text-white font-dosis break-words">
                        {Number(
                          (context?.quest?.metadata as VideoMetadata)?.title
                            ?.length
                        ) > 16
                          ? (
                              context?.quest?.metadata as VideoMetadata
                            )?.title?.slice(0, 12) + "..."
                          : (context?.quest?.metadata as VideoMetadata)?.title}
                      </div>
                      <div className="relative w-fit h-fit flex items-center justify-center text-xs text-gray-600 font-dosis break-words">
                        {(context?.quest?.metadata as VideoMetadata)?.content
                          ?.length > 40
                          ? (
                              context?.quest?.metadata as VideoMetadata
                            )?.content?.slice(0, 40) + "..."
                          : (context?.quest?.metadata as VideoMetadata)
                              ?.content}
                      </div>
                    </div>
                  </div>
                  {allVideoQuests?.length > 0 && (
                    <div className="relative w-full h-fit justify-center items-center text-lg text-center">
                      {dict?.all}
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
                      ) : allVideoQuests?.length > 0 ? (
                        allVideoQuests?.map((quest, index: number) => {
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
                                      `https://kinora.irrevocable.dev/quest/${quest?.postId}`
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
                                            item?.playerProfile ==
                                            context?.lensConectado?.profile
                                              ?.address
                                        )
                                          ? "cursor-pointer active:scale-95"
                                          : "opacity-70"
                                      }`}
                                      onClick={
                                        !address
                                          ? () => openOnboarding()
                                          : !context?.lensConectado?.profile
                                          ? () => handleConectarse()
                                          : () =>
                                              !joinLoading?.[index] &&
                                              !quest?.players?.some(
                                                (item) =>
                                                  item?.playerProfile ==
                                                  context?.lensConectado
                                                    ?.profile?.address
                                              ) &&
                                              handleJoinQuest(quest)
                                      }
                                    >
                                      <div
                                        className={`relative w-fit h-fit flex items-center justify-center ${
                                          (lensCargando ||
                                            joinLoading?.[index]) &&
                                          "animate-spin"
                                        } ${
                                          path?.includes("/es/")
                                            ? "text-xxs"
                                            : "text-xs"
                                        }`}
                                      >
                                        {joinLoading?.[index] ||
                                        lensCargando ? (
                                          <AiOutlineLoading
                                            size={10}
                                            color="#847FF2"
                                          />
                                        ) : quest?.players?.some(
                                            (item) =>
                                              item?.playerProfile ==
                                              context?.lensConectado?.profile
                                                ?.address
                                          ) ? (
                                          dict?.join
                                        ) : (
                                          dict?.quest
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="relative w-fit h-fit flex items-start justify-start text-xs flex-col gap-1">
                                <div className="relative w-fit h-fit flex flex-row items-center justify-start text-white font-bit gap-3">
                                  <div className="relative w-fit h-fit flex items-center justify-center">
                                    {dict?.mil}
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
                                    {dict?.mix}
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
                            {dict?.noQ}
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
                              {dict?.env}
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
