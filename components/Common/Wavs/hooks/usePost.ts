import { LENS_HUB_PROXY_ADDRESS_MATIC } from "@/lib/constants";
import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import LensHubProxy from "../../../../abis/LensHubProxy.json";
import handleIndexCheck from "@/lib/helpers/handleIndexCheck";
import { RootState } from "@/redux/store";
import { splitSignature } from "ethers/lib/utils.js";
import broadcast from "@/graphql/lens/mutations/broadcast";
import { omit } from "lodash";
import uploadPostContent from "@/lib/helpers/uploadPostContent";
import { getPostData, removePostData, setPostData } from "@/lib/lens/utils";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import getPostHTML from "@/lib/helpers/commentHTML";
import {
  CreateOnchainPostEip712TypedData,
  CreateOnchainPostEip712TypedDataTypes,
  CreateOnchainQuoteEip712TypedData,
  CreateOnchainQuoteEip712TypedDataTypes,
  CreateOnchainQuoteEip712TypedDataValue,
  LimitType,
  Profile,
  RelaySuccess,
} from "@/components/Home/types/generated";
import getCaretPos from "@/lib/helpers/getCaretPos";
import { createPostTypedData } from "@/graphql/lens/mutations/post";
import { MediaType, UploadedMedia } from "../types/wavs.types";
import { searchProfile } from "@/graphql/lens/queries/search";
import { setCollectOpen } from "@/redux/reducers/collectOpenSlice";
import { setPublicationImages } from "@/redux/reducers/publicationImageSlice";
import { setMakePost } from "@/redux/reducers/makePostSlice";
import { setPostSent } from "@/redux/reducers/postSentSlice";
import useImageUpload from "./../../NFT/hooks/useImageUpload";
import { setImageLoadingRedux } from "@/redux/reducers/imageLoadingSlice";
import {
  SignTypedDataParameters,
  createPublicClient,
  createWalletClient,
  custom,
  http,
} from "viem";
import { polygon } from "viem/chains";
import { createQuoteTypedData } from "@/graphql/lens/mutations/quote";

const useMakePost = () => {
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [postDescription, setPostDescription] = useState<string>("");
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
    JSON.parse(getPostData() || "{}").images || []
  );
  const [searchGif, setSearchGif] = useState<string>("");
  const [postHTML, setPostHTML] = useState<string>("");
  const [contentURI, setContentURI] = useState<string>();
  const dispatch = useDispatch();
  const { uploadImage } = useImageUpload();
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const collectOpen = useSelector(
    (state: RootState) => state.app.collectOpenReducer.value
  );
  const postImages = useSelector(
    (state: RootState) => state?.app?.publicationImageReducer?.value
  );
  const collectModuleType = useSelector(
    (state: RootState) => state?.app?.collectValueTypeReducer?.type
  );

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
      const postStorage = JSON.parse(getPostData() || "{}");
      setPostData(
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
    const highlightedContent = document.querySelector("#highlighted-content3")!;
    const selection = window.getSelection();
    const postStorage = JSON.parse(getPostData() || "{}");
    if (e.key === "Backspace" && selection?.toString() !== "") {
      const start = textElement.current!.selectionStart;
      const end = textElement.current!.selectionEnd;

      if (start === 0 && end === textElement.current!.value?.length) {
        setPostDescription("");
        setPostHTML("");
        // highlightedContent.innerHTML = "";
        setPostData(
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
          postHTML.slice(0, start) + strippedHtml + postHTML.slice(end);
        const newDescription =
          postDescription.slice(0, start) +
          strippedText +
          postDescription.slice(end);

        setPostHTML(newHTML);
        setPostDescription(newDescription);
        (e.currentTarget! as any).value = newDescription;
        // highlightedContent.innerHTML = newHTML;
        setPostData(
          JSON.stringify({
            ...postStorage,
            post: newDescription,
          })
        );
      }
    } else if (
      e.key === "Backspace" &&
      postDescription?.length === 0 &&
      postHTML?.length === 0
    ) {
      (e.currentTarget! as any).value = "";
      // highlightedContent.innerHTML = "";
      setPostData(
        JSON.stringify({
          ...postStorage,
          post: "",
        })
      );
      e.preventDefault();
    }
  };

  const handlePostDescription = async (e: any): Promise<void> => {
    let resultElement = document.querySelector("#highlighted-content3");
    const newValue = e.target.value.endsWith("\n")
      ? e.target.value + " "
      : e.target.value;
    setPostHTML(getPostHTML(e, resultElement as Element));
    setPostDescription(newValue);
    const postStorage = JSON.parse(getPostData() || "{}");
    setPostData(
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
        limit: LimitType.TwentyFive,
      });
      setMentionProfiles(allProfiles?.data?.searchProfiles?.items as Profile[]);
    } else {
      setProfilesOpen(false);
      setMentionProfiles([]);
    }
  };

  const clearPost = () => {
    dispatch(
      setMakePost({
        actionValue: false,
        actionQuote: undefined,
      })
    );
    setPostLoading(false);
    setPostDescription("");
    setPostHTML("");
    setGifs([]);
    dispatch(setPublicationImages([]));
    dispatch(setCollectOpen(false));
    setGifOpen(false);
    // (document as any).querySelector("#highlighted-content").innerHTML = "";
    removePostData();
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Indexing Interaction",
      })
    );
  };

  const handlePost = async (quote: string | undefined): Promise<void> => {
    if (
      (!postDescription ||
        postDescription === "" ||
        postDescription.trim()?.length < 0) &&
      (!postImages?.length || postImages?.length < 1)
    ) {
      return;
    }
    setPostLoading(true);
    let toSign:
        | SignTypedDataParameters<
            Omit<CreateOnchainQuoteEip712TypedDataTypes, "__typename">,
            string,
            undefined
          >
        | SignTypedDataParameters<
            Omit<CreateOnchainPostEip712TypedDataTypes, "__typename">,
            string,
            undefined
          >,
      typedData:
        | CreateOnchainPostEip712TypedData
        | CreateOnchainQuoteEip712TypedData,
      id: string;
    try {
      const contentURIValue = await uploadPostContent(
        postImages,
        postDescription,
        setContentURI,
        contentURI,
        dispatch
      );

      if (quote) {
        const data = await createQuoteTypedData({
          quoteOn: quote,
          contentURI: "ipfs://" + contentURIValue,
          openActionModules: [
            {
              collectOpenAction: {
                simpleCollectOpenAction: collectModuleType,
              },
            },
          ],
        });
        typedData = data.data?.createOnchainQuoteTypedData
          ?.typedData as CreateOnchainQuoteEip712TypedData;
        id = data.data?.createOnchainQuoteTypedData?.id;
        toSign = {
          domain: omit(typedData?.domain, ["__typename"]),
          types: omit(typedData?.types, ["__typename"]),
          primaryType: "Quote",
          message: omit(typedData?.value, ["__typename"]),
          account: address as `0x${string}`,
        };
      } else {
        const data = await createPostTypedData({
          contentURI: "ipfs://" + contentURIValue,
          openActionModules: [
            {
              collectOpenAction: {
                simpleCollectOpenAction: collectModuleType,
              },
            },
          ],
        });

        typedData = data.data?.createOnchainPostTypedData
          ?.typedData as CreateOnchainPostEip712TypedData;
        id = data.data?.createOnchainPostTypedData?.id;
        toSign = {
          domain: omit(typedData?.domain, ["__typename"]),
          types: omit(typedData?.types, ["__typename"]),
          primaryType: "Post",
          message: omit(typedData?.value, ["__typename"]),
          account: address as `0x${string}`,
        };
      }

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const signature = await clientWallet.signTypedData(toSign as any);
      const { v, r, s } = splitSignature(signature);

      const broadcastResult = await broadcast({
        id,
        signature,
      });

      if (
        broadcastResult?.data?.broadcastOnchain?.__typename === "RelayError"
      ) {
        let request;
        if (quote) {
          request = await publicClient.simulateContract({
            address: LENS_HUB_PROXY_ADDRESS_MATIC,
            abi: LensHubProxy,
            functionName: "quoteWithSig",
            chain: polygon,
            args: [
              {
                profileId: typedData?.value.profileId,
                contentURI: typedData?.value.contentURI,
                pointedProfileId: (
                  typedData?.value as CreateOnchainQuoteEip712TypedDataValue
                )?.pointedProfileId,
                pointedPubId: (
                  typedData?.value as CreateOnchainQuoteEip712TypedDataValue
                )?.pointedPubId,
                referrerProfileIds: (
                  typedData?.value as CreateOnchainQuoteEip712TypedDataValue
                )?.referrerProfileIds,
                referrerPubIds: (
                  typedData?.value as CreateOnchainQuoteEip712TypedDataValue
                )?.referrerPubIds,
                referenceModuleData: (
                  typedData?.value as CreateOnchainQuoteEip712TypedDataValue
                )?.referenceModuleData,
                actionModules: typedData?.value.actionModules,
                actionModulesInitDatas: typedData?.value.actionModulesInitDatas,
                referenceModule: typedData?.value.referenceModule,
                referenceModuleInitData:
                  typedData?.value.referenceModuleInitData,
              },
              {
                signer: address,
                v,
                r,
                s,
                deadline: typedData?.value.deadline,
              },
            ],
            account: address,
          });
        } else {
          request = await publicClient.simulateContract({
            address: LENS_HUB_PROXY_ADDRESS_MATIC,
            abi: LensHubProxy,
            functionName: "postWithSig",
            chain: polygon,
            args: [
              {
                profileId: typedData?.value.profileId,
                contentURI: typedData?.value.contentURI,
                actionModules: typedData?.value.actionModules,
                actionModulesInitDatas: typedData?.value.actionModulesInitDatas,
                referenceModule: typedData?.value.referenceModule,
                referenceModuleInitData:
                  typedData?.value.referenceModuleInitData,
              },
              {
                v,
                r,
                s,
                deadline: typedData?.value.deadline,
                signer: address,
              },
            ],
            account: address,
          });
        }
        const res = await clientWallet.writeContract(request.request);
        clearPost();
        await publicClient.waitForTransactionReceipt({ hash: res });
        await handleIndexCheck(res, dispatch);
        dispatch(setPostSent(true));
      } else {
        clearPost();
        setTimeout(async () => {
          await handleIndexCheck(
            (broadcastResult?.data?.broadcastOnchain as RelaySuccess)?.txHash,
            dispatch
          );
        }, 7000);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  const handleMentionClick = (user: Profile) => {
    setProfilesOpen(false);
    let resultElement = document.querySelector("#highlighted-content3");
    const newHTMLPost =
      postHTML?.substring(0, postHTML.lastIndexOf("@")) +
      `@${user?.handle?.localName}</span>`;
    const newElementPost =
      postDescription?.substring(0, postDescription.lastIndexOf("@")) +
      `@${user?.handle?.localName}`;
    setPostDescription(newElementPost);

    const postStorage = JSON.parse(getPostData() || "{}");
    setPostData(
      JSON.stringify({
        ...postStorage,
        post: newElementPost,
      })
    );

    // if (newHTMLPost) (resultElement as any).innerHTML = newHTMLPost;
    setPostHTML(newHTMLPost);
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

  useEffect(() => {
    const savedData = getPostData();
    if (savedData && JSON.parse(savedData)?.post) {
      setPostDescription(JSON.parse(savedData).post);
      let resultElement = document.querySelector("#highlighted-content3");
      if (
        JSON.parse(savedData)?.post[JSON.parse(savedData).post?.length - 1] ==
        "\n"
      ) {
        JSON.parse(savedData).post += " ";
      }
      setPostHTML(
        getPostHTML(JSON.parse(savedData).post, resultElement as Element, true)
      );
    }
  }, []);

  useEffect(() => {
    dispatch(setPublicationImages(gifs));
  }, [gifs]);

  useEffect(() => {
    if (searchGif === "" || searchGif === " ") {
      setResults([]);
    }
  }, [searchGif]);

  useEffect(() => {
    if (document.querySelector("#highlighted-content3")) {
      document.querySelector("#highlighted-content3")!.innerHTML =
        postHTML.length === 0 ? "Have something to say?" : postHTML;
    }
  }, [postHTML, gifOpen, collectOpen]);

  return {
    postDescription,
    textElement,
    handlePostDescription,
    postLoading,
    caretCoord,
    mentionProfiles,
    profilesOpen,
    handleMentionClick,
    handleGifSubmit,
    handleGif,
    results,
    gifs,
    handleSetGif,
    handleKeyDownDelete,
    gifOpen,
    setGifOpen,
    collectOpen,
    handlePost,
    preElement,
    handleImagePaste,
  };
};

export default useMakePost;
