import { FunctionComponent } from "react";
import {
  BsSuitHeartFill,
  BsSuitHeart,
  BsCollection,
  BsFillCollectionFill,
  BsChatLeftQuote,
} from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";
import {
  AiOutlineLoading,
  AiOutlineMinusCircle,
  AiOutlineRetweet,
} from "react-icons/ai";
import { ReactionProps } from "../types/wavs.types";
import handleHidePost from "@/lib/helpers/handleHidePost";
import {
  ImageMetadataV3,
  SimpleCollectOpenActionSettings,
} from "@/components/Home/types/generated";
import { setMakePost } from "@/redux/reducers/makePostSlice";
import { setWho } from "@/redux/reducers/whoSlice";
import { setFollowCollect } from "@/redux/reducers/followCollectSlice";
import openActionCheck from "@/lib/helpers/openActionCheck";

const Reactions: FunctionComponent<ReactionProps> = ({
  dispatch,
  address,
  collect,
  mirror,
  like,
  publication,
  interactionsLoading,
  index,
  setOpenComment,
  router,
  openMirrorChoice,
  setOpenMirrorChoice,
  main,
}): JSX.Element => {
  return (
    <div
      className={`relative w-full h-fit gap-4 flex flex-col items-center justify-center`}
    >
      <div className="relative w-fit sm:w-full h-fit flex flex-row flex-wrap sm:grid sm:grid-cols-2 sm:auto-cols-auto gap-4 items-center justify-center">
        <div className="relative w-fit sm:w-full h-fit grid grid-rows-2 auto-rows-auto gap-4 items-center justify-center">
          {[
            {
              loader: interactionsLoading?.collect,
              function: () =>
                openActionCheck(
                  publication?.openActionModules?.[0]?.contract?.address
                )
                  ? router.push(
                      `/autograph/${
                        publication?.by?.handle?.suggestedFormatted?.localName?.split(
                          "@"
                        )?.[1]
                      }/collection/${(
                        publication?.metadata as ImageMetadataV3
                      )?.title?.replaceAll(" ", "_")}`
                    )
                  : publication?.openActionModules?.[0]?.__typename ===
                    "SimpleCollectOpenActionSettings"
                  ? (Number(
                      (
                        publication
                          ?.openActionModules?.[0] as SimpleCollectOpenActionSettings
                      )?.amount?.value
                    ) == 0 ||
                      !Number(
                        (
                          publication
                            ?.openActionModules?.[0] as SimpleCollectOpenActionSettings
                        )?.amount?.value
                      )) &&
                    (!(
                      publication
                        ?.openActionModules?.[0] as SimpleCollectOpenActionSettings
                    )?.followerOnly ||
                      ((
                        publication
                          ?.openActionModules?.[0] as SimpleCollectOpenActionSettings
                      )?.followerOnly &&
                        publication?.by?.operations?.isFollowedByMe?.value)) &&
                    (publication?.stats?.countOpenActions <
                      Number(
                        (
                          publication
                            ?.openActionModules?.[0] as SimpleCollectOpenActionSettings
                        )?.collectLimit
                      ) ||
                      Number(
                        (
                          publication
                            ?.openActionModules?.[0] as SimpleCollectOpenActionSettings
                        )?.collectLimit
                      ) == 0 ||
                      !(
                        publication
                          ?.openActionModules?.[0] as SimpleCollectOpenActionSettings
                      )?.collectLimit)
                    ? collect(
                        publication?.id,
                        publication?.openActionModules?.[0]?.type!,
                        index,
                        main
                      )
                    : (
                        publication
                          ?.openActionModules?.[0] as SimpleCollectOpenActionSettings
                      )?.followerOnly &&
                      !publication?.by?.operations?.isFollowedByMe?.value
                    ? dispatch(
                        setFollowCollect({
                          actionType: "follow",
                          actionFollower: publication?.by,
                        })
                      )
                    : dispatch(
                        setFollowCollect({
                          actionType: "collect",
                          actionCollect: {
                            id: publication?.id,
                            stats: publication?.stats.countOpenActions,
                            item: publication?.openActionModules?.[0],
                          },
                        })
                      )
                  : {},

              functionWho: () =>
                dispatch(
                  setWho({
                    actionOpen: true,
                    actionType: "collect",
                    actionValue: publication?.id,
                  })
                ),
              color: "#81A8F8",
              amount: publication?.stats?.countOpenActions,
              responded: publication?.operations?.hasActed?.value,
              icon: <BsCollection color={"#81A8F8"} size={15} />,
              respondedIcon: (
                <BsFillCollectionFill size={15} color={"#81A8F8"} />
              ),
            },
            {
              loader: interactionsLoading?.comment,
              function: () =>
                setOpenComment((prev) => (prev !== index ? index : undefined)),
              functionWho: () =>
                !router?.asPath?.includes("/autograph/")
                  ? router.push(
                      router?.asPath?.includes("&post=")
                        ? router?.asPath?.includes("?option=")
                          ? router?.asPath.split("&post=")[0] +
                            `&post=${publication.id}`
                          : router?.asPath.split("&post=")[0] +
                            `?option=history&post=${publication.id}`
                        : router?.asPath?.includes("&profile=")
                        ? router?.asPath?.includes("?option=")
                          ? router?.asPath.split("&profile=")[0] +
                            `&post=${publication.id}`
                          : router?.asPath.split("&profile=")[0] +
                            `?option=history&post=${publication.id}`
                        : router?.asPath?.includes("?option=")
                        ? router?.asPath + `&post=${publication.id}`
                        : router?.asPath +
                          `?option=history&post=${publication.id}`
                    )
                  : router.replace(
                      `/#chat?option=history&post=${publication?.id}`
                    ),
              color: "#0AC7AB",
              amount: publication?.stats?.comments,
              responded: false,
              icon: <FaRegCommentDots color={"#0AC7AB"} size={15} />,
              respondedIcon: <FaRegCommentDots size={15} color={"#0AC7AB"} />,
            },
          ]?.map(
            (
              item: {
                loader: boolean;
                function: () => void;
                functionWho: () => void;
                amount: number;
                responded: boolean;
                icon: JSX.Element;
                respondedIcon: JSX.Element;
                color: string;
              },
              index
            ) => {
              return (
                <div
                  key={index}
                  className="relative w-full h-fit flex flex-col gap-2 items-center justify-center"
                >
                  <div
                    className={`relative w-fit h-fit flex items-center justify-center cursor-pointer hover:opacity-70 active:scale-95 ${
                      item?.loader && "animate-spin"
                    }`}
                    onClick={() => !item?.loader && item?.function()}
                  >
                    {item?.loader ? (
                      <AiOutlineLoading size={15} color={item?.color} />
                    ) : item?.amount > 0 && item?.responded ? (
                      item?.respondedIcon
                    ) : (
                      item?.icon
                    )}
                  </div>
                  <div
                    className={`relative w-fit h-fit text-black font-dosis text-xs flex items-center justify-center ${
                      item?.amount > 0 && "cursor-pointer"
                    }`}
                    onClick={() => item?.amount > 0 && item?.functionWho()}
                  >
                    {item?.amount}
                  </div>
                </div>
              );
            }
          )}
        </div>
        <div className="relative w-fit sm:w-full h-fit grid grid-rows-2 auto-rows-auto gap-4 items-center justify-center">
          {[
            {
              loader: interactionsLoading?.like,
              function: () =>
                like(
                  publication?.id,
                  publication?.operations?.hasReacted!,
                  index,
                  main
                ),
              functionWho: () =>
                dispatch(
                  setWho({
                    actionOpen: true,
                    actionType: "heart",
                    actionValue: publication?.id,
                  })
                ),
              color: "red",
              amount: publication?.stats?.reactions,
              responded: publication?.operations?.hasReacted,
              icon: <BsSuitHeart color={"red"} size={15} />,
              respondedIcon: <BsSuitHeartFill size={15} color={"red"} />,
            },
            {
              loader: interactionsLoading?.mirror,
              function: () =>
                setOpenMirrorChoice((prev) => {
                  const arr = [...prev];
                  arr[index] = !arr[index];
                  return arr;
                }),
              functionWho: () =>
                dispatch(
                  setWho({
                    actionOpen: true,
                    actionType: "mirror",
                    actionValue: publication?.id,
                  })
                ),
              color: "#712AF6",
              amount: publication?.stats?.mirrors,
              responded: publication?.operations?.hasMirrored,
              icon: <AiOutlineRetweet color={"#712AF6"} size={15} />,
              respondedIcon: <AiOutlineRetweet size={15} color={"#712AF6"} />,
            },
          ]?.map(
            (
              item: {
                loader: boolean;
                function: () => void;
                functionWho: () => void;
                amount: number;
                responded: boolean;
                icon: JSX.Element;
                respondedIcon: JSX.Element;
                color: string;
              },
              index
            ) => {
              return (
                <div
                  key={index}
                  className="relative w-full h-fit flex flex-col gap-2 items-center justify-center"
                >
                  <div
                    className={`relative w-fit h-fit flex items-center justify-center hover:opacity-70 cursor-pointer active:scale-95 ${
                      item?.loader && "animate-spin"
                    }`}
                    onClick={() => !item?.loader && item?.function()}
                  >
                    {item?.loader ? (
                      <AiOutlineLoading size={15} color={item?.color} />
                    ) : item?.amount > 0 && item?.responded ? (
                      item?.respondedIcon
                    ) : (
                      item?.icon
                    )}
                  </div>
                  <div
                    className={`relative w-fit h-fit flex items-center justify-center text-black font-dosis text-xs ${
                      item?.amount > 0 && "cursor-pointer"
                    }`}
                    onClick={() => item?.amount > 0 && item?.functionWho()}
                  >
                    {item?.amount}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
      {openMirrorChoice?.[index] && (
        <div className="absolute flex flex-row items-center justify-center p-1.5 gap-3 bg-shame/80 border border-[#44afd3] rounded-md z-10">
          <div
            onClick={() =>
              !interactionsLoading?.mirror &&
              mirror(publication?.id, index, main)
            }
            className={`relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95 ${
              interactionsLoading?.mirror && "animate-spin"
            }`}
          >
            {interactionsLoading?.mirror ? (
              <AiOutlineLoading size={15} color={"#712AF6"} />
            ) : (
              <AiOutlineRetweet color={"#712AF6"} size={15} />
            )}
          </div>
          <div
            className={`relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95`}
            onClick={() => {
              const updatedArray = [...openMirrorChoice];
              updatedArray[index] = false;
              setOpenMirrorChoice(updatedArray);
              dispatch(
                setMakePost({
                  actionValue: true,
                  actionQuote: publication,
                })
              );
            }}
          >
            <BsChatLeftQuote color={"#712AF6"} size={15} />
          </div>
        </div>
      )}
      {(publication?.by?.ownedBy?.address === address ? true : false) && (
        <div
          className={`relative w-fit h-fit row-start-3 col-start-1 col-span-2 grid grid-flow-col auto-cols-auto gap-2 place-self-center cursor-pointer active:scale-95`}
          onClick={() => handleHidePost(publication.id as string, dispatch)}
        >
          <AiOutlineMinusCircle color={"black"} size={15} />
        </div>
      )}
    </div>
  );
};

export default Reactions;
