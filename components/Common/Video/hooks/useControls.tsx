import {
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { createWalletClient, custom, PublicClient } from "viem";
import { polygon } from "viem/chains";
import mirrorSig from "@/lib/helpers/mirrorSig";
import { AnyAction, Dispatch } from "redux";
import likeSig from "@/lib/helpers/likeSig";
import {
  Comment,
  LimitType,
  Mirror,
  Post,
  Profile,
  PublicationStats,
  Quote,
} from "@/components/Home/types/generated";
import {
  ChannelsState,
  setChannelsRedux,
} from "@/redux/reducers/channelsSlice";
import collectSig from "@/lib/helpers/collectSig";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import getCommentHTML from "@/lib/helpers/commentHTML";
import { searchProfile } from "@/graphql/lens/queries/search";
import uploadPostContent from "@/lib/helpers/uploadPostContent";
import commentSig from "@/lib/helpers/commentSig";
import getCaretPos from "@/lib/helpers/getCaretPos";
import {
  PostCollectGifState,
  setPostCollectGif,
} from "@/redux/reducers/postCollectGifSlice";
import { VideoControls } from "../types/controls.types";
import { TFunction } from "i18next";
import { NextRouter } from "next/router";

const useControls = (
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}` | undefined,
  publicClient: PublicClient,
  allVideos: ChannelsState,
  postCollectGif: PostCollectGifState,
  t: TFunction<"common", undefined>,
  router: NextRouter,
  currentFeed?: (Post | Mirror | Quote | Comment)[],
  setCurrentFeed?:
    | ((e: SetStateAction<(Post | Mirror | Quote)[]>) => void)
    | ((e: SetStateAction<Comment[]>) => void),
  getComments?: () => Promise<void>,
  setSecondaryComment?: (e: string) => void
) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fullVideoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textElement = useRef<HTMLTextAreaElement>(null);
  const preElement = useRef<HTMLPreElement>(null);
  const [videoControlsInfo, setVideoControlsInfo] = useState<VideoControls>({
    duration: 0,
    currentTime: 0,
    heart: false,
    isPlaying: false,
    videosLoading: false,
    currentIndex: 0,
  });
  const [volume, setVolume] = useState<number>(1);
  const [profilesOpen, setProfilesOpen] = useState<boolean>(false);
  const [mentionProfiles, setMentionProfiles] = useState<Profile[]>([]);
  const [volumeOpen, setVolumeOpen] = useState<boolean>(false);
  const [interactionsLoading, setInteractionsLoading] = useState<
    {
      mirror: boolean;
      collect: boolean;
      like: boolean;
      comment: boolean;
    }[]
  >([]);
  const [controlInteractionsLoading, setControlInteractionsLoading] = useState<{
    mirror: boolean;
    collect: boolean;
    like: boolean;
    comment: boolean;
  }>({
    mirror: false,
    collect: false,
    like: false,
    comment: false,
  });
  const [controlCaretCoord, setControlCaretCoord] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [controlMediaLoading, setControlMediaLoading] = useState<
    {
      image: boolean;
      video: boolean;
    }[]
  >([
    {
      image: false,
      video: false,
    },
  ]);
  const [controlCommentDetails, setControlCommentDetails] = useState<{
    description: string;
    html: string;
  }>({
    description: "",
    html: "",
  });

  const handleHeart = () => {
    setVideoControlsInfo((prev) => ({
      ...prev,
      heart: true,
    }));

    setTimeout(() => {
      setVideoControlsInfo((prev) => ({
        ...prev,
        heart: false,
      }));
    }, 3000);
  };

  const handleVolumeChange = (e: FormEvent) => {
    setVolume(parseFloat((e.target as HTMLFormElement).value));
  };

  const like = async (
    id: string,
    hasReacted: boolean,
    index: number,
    main?: boolean
  ): Promise<void> => {
    if (!main) {
      setInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index!] = {
          ...arr[index!],
          like: true,
        };

        return arr;
      });
    } else {
      setControlInteractionsLoading((prev) => ({
        ...prev,
        like: true,
      }));
    }

    try {
      await likeSig(id, dispatch, hasReacted, t);

      updateInteractions(
        main
          ? allVideos?.channels?.findIndex((item) => item?.id == id)
          : currentFeed!?.findIndex(
              (item) =>
                (item?.__typename === "Mirror" ? item?.mirrorOn : item)?.id ==
                id
            ),
        {
          hasReacted: hasReacted ? false : true,
        },
        "reactions",
        hasReacted ? false : true,
        main!
      );
    } catch (err: any) {
      console.error(err.message);
    }

    if (!main) {
      setInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index!] = {
          ...arr[index!],
          like: false,
        };

        return arr;
      });
    } else {
      setControlInteractionsLoading((prev) => ({
        ...prev,
        like: false,
      }));
    }
  };

  const mirror = async (
    id: string,
    index: number,
    main?: boolean
  ): Promise<void> => {
    if (!main) {
      setInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index!] = {
          ...arr[index!],
          mirror: true,
        };

        return arr;
      });
    } else {
      setControlInteractionsLoading((prev) => ({
        ...prev,
        mirror: true,
      }));
    }

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await mirrorSig(
        id,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient,
        t
      );

      updateInteractions(
        main
          ? allVideos?.channels?.findIndex((item) => item?.id == id)
          : currentFeed!?.findIndex(
              (item) =>
                (item?.__typename === "Mirror" ? item?.mirrorOn : item)?.id ==
                id
            ),
        {
          hasMirrored: true,
        },
        "mirrors",
        true,
        main!
      );
    } catch (err: any) {
      console.error(err.message);
    }

    if (!main) {
      setInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index!] = {
          ...arr[index!],
          mirror: false,
        };

        return arr;
      });
    } else {
      setControlInteractionsLoading((prev) => ({
        ...prev,
        mirror: false,
      }));
    }
  };

  const collect = async (
    id: string,
    type: string,
    index: number,
    main?: boolean
  ): Promise<void> => {
    if (!main) {
      setInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index!] = {
          ...arr[index!],
          collect: true,
        };

        return arr;
      });
    } else {
      setControlInteractionsLoading((prev) => ({
        ...prev,
        collect: true,
      }));
    }

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await collectSig(
        id,
        type,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient,
        t
      );

      updateInteractions(
        main
          ? allVideos?.channels?.findIndex((item) => item?.id == id)
          : currentFeed!?.findIndex(
              (item) =>
                (item?.__typename === "Mirror" ? item?.mirrorOn : item)?.id ==
                id
            ),
        {
          hasActed: {
            __typename: "OptimisticStatusResult",
            isFinalisedOnchain: true,
            value: true,
          },
        },
        "countOpenActions",
        true,
        main!
      );
    } catch (err: any) {
      console.error(err.message);
    }

    if (!main) {
      setInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index!] = {
          ...arr[index!],
          collect: false,
        };

        return arr;
      });
    } else {
      setControlInteractionsLoading((prev) => ({
        ...prev,
        collect: false,
      }));
    }
  };

  const handleSeek = (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => {
    const progressRect = e.currentTarget.getBoundingClientRect();
    const seekPosition = (e.clientX - progressRect.left) / progressRect.width;

    setVideoControlsInfo((prev) => ({
      ...prev,
      currentTime: seekPosition * prev.duration,
    }));
  };

  const updateInteractions = (
    index: number,
    valueToUpdate: Object,
    statToUpdate: string,
    increase: boolean,
    main: boolean
  ) => {
    const newItems = [...(main ? allVideos?.channels : currentFeed!)];

    newItems[index] =
      newItems[index]?.__typename !== "Mirror"
        ? {
            ...(newItems[index] as Post),
            operations: {
              ...(newItems[index] as Post)?.operations,
              ...valueToUpdate,
            },
            stats: {
              ...(newItems[index] as Post)?.stats,
              [statToUpdate]:
                (newItems[index] as Post)?.stats?.[
                  statToUpdate as keyof PublicationStats
                ] + (increase ? 1 : -1),
            },
          }
        : {
            ...(newItems[index] as Mirror),
            mirrorOn: {
              ...(newItems[index] as Mirror)?.mirrorOn,
              operations: {
                ...(newItems[index] as Mirror)?.mirrorOn?.operations,
                ...valueToUpdate,
              },
              stats: {
                ...(newItems[index] as Mirror)?.mirrorOn?.stats,
                [statToUpdate]:
                  (newItems[index] as Mirror)?.mirrorOn?.stats?.[
                    statToUpdate as keyof PublicationStats
                  ] + (increase ? 1 : -1),
              },
            },
          };

    main
      ? dispatch(
          setChannelsRedux({
            actionChannels: newItems,
            actionMain:
              newItems[index]?.id == allVideos?.main?.id
                ? newItems[index]
                : allVideos?.main,
          })
        )
      : setCurrentFeed!(newItems as any);

    if (main) {
      if (router?.asPath?.includes("&video=")) {
        const videoId = router?.asPath.split("&video=")?.[1]?.split("&")?.[0];

        if (videoId) {
          const updatedPath = router.asPath.replace(
            `&video=${videoId}`,
            `&video=${
              (newItems[index]?.id == allVideos?.main?.id
                ? newItems[index]
                : allVideos?.main
              )?.id
            }`
          );
          router.replace(updatedPath);
        }
      } else {
        const optionRegex =
          /(sampler|chat|stream|collect)\?option=(history|account|fulfillment)/;

        if (!optionRegex.test(router?.asPath)) {
          if (
            router?.asPath === "/es" ||
            router?.asPath === "/en" ||
            router?.asPath === "/"
          ) {
            const updatedPath = `${
              router?.asPath
            }#stream?option=history&video=${
              (newItems[index]?.id == allVideos?.main?.id
                ? newItems[index]
                : allVideos?.main
              )?.id
            }`;

            router.replace(updatedPath);
          }
        } else {
          const updatedPath = router?.asPath.replace(
            optionRegex,
            `$&${`&video=${
              (newItems[index]?.id == allVideos?.main?.id
                ? newItems[index]
                : allVideos?.main
              )?.id
            }`}`
          );
          router.replace(updatedPath);
        }
      }
    }
  };

  const handleKeyDownDelete = (e: KeyboardEvent<Element>) => {
    const highlightedContent = document.querySelector("#highlighted-content")!;
    const selection = window.getSelection();
    if (e.key === "Backspace" && selection?.toString() !== "") {
      const start = textElement.current!.selectionStart;
      const end = textElement.current!.selectionEnd;

      if (start === 0 && end === textElement.current!.value?.length) {
        setControlCommentDetails({
          description: "",
          html: "",
        });
      } else {
        const selectedText = selection!.toString();
        const selectedHtml = highlightedContent.innerHTML.substring(start, end);
        const strippedHtml = selectedHtml?.replace(
          /( style="[^"]*")|( style='[^']*')/g,
          ""
        );
        const strippedText = selectedText?.replace(/<[^>]*>/g, "");

        const newHTML =
          controlCommentDetails?.html?.slice(0, start) +
          strippedHtml +
          controlCommentDetails?.html?.slice(end);
        const newDescription =
          controlCommentDetails?.description?.slice(0, start) +
          strippedText +
          controlCommentDetails?.description?.slice(end);

        setControlCommentDetails({
          description: newDescription,
          html: newHTML,
        });
        (e.currentTarget! as any).value = newDescription;
      }
    } else if (
      e.key === "Backspace" &&
      controlCommentDetails?.description?.length === 0 &&
      controlCommentDetails?.html?.length === 0
    ) {
      (e.currentTarget! as any).value = "";

      e.preventDefault();
    }
  };

  const handleCommentDescription = async (e: any): Promise<void> => {
    let resultElement = document.querySelector("#highlighted-content");
    const newValue = e.target.value.endsWith("\n")
      ? e.target.value + " "
      : e.target.value;

    setControlCommentDetails({
      description: newValue,
      html: getCommentHTML(e, resultElement as Element),
    });

    if (
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1][0] ===
        "@" &&
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1]
        ?.length === 1
    ) {
      setControlCaretCoord(getCaretPos(e, textElement));
      setProfilesOpen(true);
    }
    if (
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1][0] ===
      "@"
    ) {
      const allProfiles = await searchProfile({
        query: e.target.value.split(" ")[e.target.value.split(" ")?.length - 1],
        limit: LimitType.Ten,
      });
      setMentionProfiles(allProfiles?.data?.searchProfiles?.items as Profile[]);
    } else {
      setProfilesOpen(false);
      setMentionProfiles([]);
    }
  };

  const clearComment = (id: string, index: number, main?: boolean) => {
    if (!main) {
      setInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index!] = {
          ...arr[index!],
          comment: false,
        };

        return arr;
      });
    } else {
      setControlInteractionsLoading((prev) => ({
        ...prev,
        comment: false,
      }));
    }

    setControlCommentDetails({
      description: "",
      html: "",
    });
    setSecondaryComment!("");
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: t("index"),
      })
    );
    const newMedia = { ...postCollectGif?.media };
    delete newMedia?.[id];
    const newTypes = { ...postCollectGif?.collectTypes };
    delete newTypes?.[id];
    dispatch(
      setPostCollectGif({
        actionCollectTypes: newTypes,
        actionMedia: newMedia,
      })
    );

    updateInteractions(
      main
        ? allVideos?.channels?.findIndex((item) => item?.id == id)
        : currentFeed!?.findIndex(
            (item) =>
              (item?.__typename === "Mirror" ? item?.mirrorOn : item)?.id == id
          ),
      {},
      "comments",
      true,
      main!
    );

    getComments!();
  };

  const comment = async (
    id: string,
    index: number,
    main?: boolean
  ): Promise<void> => {
    if (
      (!controlCommentDetails?.description ||
        controlCommentDetails?.description === "" ||
        controlCommentDetails?.description?.trim()?.length < 0) &&
      (!postCollectGif?.media?.[id]?.length ||
        postCollectGif?.media?.[id]?.length < 1)
    ) {
      return;
    }
    setControlInteractionsLoading((prev) => ({
      ...prev,
      comment: true,
    }));

    try {
      const contentURIValue = await uploadPostContent(
        controlCommentDetails?.description,
        postCollectGif?.media?.[id]!
      );

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await commentSig(
        id,
        contentURIValue as string,
        [
          {
            collectOpenAction: {
              simpleCollectOpenAction: postCollectGif?.collectTypes?.[id],
            },
          },
        ],
        clientWallet,
        publicClient,
        address as `0x${string}`,
        dispatch,
        () => clearComment(id, index, main!),
        t
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setControlInteractionsLoading((prev) => ({
      ...prev,
      comment: false,
    }));
  };

  const handleMentionClick = (user: Profile) => {
    setProfilesOpen(false);
    const newHTMLPost =
      controlCommentDetails?.html?.substring(
        0,
        controlCommentDetails?.html.lastIndexOf("@")
      ) + `@${user?.handle?.localName}</span>`;
    const newElementPost =
      controlCommentDetails?.description?.substring(
        0,
        controlCommentDetails?.description.lastIndexOf("@")
      ) + `@${user?.handle?.localName}`;
    setControlCommentDetails({
      description: newElementPost,
      html: newHTMLPost,
    });
  };

  useEffect(() => {
    if (document.querySelector("#highlighted-content")) {
      document.querySelector("#highlighted-content")!.innerHTML =
        controlCommentDetails?.html?.length === 0
          ? t("say")
          : controlCommentDetails?.html;
    }
  }, [controlCommentDetails?.html]);

  useEffect(() => {
    if (currentFeed && currentFeed!?.length > 0) {
      setInteractionsLoading(
        Array.from({ length: currentFeed!?.length }, () => ({
          comment: false,
          like: false,
          collect: false,
          mirror: false,
        }))
      );
    }
  }, [currentFeed]);

  return {
    volume,
    volumeOpen,
    setVolumeOpen,
    handleHeart,
    collect,
    mirror,
    like,
    handleVolumeChange,
    wrapperRef,
    progressRef,
    handleSeek,
    fullVideoRef,
    interactionsLoading,
    handleMentionClick,
    comment,
    preElement,
    textElement,
    profilesOpen,
    mentionProfiles,
    handleKeyDownDelete,
    handleCommentDescription,
    controlCaretCoord,
    controlCommentDetails,
    controlInteractionsLoading,
    controlMediaLoading,
    setControlMediaLoading,
    videoControlsInfo,
    setVideoControlsInfo,
  };
};

export default useControls;
