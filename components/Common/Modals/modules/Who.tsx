import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ImCross } from "react-icons/im";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import { WhoProps } from "../types/modals.types";
import { Profile } from "@/components/Home/types/generated";
import { setWho } from "@/redux/reducers/whoSlice";
import handleImageError from "@/lib/helpers/handleImageError";

const Who: FunctionComponent<WhoProps> = ({
  loading,
  fetchMore,
  accounts,
  dispatch,
  hasMore,
  router,
  type,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full md:w-[40vw] lg:w-[25vw] h-fit col-start-1 place-self-center bg-offBlack rounded-lg">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-4 pb-8">
              <div className="relative w-fit h-fit items-end justify-end ml-auto pr-3 pt-3 cursor-pointer flex">
                <ImCross
                  color="white"
                  size={10}
                  onClick={() =>
                    dispatch(
                      setWho({
                        actionOpen: false,
                        actionType: "",
                        actionValue: "",
                        actionReact: "",
                      })
                    )
                  }
                />
              </div>
              {!loading ? (
                <>
                  {accounts?.length > 0 && (
                    <div className="relative w-full h-fit flex flex-col">
                      <InfiniteScroll
                        hasMore={hasMore}
                        dataLength={accounts?.length}
                        next={fetchMore}
                        loader={""}
                        height={"10rem"}
                        className="relative w-full h-fit flex flex-col px-4 gap-2 overflow-y-scroll"
                      >
                        {accounts?.map((account: any, index: number) => {
                          const reacter: Profile =
                            type === 0 ? account.profile : account;

                          const profileImage = createProfilePicture(
                            reacter?.metadata?.picture
                          );

                          return (
                            <div
                              key={index}
                              className="relative w-full h-fit p-2 drop-shadow-lg flex flex-row bg-gradient-to-r from-offBlack via-gray-600 to-black auto-cols-auto rounded-lg border border-black font-economica text-white cursor-pointer"
                              onClick={() =>
                                !router?.asPath?.includes("/autograph/")
                                  ? router.push(
                                      router?.asPath?.includes("&post=")
                                        ? router?.asPath?.includes("?option=")
                                          ? router?.asPath.split("&post=")[0] +
                                            `&profile=${
                                              reacter?.handle?.suggestedFormatted?.localName?.split(
                                                "@"
                                              )[1]
                                            }`
                                          : router?.asPath.split("&post=")[0] +
                                            `?option=history&profile=${
                                              reacter?.handle?.suggestedFormatted?.localName?.split(
                                                "@"
                                              )[1]
                                            }`
                                        : router?.asPath?.includes("&profile=")
                                        ? router?.asPath?.includes("?option=")
                                          ? router?.asPath.split(
                                              "&profile="
                                            )[0] +
                                            `&profile=${
                                              reacter?.handle?.suggestedFormatted?.localName?.split(
                                                "@"
                                              )[1]
                                            }`
                                          : router?.asPath.split(
                                              "&profile="
                                            )[0] +
                                            `?option=history&profile=${
                                              reacter?.handle?.suggestedFormatted?.localName?.split(
                                                "@"
                                              )[1]
                                            }`
                                        : router?.asPath?.includes("?option=")
                                        ? router?.asPath +
                                          `&profile=${
                                            reacter?.handle?.suggestedFormatted?.localName?.split(
                                              "@"
                                            )[1]
                                          }`
                                        : router?.asPath +
                                          `?option=history&profile=${
                                            reacter?.handle?.suggestedFormatted?.localName?.split(
                                              "@"
                                            )[1]
                                          }`
                                    )
                                  : router?.replace(
                                      `/#chat?option=history&profile=${
                                        reacter?.handle?.suggestedFormatted?.localName?.split(
                                          "@"
                                        )[1]
                                      }`,
                                      undefined
                                    )
                              }
                            >
                              <div className="relative w-fit h-fit flex flex-row gap-6">
                                <div
                                  className="relative w-6 h-6 rounded-full col-start-1"
                                  id="crt"
                                >
                                  {profileImage && (
                                    <Image
                                      src={profileImage}
                                      onError={(e) => handleImageError(e)}
                                      objectFit="cover"
                                      layout="fill"
                                      alt="pfp"
                                      className="relative w-fit h-fit rounded-full self-center flex"
                                      draggable={false}
                                    />
                                  )}
                                </div>
                                <div
                                  id="handle"
                                  className="relative w-fit h-fit justify-center flex"
                                >
                                  {
                                    reacter?.handle?.suggestedFormatted
                                      ?.localName
                                  }
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </InfiniteScroll>
                    </div>
                  )}
                </>
              ) : (
                <div className="relative w-[40vw] md:w-full h-60 grid grid-flow-col auto-cols-auto">
                  <div className="relative w-fit h-fit col-start-1 place-self-center animate-spin">
                    <AiOutlineLoading color="white" size={20} />
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

export default Who;
