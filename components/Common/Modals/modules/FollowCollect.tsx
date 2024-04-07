import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { AiOutlineLoading } from "react-icons/ai";
import moment from "moment";
import { FeeFollowModuleSettings } from "@/components/Home/types/generated";
import { setFollowCollect } from "@/redux/reducers/followCollectSlice";
import { FollowCollectProps } from "../types/modals.types";
import createProfilePicture from "@/lib/helpers/createProfilePicture";

const FollowCollect: FunctionComponent<FollowCollectProps> = ({
  dispatch,
  type,
  collect,
  follower,
  handleFollow,
  t,
  handleUnfollow,
  handleCollect,
  transactionLoading,
  informationLoading,
  approved,
  approveSpend,
}): JSX.Element => {
  const pfp =
    (type == "follow" ||
      (type == "collect" &&
        collect?.item?.followerOnly &&
        !follower?.operations?.isFollowedByMe?.value)) &&
    createProfilePicture(follower?.metadata?.picture);
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div
        className={`relative w-[80vw] sm:w-[35vw] tablet:w-[20vw] h-fit max-h-[90vh]  place-self-center bg-offBlack overflow-y-scroll rounded-lg ${
          ((type == "collect" && !collect?.item?.followerOnly) ||
            (type == "collect" &&
              collect?.item?.followerOnly &&
              follower?.operations?.isFollowedByMe?.value)) &&
          "min-h-[27vh]"
        }`}
      >
        <div className="relative w-full h-full flex flex-col gap-3 px-2 pt-2 pb-4 items-center justify-start">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="white"
              size={10}
              onClick={() =>
                dispatch(
                  setFollowCollect({
                    actionType: undefined,
                  })
                )
              }
            />
          </div>
          {(type == "collect" && !collect?.item?.followerOnly) ||
          (type == "collect" &&
            collect?.item?.followerOnly &&
            follower?.operations?.isFollowedByMe?.value) ? (
            <div
              className={`relative rounded-md flex flex-col gap-5 w-5/6 p-2 items-center justify-center w-full h-fit font-dosis text-white text-sm`}
            >
              <div className="relative w-fit h-fit flex items-center justify-center">
                {t("ready")}
              </div>
              <div className="relative w-3/4 items-center justify-center rounded-md border border-white h-40 flex">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmTvBPrZLKJrmgtxjL9XkchvtkDcaeG22tNwj6gsViAh7c`}
                  objectFit="cover"
                  layout="fill"
                  className="rounded-md"
                  draggable={false}
                />
              </div>
              {collect?.item?.endsAt && (
                <div className="relative w-fit h-fit flex items-center justify-center font-arcade break-words px-2 text-center">
                  {collect?.item?.endsAt < Date.now()
                    ? t("over")
                    : `${t("fin")} ${
                        moment
                          .duration(
                            moment(collect?.item?.endsAt).diff(moment())
                          )
                          .asMilliseconds() > 0
                          ? `${moment
                              .utc(moment(collect?.item?.endsAt).diff(moment()))
                              .format("H [hrs]")} and ${moment
                              .utc(moment(collect?.item?.endsAt).diff(moment()))
                              .format("m [min]")}`
                          : "0 hrs and 0 min"
                      }`}
                </div>
              )}
              {Number(collect?.item?.collectLimit) > 0 && (
                <div className="relative w-fit h-fit flex items-center justify-center font-arcade text-base text-center">
                  {collect?.stats} / {collect?.item?.collectLimit}
                </div>
              )}
              {collect?.item?.amount &&
                Number(collect?.item?.amount?.value) > 0 && (
                  <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-2 font-arcade text-base text-sol">
                    <div className="relative w-fit h-fit flex items-center justify-center">
                      {collect?.item?.amount?.value}
                    </div>
                    <div className="relative w-fit h-fit flex items-center justify-center">
                      {collect?.item?.amount?.asset?.symbol}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div
              className={`relative rounded-md flex flex-col gap-5 w-5/6 p-2 items-center justify-center w-full h-fit font-dosis text-white text-sm`}
            >
              <div className="relative w-fit h-fit flex items-center justify-center">
                Follow {follower?.handle?.suggestedFormatted?.localName}{" "}
                {type == "collect" &&
                  collect?.item?.followerOnly &&
                  !follower?.operations?.isFollowedByMe?.value &&
                  "to collect"}
              </div>
              <div className="relative items-center justify-center rounded-full h-12 w-12 border border-white flex">
                {pfp && (
                  <Image
                    src={pfp}
                    objectFit="cover"
                    layout="fill"
                    className="rounded-full"
                    draggable={false}
                  />
                )}
              </div>
              {follower?.followModule &&
                Number(
                  (follower?.followModule as FeeFollowModuleSettings)?.amount
                    .value
                ) > 0 && (
                  <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-2 font-arcade text-base">
                    <div className="relative w-fit h-fit flex items-center justify-center">
                      {
                        (follower?.followModule as FeeFollowModuleSettings)
                          ?.amount?.value
                      }
                    </div>
                    <div className="relative w-fit h-fit flex items-center justify-center">
                      {
                        (follower?.followModule as FeeFollowModuleSettings)
                          ?.amount?.asset?.symbol
                      }
                    </div>
                  </div>
                )}
            </div>
          )}
          <div
            className={`relative w-28 h-8 py-1 px-2 border border-offBlack rounded-md font-earl text-offBlack bg-azul flex items-center justify-center text-xs ${
              !transactionLoading &&
              !informationLoading &&
              "cursor-pointer active:scale-95"
            }`}
            onClick={() =>
              !transactionLoading &&
              !informationLoading &&
              (!approved &&
              type === "collect" &&
              (!collect?.item?.followerOnly ||
                (follower?.operations?.isFollowedByMe?.value &&
                  collect?.item?.followerOnly))
                ? approveSpend()
                : approved &&
                  ((type === "collect" && !collect?.item?.followerOnly) ||
                    (follower?.operations?.isFollowedByMe?.value &&
                      collect?.item?.followerOnly))
                ? handleCollect()
                : follower?.operations?.isFollowedByMe?.value
                ? handleUnfollow()
                : handleFollow())
            }
          >
            <div
              className={`relative w-fit h-fit flex items-center justify-center ${
                (transactionLoading || informationLoading) && "animate-spin"
              }`}
            >
              {transactionLoading || informationLoading ? (
                <AiOutlineLoading size={15} color={"white"} />
              ) : type === "collect" &&
                !approved &&
                type === "collect" &&
                (!collect?.item?.followerOnly ||
                  (follower?.operations?.isFollowedByMe?.value &&
                    collect?.item?.followerOnly)) ? (
                t("spend")
              ) : type === "collect" &&
                (!collect?.item?.followerOnly ||
                  (follower?.operations?.isFollowedByMe?.value &&
                    collect?.item?.followerOnly)) ? (
                Number(collect?.item?.collectLimit) ==
                Number(collect?.stats) ? (
                  t("spend")
                ) : (
                  t("col2")
                )
              ) : follower?.operations?.isFollowedByMe?.value ? (
                t("unfo")
              ) : (
                t("foll")
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowCollect;
