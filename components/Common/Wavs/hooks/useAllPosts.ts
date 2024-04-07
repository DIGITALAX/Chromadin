import {
  LimitType,
  Mirror,
  Post,
  Profile,
  PublicationType,
  Quote,
  Comment,
  PublicationStats,
} from "@/components/Home/types/generated";
import { LENS_CREATORS } from "@/lib/constants";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { getPublications } from "@/graphql/lens/queries/getVideos";
import { NextRouter } from "next/router";
import { Viewer } from "../../Interactions/types/interactions.types";
import { getOneProfile } from "@/graphql/lens/queries/getProfile";
import { getCollectionsProfile } from "@/graphql/subgraph/queries/getAllCollections";
import { Collection } from "@/components/Home/types/home.types";
import getCommentHTML from "@/lib/helpers/commentHTML";
import getCaretPos from "@/lib/helpers/getCaretPos";
import { searchProfile } from "@/graphql/lens/queries/search";
import { getPublication } from "@/graphql/lens/queries/getPublication";
import likeSig from "@/lib/helpers/likeSig";
import { AnyAction, Dispatch } from "redux";
import mirrorSig from "@/lib/helpers/mirrorSig";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import collectSig from "@/lib/helpers/collectSig";
import {
  PostCollectGifState,
  setPostCollectGif,
} from "@/redux/reducers/postCollectGifSlice";
import uploadPostContent from "@/lib/helpers/uploadPostContent";
import commentSig from "@/lib/helpers/commentSig";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { TFunction } from "i18next";

const useAllPosts = (
  router: NextRouter,
  lensProfile: Profile | undefined,
  viewer: Viewer,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}` | undefined,
  publicClient: PublicClient,
  postCollectGif: PostCollectGifState,
  t: TFunction<"common", undefined>,
  profileId?: string
) => {
  const textElementPost = useRef<HTMLTextAreaElement>(null);
  const preElementPost = useRef<HTMLPreElement>(null);
  const [postsLoading, setPostsLoading] = useState<boolean>(false);
  const [allPosts, setAllPosts] = useState<(Post | Mirror | Quote)[]>([]);
  const [openComment, setOpenComment] = useState<number | undefined>(undefined);
  const [openMainMirrorChoice, setMainOpenMirrorChoice] = useState<boolean[]>([
    false,
  ]);
  const [openPostMirrorChoice, setPostOpenMirrorChoice] = useState<boolean[]>(
    []
  );
  const [postProfilesOpen, setPostProfilesOpen] = useState<boolean>(false);
  const [mentionProfilesPost, setMentionProfilesPost] = useState<Profile[]>([]);
  const [profileCollections, setProfileCollections] = useState<Collection[]>(
    []
  );
  const [postInfo, setPostInfo] = useState<{
    hasMore: boolean;
    paginated: string | undefined;
  }>({
    hasMore: true,
    paginated: undefined,
  });
  const [postCommentInfo, setPostCommentInfo] = useState<{
    hasMore: boolean;
    paginated: string | undefined;
  }>({
    hasMore: true,
    paginated: undefined,
  });
  const [mainPost, setMainPost] = useState<
    Post | Mirror | Comment | undefined | Quote
  >(undefined);
  const [mainPostLoading, setMainPostLoading] = useState<boolean>(false);
  const [dispatchProfile, setDispatchProfile] = useState<Profile | undefined>();
  const [postCommentsLoading, setPostCommentsLoading] =
    useState<boolean>(false);
  const [mainPostComments, setMainPostComments] = useState<Comment[]>([]);
  const [mainInteractionsLoading, setMainInteractionsLoading] = useState<{
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
  const [postInteractionsLoading, setPostInteractionsLoading] = useState<
    {
      mirror: boolean;
      collect: boolean;
      like: boolean;
      comment: boolean;
    }[]
  >([]);
  const [mainMediaLoading, setMainMediaLoading] = useState<
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
  const [postMediaLoading, setPostMediaLoading] = useState<
    {
      image: boolean;
      video: boolean;
    }[]
  >([]);
  const [postCaretCoord, setPostCaretCoord] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [commentDetails, setCommentDetails] = useState<{
    description: string;
    html: string;
  }>({
    description: "",
    html: "",
  });

  const likePost = async (
    id: string,
    hasReacted: boolean,
    index: number,
    main?: boolean
  ): Promise<void> => {
    if (!main) {
      setPostInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index!] = {
          ...arr[index!],
          like: true,
        };

        return arr;
      });
    } else {
      setMainInteractionsLoading((prev) => ({
        ...prev,
        like: true,
      }));
    }

    try {
      await likeSig(id, dispatch, hasReacted, t);

      updateInteractions(
        index,
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
      setPostInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index!] = {
          ...arr[index!],
          like: false,
        };

        return arr;
      });
    } else {
      setMainInteractionsLoading((prev) => ({
        ...prev,
        like: false,
      }));
    }
  };

  const mirrorPost = async (
    id: string,
    index: number,
    main?: boolean
  ): Promise<void> => {
    if (!main) {
      setPostInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index!] = {
          ...arr[index!],
          mirror: true,
        };

        return arr;
      });
    } else {
      setMainInteractionsLoading((prev) => ({
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
        index,
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
      setPostInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index!] = {
          ...arr[index!],
          mirror: false,
        };

        return arr;
      });
    } else {
      setMainInteractionsLoading((prev) => ({
        ...prev,
        mirror: false,
      }));
    }
  };

  const collectPost = async (
    id: string,
    type: string,
    index: number,
    main?: boolean
  ): Promise<void> => {
    if (!main) {
      setPostInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index!] = {
          ...arr[index!],
          collect: true,
        };

        return arr;
      });
    } else {
      setMainInteractionsLoading((prev) => ({
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
        publicClient
      );

      updateInteractions(
        index,
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
      setPostInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index!] = {
          ...arr[index!],
          collect: false,
        };

        return arr;
      });
    } else {
      setMainInteractionsLoading((prev) => ({
        ...prev,
        collect: false,
      }));
    }
  };

  const getTimeline = async () => {
    setPostsLoading(true);
    try {
      setMainPost(undefined);
      setMainPostComments([]);
      let profile: Profile | undefined;
      if (router.asPath?.includes("&profile=")) {
        profile = await getProfile();
      }

      const data = await getPublications(
        {
          where: {
            from:
              !router?.asPath?.includes("&profile=") &&
              !router?.asPath?.includes("/autograph/")
                ? LENS_CREATORS
                : router.asPath?.includes("/autograph/")
                ? [profileId]
                : [profile?.id],
            publicationTypes: [
              PublicationType.Post,
              PublicationType.Mirror,
              PublicationType.Quote,
            ],
          },
          limit: LimitType.Ten,
        },
        lensProfile?.id
      );

      if (!data || !data?.data || !data?.data?.publications.items) {
        setPostsLoading(false);
        return;
      }

      const sortedArr = data?.data?.publications.items as Post[];

      setPostInfo({
        hasMore: sortedArr?.length < 10 ? false : true,
        paginated: data?.data?.publications?.pageInfo?.next,
      });
      setAllPosts(sortedArr);
    } catch (err: any) {
      console.error(err.message);
    }
    setPostsLoading(false);
  };

  const fetchMore = async () => {
    try {
      if (!postInfo?.hasMore) return;

      const data = await getPublications(
        {
          where: {
            from:
              !router?.asPath?.includes("&profile=") &&
              !router?.asPath?.includes("/autograph/")
                ? LENS_CREATORS
                : router.asPath?.includes("/autograph/")
                ? [profileId]
                : [dispatchProfile?.id],

            publicationTypes: [
              PublicationType.Post,
              PublicationType.Mirror,
              PublicationType.Quote,
            ],
          },
          limit: LimitType.Ten,
          cursor: postInfo?.paginated,
        },
        lensProfile?.id
      );

      const arr: (Post | Quote | Mirror)[] = [
        ...(data?.data?.publications?.items || []),
      ] as (Post | Quote | Mirror)[];
      let sortedArr = arr.sort(
        (a: Post | Quote | Mirror, b: Post | Quote | Mirror) =>
          Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      setAllPosts([...allPosts, ...sortedArr]);
      setPostInfo({
        hasMore: sortedArr?.length < 10 ? false : true,
        paginated: data?.data?.publications?.pageInfo?.next,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMainPost = async (): Promise<void> => {
    setAllPosts([]);
    setMainPostLoading(true);

    try {
      const main = await getPublication(
        {
          forId: router?.asPath?.split("&post=")?.[1],
        },
        lensProfile?.id
      );

      setMainPost(main?.data?.publication as Post);
    } catch (err: any) {
      console.error(err.message);
    }
    setMainPostLoading(false);
  };

  const getComments = async (): Promise<void> => {
    setPostCommentsLoading(true);
    try {
      const comments = await getPublications(
        {
          where: {
            commentOn: {
              id: router?.asPath?.split("&post=")?.[1],
            },
          },
          limit: LimitType.TwentyFive,
        },
        lensProfile?.id
      );
      setMainPostComments(
        (comments?.data?.publications?.items || []) as Comment[]
      );
      setPostCommentInfo({
        hasMore:
          !comments?.data?.publications?.items ||
          comments?.data?.publications?.items?.length < 25
            ? false
            : true,
        paginated: comments?.data?.publications?.pageInfo?.next,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setPostCommentsLoading(false);
  };

  const fetchMorePostComments = async (): Promise<void> => {
    if (!postCommentInfo?.hasMore) return;
    try {
      const comments = await getPublications(
        {
          where: {
            commentOn: {
              id: router?.asPath?.split("&post=")?.[1],
            },
          },
          limit: LimitType.TwentyFive,
        },
        lensProfile?.id
      );
      setMainPostComments([
        ...mainPostComments,
        ...((comments?.data?.publications?.items || []) as Comment[]),
      ]);
      setPostCommentInfo({
        hasMore:
          !comments?.data?.publications?.items ||
          comments?.data?.publications?.items?.length < 25
            ? false
            : true,
        paginated: comments?.data?.publications?.pageInfo?.next,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getProfile = async (): Promise<Profile | undefined> => {
    try {
      const { data } = await getOneProfile(
        {
          forHandle: "lens/" + router?.asPath?.split("&profile=")?.[1],
        },
        lensProfile?.id
      );

      setDispatchProfile(data?.profile as Profile);

      if (LENS_CREATORS?.includes(data?.profile?.id)) {
        const collections = await getCollectionsProfile(
          data?.profile?.ownedBy?.address
        );

        const colls = await Promise.all(
          collections?.data?.collectionCreateds?.map(
            async (item: {
              collectionMetadata: {};
              dropMetadata: {};
              dropURI: string;
              uri: string;
            }) => {
              if (!item?.collectionMetadata) {
                const data = await fetchIPFSJSON(item?.uri);
                item = {
                  ...item,
                  collectionMetadata: {
                    ...data,
                    mediaTypes: data?.mediaTypes?.[0],
                  },
                };
              }

              if (!item?.dropMetadata) {
                const data = await fetchIPFSJSON(item?.dropURI);
                item = {
                  ...item,
                  dropMetadata: {
                    ...data,
                  },
                };
              }

              return item;
            }
          )
        );

        setProfileCollections(colls);
      }

      return data?.profile as Profile;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleKeyDownDeletePost = (e: KeyboardEvent<Element>) => {
    const highlightedContent = document.querySelector("#highlighted-content2")!;
    const selection = window.getSelection();
    if (e.key === "Backspace" && selection?.toString() !== "") {
      const start = textElementPost.current!.selectionStart;
      const end = textElementPost.current!.selectionEnd;

      if (start === 0 && end === textElementPost.current!.value?.length) {
        setCommentDetails({
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
          commentDetails?.html?.slice(0, start) +
          strippedHtml +
          commentDetails?.html?.slice(end);
        const newDescription =
          commentDetails?.description?.slice(0, start) +
          strippedText +
          commentDetails?.description?.slice(end);

        setCommentDetails({
          description: newDescription,
          html: newHTML,
        });
        (e.currentTarget! as any).value = newDescription;
      }
    } else if (
      e.key === "Backspace" &&
      commentDetails?.description?.length === 0 &&
      commentDetails?.html?.length === 0
    ) {
      (e.currentTarget! as any).value = "";

      e.preventDefault();
    }
  };

  const commentPost = async (
    id: string,
    index: number,
    main?: boolean
  ): Promise<void> => {
    if (
      (!commentDetails?.description ||
        commentDetails?.description === "" ||
        commentDetails?.description?.trim()?.length < 0) &&
      (!postCollectGif?.media?.[id]?.length ||
        postCollectGif?.media?.[id]?.length < 1)
    ) {
      return;
    }
    if (!main) {
      setPostInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index!] = {
          ...arr[index!],
          comment: true,
        };

        return arr;
      });
    } else {
      setMainInteractionsLoading((prev) => ({
        ...prev,
        comment: true,
      }));
    }
    try {
      const contentURIValue = await uploadPostContent(
        commentDetails?.description,
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
        () => clearComment(main!, id, index)
      );
    } catch (err: any) {
      console.error(err.message);
    }

    if (!main) {
      setPostInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index!] = {
          ...arr[index!],
          comment: false,
        };

        return arr;
      });
    } else {
      setMainInteractionsLoading((prev) => ({
        ...prev,
        comment: false,
      }));
    }
  };

  const clearComment = (main: boolean, id: string, index: number) => {
    if (!main) {
      setPostInteractionsLoading((prev) => {
        const arr = [...prev];
        arr[index!] = {
          ...arr[index!],
          comment: false,
        };

        return arr;
      });
    } else {
      setMainInteractionsLoading((prev) => ({
        ...prev,
        comment: false,
      }));
    }
    setCommentDetails({
      description: "",
      html: "",
    });
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: t("index"),
      })
    );
    setOpenComment(undefined);
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

    updateInteractions(index, {}, "comments", true, main!);

    router?.asPath?.includes("&post=") && getComments();
  };

  const handlePostCommentDescription = async (e: any): Promise<void> => {
    let resultElement = document.querySelector("#highlighted-content2");
    const newValue = e.target.value.endsWith("\n")
      ? e.target.value + " "
      : e.target.value;

    setCommentDetails({
      description: newValue,
      html: getCommentHTML(e, resultElement as Element),
    });

    if (
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1][0] ===
        "@" &&
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1]
        ?.length === 1
    ) {
      setPostCaretCoord(getCaretPos(e, textElementPost));
      setPostProfilesOpen(true);
    }
    if (
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1][0] ===
      "@"
    ) {
      const allProfiles = await searchProfile({
        query: e.target.value.split(" ")[e.target.value.split(" ")?.length - 1],
        limit: LimitType.Ten,
      });
      setMentionProfilesPost(
        allProfiles?.data?.searchProfiles?.items as Profile[]
      );
    } else {
      setPostProfilesOpen(false);
      setMentionProfilesPost([]);
    }
  };

  const handleMentionClickPost = (user: Profile) => {
    setPostProfilesOpen(false);
    const newHTMLPost =
      commentDetails?.html?.substring(
        0,
        commentDetails?.html.lastIndexOf("@")
      ) + `@${user?.handle?.localName}</span>`;
    const newElementPost =
      commentDetails?.description?.substring(
        0,
        commentDetails?.description.lastIndexOf("@")
      ) + `@${user?.handle?.localName}`;
    setCommentDetails({
      description: newElementPost,
      html: newHTMLPost,
    });
  };

  const updateInteractions = (
    index: number,
    valueToUpdate: Object,
    statToUpdate: string,
    increase: boolean,
    main: boolean
  ) => {
    const newItems = [
      ...(main
        ? [mainPost]
        : router.asPath?.includes("&post=")
        ? mainPostComments
        : allPosts),
    ];

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
      ? setMainPost(newItems[index])
      : router.asPath?.includes("&post=")
      ? setMainPostComments(newItems as any)
      : setAllPosts(newItems as any);
  };

  useEffect(() => {
    if (
      viewer == Viewer.Chat ||
      (router.asPath?.includes("/autograph/") && profileId)
    ) {
      if (
        !router?.asPath?.includes("&post=") ||
        (router.asPath?.includes("/autograph/") && profileId)
      ) {
        getTimeline();
      } else if (router?.asPath?.includes("&post=")) {
        getMainPost();
        getComments();
      }
    }
  }, [viewer, router.asPath, profileId, lensProfile?.id]);

  useEffect(() => {
    if (allPosts?.length > 0) {
      setPostMediaLoading(
        Array.from({ length: allPosts?.length }, () => ({
          image: false,
          video: false,
        }))
      );
      setPostOpenMirrorChoice(
        Array.from({ length: allPosts?.length }, () => false)
      );
      setPostInteractionsLoading(
        Array.from({ length: allPosts?.length }, () => ({
          collect: false,
          like: false,
          comment: false,
          mirror: false,
        }))
      );
    }
  }, [allPosts]);

  useEffect(() => {
    if (mainPostComments?.length > 0) {
      setPostMediaLoading(
        Array.from({ length: mainPostComments?.length }, () => ({
          image: false,
          video: false,
        }))
      );
      setPostOpenMirrorChoice(
        Array.from({ length: mainPostComments?.length }, () => false)
      );
      setPostInteractionsLoading(
        Array.from({ length: mainPostComments?.length }, () => ({
          collect: false,
          like: false,
          comment: false,
          mirror: false,
        }))
      );
    }
  }, [mainPostComments]);

  useEffect(() => {
    if (document.querySelector("#highlighted-content2")) {
      document.querySelector("#highlighted-content2")!.innerHTML =
        commentDetails?.html?.length === 0 ? "" : commentDetails?.html;
    }
  }, [commentDetails?.html]);

  return {
    postsLoading,
    fetchMore,
    postInfo,
    allPosts,
    postCommentsLoading,
    mainPost,
    mainPostLoading,
    postCommentInfo,
    mainInteractionsLoading,
    postMediaLoading,
    setPostMediaLoading,
    mainMediaLoading,
    setMainMediaLoading,
    postInteractionsLoading,
    commentDetails,
    dispatchProfile,
    profileCollections,
    textElementPost,
    preElementPost,
    openMainMirrorChoice,
    setMainOpenMirrorChoice,
    postProfilesOpen,
    mentionProfilesPost,
    openPostMirrorChoice,
    setPostOpenMirrorChoice,
    postCaretCoord,
    handleKeyDownDeletePost,
    handlePostCommentDescription,
    handleMentionClickPost,
    openComment,
    setOpenComment,
    fetchMorePostComments,
    mainPostComments,
    mirrorPost,
    likePost,
    collectPost,
    commentPost,
  };
};

export default useAllPosts;
