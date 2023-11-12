import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import uploadPostContent from "@/lib/helpers/uploadPostContent";
import {
  getCommentData,
  removeCommentData,
  setCommentData,
} from "@/lib/lens/utils";
import { MediaType, UploadedMedia } from "@/components/Home/types/home.types";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import getCommentHTML from "@/lib/helpers/commentHTML";
import { LimitType, Profile, SimpleCollectOpenActionModuleInput } from "@/components/Home/types/generated";
import getCaretPos from "@/lib/helpers/getCaretPos";
import { searchProfile } from "@/graphql/lens/queries/search";
import { setPostImages } from "@/redux/reducers/postImageSlice";
import { setCollectOpen } from "@/redux/reducers/collectOpenSlice";
import { setImageLoadingRedux } from "@/redux/reducers/imageLoadingSlice";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import commentSig from "@/lib/helpers/commentSig";
import { AnyAction, Dispatch } from "redux";
import { MainVideoState } from "@/redux/reducers/mainVideoSlice";

const useComment = (
  dispatch: Dispatch<AnyAction>,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  mainVideo: MainVideoState,
  collectOpen: boolean,
  commentId: string,
  postImages: UploadedMedia[],
  collectModuleType: SimpleCollectOpenActionModuleInput | undefined,
  uploadImage: (
    e: File[] | FormEvent<Element>,
    pasted?: boolean | undefined,
    feed?: boolean | undefined
  ) => Promise<void>
) => {
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [commentDescription, setCommentDescription] = useState<string>("");
  const [caretCoord, setCaretCoord] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [gifOpen, setGifOpen] = useState<boolean>(false);
  const [profilesOpen, setProfilesOpen] = useState<boolean>(false);
  const textElement = useRef<HTMLTextAreaElement>(null);
  const preElement = useRef<HTMLPreElement>(null);
  const [mentionProfiles, setMentionProfiles] = useState<Profile[]>([]);
  const [results, setResults] = useState<any>([]);
  const [gifs, setGifs] = useState<UploadedMedia[]>(
    JSON.parse(getCommentData() || "{}").images || []
  );
  const [searchGif, setSearchGif] = useState<boolean>(false);
  const [commentHTML, setCommentHTML] = useState<string>("");
  const [contentURI, setContentURI] = useState<string>();

  const handleGif = (e: FormEvent): void => {
    setSearchGif((e.target as HTMLFormElement).value);
  };

  const handleGifSubmit = async (): Promise<void> => {
    const getGifs = await fetch("/api/giphy", {
      method: "POST",
      body: JSON.stringify(searchGif),
    });
    const allGifs = await getGifs.json();
    setResults(allGifs?.json?.results);
  };

  const handleSetGif = (result: any): void => {
    if ((postImages as any)?.length < 4) {
      setGifs([
        ...(postImages as any),
        {
          cid: result,
          type: MediaType.Gif,
        },
      ]);
      const postStorage = JSON.parse(getCommentData() || "{}");
      setCommentData(
        JSON.stringify({
          ...postStorage,
          images: [
            ...(postImages as any),
            {
              cid: result,
              type: MediaType.Gif,
            },
          ],
        })
      );
    }
  };

  const handleKeyDownDelete = (e: KeyboardEvent<Element>) => {
    const highlightedContent = document.querySelector("#highlighted-content")!;
    const selection = window.getSelection();
    const postStorage = JSON.parse(getCommentData() || "{}");
    if (e.key === "Backspace" && selection?.toString() !== "") {
      const start = textElement.current!.selectionStart;
      const end = textElement.current!.selectionEnd;

      if (start === 0 && end === textElement.current!.value?.length) {
        setCommentDescription("");
        setCommentHTML("");
        // highlightedContent.innerHTML = "";
        setCommentData(
          JSON.stringify({
            ...postStorage,
            post: "",
          })
        );
      } else {
        const selectedText = selection!.toString();
        const selectedHtml = highlightedContent.innerHTML.substring(start, end);
        const strippedHtml = selectedHtml?.replace(
          /( style="[^"]*")|( style='[^']*')/g,
          ""
        );
        const strippedText = selectedText?.replace(/<[^>]*>/g, "");

        const newHTML =
          commentHTML.slice(0, start) + strippedHtml + commentHTML.slice(end);
        const newDescription =
          commentDescription.slice(0, start) +
          strippedText +
          commentDescription.slice(end);

        setCommentHTML(newHTML);
        setCommentDescription(newDescription);
        (e.currentTarget! as any).value = newDescription;
        // highlightedContent.innerHTML = newHTML;
        setCommentData(
          JSON.stringify({
            ...postStorage,
            post: newDescription,
          })
        );
      }
    } else if (
      e.key === "Backspace" &&
      commentDescription?.length === 0 &&
      commentHTML?.length === 0
    ) {
      (e.currentTarget! as any).value = "";
      // highlightedContent.innerHTML = "";
      setCommentData(
        JSON.stringify({
          ...postStorage,
          post: "",
        })
      );
      e.preventDefault();
    }
  };

  const handleCommentDescription = async (e: any): Promise<void> => {
    let resultElement = document.querySelector("#highlighted-content");
    const newValue = e.target.value.endsWith("\n")
      ? e.target.value + " "
      : e.target.value;
    setCommentHTML(getCommentHTML(e, resultElement as Element));
    setCommentDescription(newValue);
    const postStorage = JSON.parse(getCommentData() || "{}");
    setCommentData(
      JSON.stringify({
        ...postStorage,
        post: e.target.value,
      })
    );
    if (
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1][0] ===
        "@" &&
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1]
        ?.length === 1
    ) {
      setCaretCoord(getCaretPos(e, textElement));
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

  const clearComment = () => {
    setCommentLoading(false);
    setCommentDescription("");
    setCommentHTML("");
    setGifs([]);
    dispatch(setPostImages([]));
    dispatch(setCollectOpen(false));
    setGifOpen(false);
    // (document as any).querySelector("#highlighted-content").innerHTML = "";
    removeCommentData();
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Indexing Interaction",
      })
    );
  };

  const commentVideo = async (): Promise<void> => {
    if (
      (!commentDescription ||
        commentDescription === "" ||
        commentDescription.trim()?.length < 0) &&
      (!postImages?.length || postImages?.length < 1)
    ) {
      return;
    }
    setCommentLoading(true);
    try {
      const contentURIValue = await uploadPostContent(
        postImages,
        commentDescription,
        setContentURI,
        contentURI,
        dispatch
      );

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await commentSig(
        commentId !== "" ? commentId : mainVideo.id,
        "ipfs://" + contentURIValue,
        [
          {
            collectOpenAction: {
              simpleCollectOpenAction: collectModuleType,
            },
          },
        ],
        clientWallet,
        publicClient,
        address as `0x${string}`,
        dispatch,
        clearComment
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setCommentLoading(false);
  };

  const handleImagePaste = async (e: ClipboardEvent<HTMLTextAreaElement>) => {
    dispatch(setImageLoadingRedux(true));
    const items = e.clipboardData?.items;
    if (!items) return;
    let files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault();
        e.stopPropagation();
        const file = items[i].getAsFile();
        files.push(file as File); // Add the File to the array.
      }
    }
    if (files.length > 0) {
      await uploadImage(files, true);
      dispatch(setImageLoadingRedux(false));
    } else {
      dispatch(setImageLoadingRedux(false));
    }
  };

  const handleMentionClick = (user: Profile) => {
    setProfilesOpen(false);
    const newHTMLPost =
      commentHTML?.substring(0, commentHTML.lastIndexOf("@")) +
      `@${user?.handle?.localName}</span>`;
    const newElementPost =
      commentDescription?.substring(0, commentDescription.lastIndexOf("@")) +
      `@${user?.handle?.localName}`;
    setCommentDescription(newElementPost);

    const postStorage = JSON.parse(getCommentData() || "{}");
    setCommentData(
      JSON.stringify({
        ...postStorage,
        post: newElementPost,
      })
    );

    // if (newHTMLPost) (resultElement as any).innerHTML = newHTMLPost;
    setCommentHTML(newHTMLPost);
  };

  useEffect(() => {
    const savedData = getCommentData();
    if (savedData && JSON.parse(savedData).post) {
      setCommentDescription(JSON.parse(savedData).post);

      let resultElement = document.querySelector("#highlighted-content");
      if (
        JSON.parse(savedData).post[JSON.parse(savedData).post?.length - 1] ==
        "\n"
      ) {
        JSON.parse(savedData).post += " ";
      }
      setCommentHTML(
        getCommentHTML(
          JSON.parse(savedData).post,
          resultElement as Element,
          true
        )
      );
    }
  }, []);

  useEffect(() => {
    dispatch(setPostImages(gifs));
  }, [gifs]);

  useEffect(() => {
    if (document.querySelector("#highlighted-content")) {
      document.querySelector("#highlighted-content")!.innerHTML =
        commentHTML.length === 0 ? "Have something to say?" : commentHTML;
    }
  }, [commentHTML, gifOpen, collectOpen]);

  return {
    commentVideo,
    commentDescription,
    textElement,
    handleCommentDescription,
    commentLoading,
    caretCoord,
    mentionProfiles,
    profilesOpen,
    handleMentionClick,
    handleGifSubmit,
    handleGif,
    results,
    gifs,
    handleSetGif,
    gifOpen,
    setGifOpen,
    handleKeyDownDelete,
    preElement,
    handleImagePaste,
  };
};

export default useComment;
