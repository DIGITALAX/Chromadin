import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import { ModalContext } from "@/app/providers";
import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "@/app/lib/constants";
import { SimpleCollect } from "../types/modals.types";
import useCollectConfig from "../hooks/useCollectConfig";
import { evmAddress } from "@lens-protocol/client";

export const CollectOptions: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const contexto = useContext(ModalContext);
  const { drops, setDrops } = useCollectConfig(dict);
  return (
    <div
      className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        contexto?.setCollectOptions({
          open: false,
        });
      }}
    >
      <div
        className="relative flex w-fit h-fit overflow-y-scroll place-self-center bg-offBlack cursor-default rounded-lg"
        id="boxBg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-[90vw] sm:w-[70vw] half:w-[60vw] min-w-fit md:w-[40vw] lg:w-[40vw] max-h-[60vh] overflow-y-scroll h-fit flex items-start justify-center">
          <div
            className={`flex flex-col items-center p-4 gap-5 text-white font-arcade relative w-full lg:w-[75%] h-[80%] lg:h-[65%] justify-start flex overflow-y-scroll sm:text-base text-xs`}
          >
            <div
              className={`relative rounded-md flex flex-col gap-5 w-full lg:w-5/6 p-2 items-start justify-start max-h-fit`}
            >
              <div className="relative w-full h-full flex justify-center items-start gap-3 break-words p-3">
                <div className="relative h-fit w-full flex flex-wrap gap-4 items-start justify-center">
                  {[
                    {
                      type: "drop",
                      title: dict?.who,
                      dropValues: [dict?.todos, dict?.seguidor],
                      dropOpen: drops.whoCollectsOpen,
                      chosenValue: contexto?.postInfo?.collectTypes?.[
                        contexto?.collectOptions?.id!
                      ]?.followerOnGraph
                        ? dict?.seguidor
                        : dict?.todos,
                      showObject: true,
                      openDropdown: () =>
                        setDrops((prev) => ({
                          ...prev,
                          whoCollectsOpen: !prev.whoCollectsOpen,
                        })),
                      setValue: (item: string) => {
                        contexto?.setPostInfo((prev) => {
                          let colls = { ...prev?.collectTypes };
                          let col = colls?.[contexto?.collectOptions?.id!]
                            ? colls?.[contexto?.collectOptions?.id!]
                            : {};

                          let followerOnGraph =
                            item === dict?.seguidor
                              ? {
                                  followerOnGraph: {
                                    globalGraph: true as true,
                                  },
                                }
                              : {};

                          if (!followerOnGraph?.followerOnGraph) {
                            const { followerOnGraph, ...all } = col!;
                            col = all;
                          }

                          col =
                            drops?.award == "No"
                              ? {
                                  ...col,
                                  ...followerOnGraph,
                                  payToCollect: null,
                                }
                              : {
                                  ...col,
                                  ...followerOnGraph,
                                };

                          colls[contexto?.collectOptions?.id!] = col;

                          return {
                            ...prev,
                            collectTypes: colls,
                          };
                        });

                        setDrops((prev) => ({
                          ...prev,
                          whoCollectsOpen: false,
                        }));
                      },
                    },
                    {
                      type: "drop",
                      title: dict?.award,
                      dropValues: [dict?.yes, "No"],
                      dropOpen: drops.creatorAwardOpen,
                      chosenValue: drops.award,
                      showObject: true,
                      openDropdown: () =>
                        setDrops((prev) => ({
                          ...prev,
                          creatorAwardOpen: !prev.creatorAwardOpen,
                        })),
                      setValue: (item: string) => {
                        contexto?.setPostInfo((prev) => {
                          let colls = { ...prev?.collectTypes };
                          let col = colls?.[contexto?.collectOptions?.id!]
                            ? colls?.[contexto?.collectOptions?.id!]
                            : {};

                          let followerOnGraph =
                            contexto?.postInfo?.collectTypes?.[
                              contexto?.collectOptions?.id!
                            ]?.followerOnGraph === dict?.seguidor
                              ? {
                                  followerOnGraph: {
                                    globalGraph: true as true,
                                  },
                                }
                              : {};

                          if (!followerOnGraph?.followerOnGraph) {
                            const { followerOnGraph, ...all } = col!;
                            col = all;
                          }

                          col =
                            item == "No"
                              ? {
                                  ...col,
                                  ...followerOnGraph,
                                  payToCollect: null,
                                }
                              : ({
                                  ...col,
                                  payToCollect: {
                                    ...col?.payToCollect,
                                    referralShare: 0,
                                    amount: {
                                      value: "10",
                                      currency: evmAddress(
                                        ACCEPTED_TOKENS[0][1]?.toLowerCase()
                                      ),
                                    },
                                  },
                                } as any);

                          colls[contexto?.collectOptions?.id!] = col;

                          return {
                            ...prev,
                            collectTypes: colls,
                          };
                        });

                        setDrops((prev) => ({
                          ...prev,
                          creatorAwardOpen: false,
                          award: item,
                        }));
                      },
                    },
                    {
                      type: "input",
                      title: dict?.awardAmount,
                      chosenValue:
                        contexto?.postInfo?.collectTypes?.[
                          contexto?.collectOptions?.id!
                        ]?.payToCollect?.amount?.value.toString() || "10",
                      showObject:
                        drops.award === dict?.yes ? true : false,
                      setValue: (item: string) => {
                        if (isNaN(Number(item))) return;
                        contexto?.setPostInfo((prev) => {
                          let colls = { ...prev?.collectTypes };
                          let col = colls?.[contexto?.collectOptions?.id!]
                            ? colls?.[contexto?.collectOptions?.id!]
                            : {
                                payToCollect: {
                                  amount: {
                                    value: "10",
                                    currency: evmAddress(
                                      ACCEPTED_TOKENS[0][1]?.toLowerCase()
                                    ),
                                  },
                                },
                              };

                          col = {
                            ...col,
                            payToCollect: {
                              ...col?.payToCollect,
                              amount: {
                                currency: evmAddress(
                                  ACCEPTED_TOKENS?.find(
                                    (at) =>
                                      at?.[1]?.toLowerCase() ==
                                      contexto?.postInfo?.collectTypes?.[
                                        contexto?.collectOptions?.id!
                                      ]?.payToCollect?.amount?.currency?.toLowerCase()
                                  )?.[1] ?? ACCEPTED_TOKENS[0][1]?.toLowerCase()
                                ),
                                value: item,
                              },
                            },
                          } as SimpleCollect;

                          colls[contexto?.collectOptions?.id!] = col;

                          return {
                            ...prev,
                            collectTypes: colls,
                          };
                        });
                      },
                    },
                    {
                      type: "drop",
                      title: dict?.moneda,
                      dropValues: ACCEPTED_TOKENS?.map((item) => item[0]),
                      chosenValue:
                        ACCEPTED_TOKENS?.find((item) => {
                          if (
                            item[1]?.toLowerCase() ==
                            contexto?.postInfo?.collectTypes?.[
                              contexto?.collectOptions?.id!
                            ]?.payToCollect?.amount?.currency?.toLowerCase()
                          ) {
                            return item;
                          }
                        })?.[0] ?? ACCEPTED_TOKENS?.[0]?.[0],
                      dropOpen: drops.currencyOpen,
                      showObject:
                        drops.award === dict?.yes ? true : false,
                      openDropdown: () =>
                        setDrops((prev) => ({
                          ...prev,
                          currencyOpen: !prev.currencyOpen,
                        })),
                      setValue: (item: string) => {
                        setDrops((prev) => ({
                          ...prev,
                          currencyOpen: false,
                        }));

                        contexto?.setPostInfo((prev) => {
                          let colls = { ...prev?.collectTypes };
                          let col = colls?.[contexto?.collectOptions?.id!]
                            ? colls?.[contexto?.collectOptions?.id!]
                            : {
                                payToCollect: {
                                  amount: {
                                    value: "10",
                                    currency: evmAddress(
                                      ACCEPTED_TOKENS[0][1]?.toLowerCase()
                                    ),
                                  },
                                },
                              };

                          col = {
                            ...col,
                            payToCollect: {
                              ...col?.payToCollect,
                              amount: {
                                ...col?.payToCollect?.amount,
                                currency: evmAddress(
                                  ACCEPTED_TOKENS?.find(
                                    (val) => item == val?.[0]
                                  )?.[1]!
                                ),
                              },
                            },
                          } as SimpleCollect;

                          colls[contexto?.collectOptions?.id!] = col;

                          return {
                            ...prev,
                            collectTypes: colls,
                          };
                        });
                      },
                    },
                    {
                      type: "input",
                      title: dict?.ref,
                      chosenValue: String(
                        contexto?.postInfo?.collectTypes?.[
                          contexto?.collectOptions?.id!
                        ]?.payToCollect?.referralShare || 0
                      ),
                      showObject:
                        drops.award === dict?.yes ? true : false,
                      setValue: (item: string) => {
                        if (isNaN(Number(item))) return;
                        contexto?.setPostInfo((prev) => {
                          let colls = { ...prev?.collectTypes };
                          let col = colls?.[contexto?.collectOptions?.id!]
                            ? colls?.[contexto?.collectOptions?.id!]
                            : {
                                payToCollect: {
                                  amount: {
                                    value: "10",
                                    curency: evmAddress(
                                      ACCEPTED_TOKENS[0][1]?.toLowerCase()
                                    ),
                                  },
                                },
                              };

                          col = {
                            ...col,
                            payToCollect: {
                              ...col?.payToCollect,
                              referralShare: Number(item),
                            },
                          } as SimpleCollect;

                          colls[contexto?.collectOptions?.id!] = col;

                          return {
                            ...prev,
                            collectTypes: colls,
                          };
                        });
                      },
                    },
                    {
                      type: "drop",
                      title: dict?.limit,
                      dropValues: [dict?.yes, "No"],
                      dropOpen: drops.editionOpen,
                      chosenValue: drops.edition,
                      showObject: true,
                      openDropdown: () =>
                        setDrops((prev) => ({
                          ...prev,
                          editionOpen: !prev.editionOpen,
                        })),
                      setValue: (item: string) => {
                        setDrops((prev) => ({
                          ...prev,
                          edition: item,
                        }));

                        contexto?.setPostInfo((prev) => {
                          let colls = { ...prev?.collectTypes };
                          let col = colls?.[contexto?.collectOptions?.id!]
                            ? colls?.[contexto?.collectOptions?.id!]
                            : {};

                          col =
                            item == "No"
                              ? ({
                                  ...col,
                                  collectLimit: null,
                                } as SimpleCollect)
                              : ({
                                  ...col,
                                } as SimpleCollect);

                          colls[contexto?.collectOptions?.id!] = col;

                          return {
                            ...prev,
                            collectTypes: colls,
                          };
                        });

                        setDrops((prev) => ({
                          ...prev,
                          editionOpen: false,
                        }));
                      },
                    },
                    {
                      type: "input",
                      title: dict?.edition,
                      chosenValue: String(
                        contexto?.postInfo?.collectTypes?.[
                          contexto?.collectOptions?.id!
                        ]?.collectLimit || "1"
                      ),
                      showObject:
                        drops?.edition === dict?.yes ? true : false,
                      setValue: (item: string) => {
                        if (isNaN(Number(item))) return;
                        contexto?.setPostInfo((prev) => {
                          let colls = { ...prev?.collectTypes };
                          let col = colls?.[contexto?.collectOptions?.id!]
                            ? colls?.[contexto?.collectOptions?.id!]
                            : {};

                          col =
                            drops?.edition == "No"
                              ? ({
                                  ...col,
                                  collectLimit: null,
                                } as SimpleCollect)
                              : ({
                                  ...col,
                                  collectLimit: Number(item),
                                } as SimpleCollect);

                          colls[contexto?.collectOptions?.id!] = col;

                          return {
                            ...prev,
                            collectTypes: colls,
                          };
                        });
                      },
                    },
                    {
                      type: "drop",
                      title: dict?.time,
                      dropValues: [dict?.yes, "No"],
                      dropOpen: drops.timeOpen,
                      chosenValue: drops.time,
                      showObject: true,
                      openDropdown: () =>
                        setDrops((prev) => ({
                          ...prev,
                          timeOpen: !prev.timeOpen,
                        })),
                      setValue: (item: string) => {
                        setDrops((prev) => ({
                          ...prev,
                          time: item,
                        }));

                        contexto?.setPostInfo((prev) => {
                          let colls = { ...prev?.collectTypes };
                          let col = colls?.[contexto?.collectOptions?.id!]
                            ? colls?.[contexto?.collectOptions?.id!]
                            : {};

                          if (item === dict?.yes) {
                            col = {
                              ...col,

                              endsAt: new Date(
                                new Date().getTime() + 24 * 60 * 60 * 1000
                              ) as any,
                            } as SimpleCollect;
                          } else {
                            col = {
                              ...col,
                              endsAt: null,
                            } as SimpleCollect;
                          }

                          colls[contexto?.collectOptions?.id!] = col;

                          return {
                            ...prev,
                            collectTypes: colls,
                          };
                        });

                        setDrops((prev) => ({
                          ...prev,
                          timeOpen: false,
                        }));
                      },
                    },
                  ].map(
                    (
                      item: {
                        type: string;
                        title: string;
                        showObject: boolean;
                        dropOpen?: boolean;
                        chosenValue: string;
                        dropValues?: string[];
                        openDropdown?: () => void;
                        setValue: (item: string) => void;
                      },
                      indexTwo: number
                    ) => {
                      return (
                        item.showObject &&
                        (item.type === "drop" ? (
                          <div
                            className="relative flex items-center justify-center flex-col w-full sm:w-60 h-fit pb-1.5 gap-2"
                            key={indexTwo}
                          >
                            <div className="relative w-full h-fit flex items-start justify-start text-white text-xs">
                              {item?.title}
                            </div>
                            <div
                              className="relative w-full h-12 p-px rounded-sm flex flex-row items-center justify-center text-center"
                              id="borderSearch"
                            >
                              <div className="relative bg-black flex flex-row w-full h-full justify-start items-center rounded-sm p-2 gap-2">
                                <div
                                  className={`relative flex items-center justify-center cursor-pointer w-4 h-3 ${
                                    item.dropOpen && "-rotate-90"
                                  }`}
                                  onClick={() => item.openDropdown!()}
                                >
                                  <div className="relative w-fit h-fit text-xl">
                                    #
                                  </div>
                                </div>
                                <div
                                  className="relative w-full h-full p-1.5 bg-black flex items-center justify-center"
                                  id="searchBar"
                                >
                                  {item.chosenValue}
                                </div>
                              </div>
                            </div>
                            {item.dropOpen && (
                              <div
                                className="absolute flex items-start justify-center w-full h-fit max-height-[7rem] overflow-y-scroll z-50 bg-black top-20 p-px border border-azul rounded-sm"
                                id="dropDown"
                              >
                                <div className="relative flex flex-col items-center justify-start w-full h-fit gap-px">
                                  {item.dropValues?.map(
                                    (valor: string, indiceTres: number) => {
                                      return (
                                        <div
                                          key={indiceTres}
                                          className="relative w-full h-8 py-px bg-black items-center justify-center flex text-amarillotext-xs uppercase hover:bg-oscuro hover:text-white cursor-pointer"
                                          onClick={() => {
                                            item.setValue(
                                              indexTwo === 4
                                                ? ACCEPTED_TOKENS[indiceTres][0]
                                                : valor
                                            );
                                            item.openDropdown!();
                                          }}
                                        >
                                          {valor}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className="relative flex items-center justify-center flex-col w-full sm:w-60 h-fit pb-1.5 gap-2"
                            key={indexTwo}
                          >
                            <div className="relative w-full h-fit flex items-start justify-start text-white text-xs">
                              {item?.title}
                            </div>
                            <div
                              className="relative w-full h-12 p-px rounded-sm flex flex-row items-center justify-center text-center"
                              id="borderSearch"
                            >
                              <div
                                className={`relative flex items-center justify-center cursor-pointer w-4 h-3`}
                              >
                                <div className="relative w-fit h-fit text-xl">
                                  #
                                </div>
                              </div>
                              <input
                                className="relative bg-black flex flex-row w-full h-full justify-start items-center rounded-sm p-2 gap-2"
                                onChange={(e) => item.setValue(e.target.value)}
                                value={item.chosenValue || ""}
                              />
                            </div>
                          </div>
                        ))
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectOptions;
