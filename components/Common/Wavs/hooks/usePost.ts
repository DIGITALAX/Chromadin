import { LENS_HUB_PROXY_ADDRESS_MATIC } from "@/lib/constants";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import LensHubProxy from "../../../../abis/LensHubProxy.json";
import handleIndexCheck from "@/lib/helpers/handleIndexCheck";
import broadcast from "@/graphql/lens/mutations/broadcast";
import { omit } from "lodash";
import uploadPostContent from "@/lib/helpers/uploadPostContent";
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
import { searchProfile } from "@/graphql/lens/queries/search";
import { setMakePost } from "@/redux/reducers/makePostSlice";
import {
  PublicClient,
  SignTypedDataParameters,
  createWalletClient,
  custom,
} from "viem";
import { polygon } from "viem/chains";
import { createQuoteTypedData } from "@/graphql/lens/mutations/quote";
import { AnyAction, Dispatch } from "redux";
import {
  PostCollectGifState,
  setPostCollectGif,
} from "@/redux/reducers/postCollectGifSlice";
import cleanCollect from "@/lib/helpers/cleanCollect";

const useMakePost = (
  address: `0x${string}` | undefined,
  publicClient: PublicClient,
  dispatch: Dispatch<AnyAction>,
  postCollectGif: PostCollectGifState
) => {
  const [mediaLoading, setMediaLoading] = useState<
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
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [postDescription, setPostDescription] = useState<string>("");
  const [caretCoord, setCaretCoord] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [profilesOpen, setProfilesOpen] = useState<boolean>(false);
  const textElement = useRef<HTMLTextAreaElement>(null);
  const preElement = useRef<HTMLPreElement>(null);
  const [mentionProfiles, setMentionProfiles] = useState<Profile[]>([]);
  const [postHTML, setPostHTML] = useState<string>("");

  const handleKeyDownDelete = (e: KeyboardEvent<Element>) => {
    const highlightedContent = document.querySelector("#highlighted-content3")!;
    const selection = window.getSelection();
    if (e.key === "Backspace" && selection?.toString() !== "") {
      const start = textElement.current!.selectionStart;
      const end = textElement.current!.selectionEnd;

      if (start === 0 && end === textElement.current!.value?.length) {
        setPostDescription("");
        setPostHTML("");
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
      }
    } else if (
      e.key === "Backspace" &&
      postDescription?.length === 0 &&
      postHTML?.length === 0
    ) {
      (e.currentTarget! as any).value = "";

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
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Indexing Interaction",
      })
    );

    const newMedia = { ...postCollectGif?.media };
    delete newMedia?.[postCollectGif?.id!];
    const newTypes = { ...postCollectGif?.collectTypes };
    delete newTypes?.[postCollectGif?.id!];
    dispatch(
      setPostCollectGif({
        actionCollectTypes: newTypes,
        actionMedia: newMedia,
      })
    );
  };

  const handlePost = async (quote: string | undefined): Promise<void> => {
    if (
      (!postDescription ||
        postDescription === "" ||
        postDescription.trim()?.length < 0) &&
      (!postCollectGif?.media?.[postCollectGif?.id!]?.length ||
        postCollectGif?.media?.[postCollectGif?.id!]?.length < 1)
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
        postDescription,
        postCollectGif?.media?.[postCollectGif?.id!] || []
      );

      const cleanedAction = postCollectGif?.collectTypes?.[postCollectGif?.id!]
        ? cleanCollect([
            {
              collectOpenAction: {
                simpleCollectOpenAction:
                  postCollectGif?.collectTypes?.[postCollectGif?.id!],
              },
            },
          ])
        : [
            {
              collectOpenAction: {
                simpleCollectOpenAction: {
                  followerOnly: false,
                },
              },
            },
          ];

      if (quote) {
        const data = await createQuoteTypedData({
          quoteOn: quote,
          contentURI: contentURIValue,
          openActionModules: cleanedAction,
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
          openActionModules: cleanedAction,
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
            functionName: "quote",
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
            ],
            account: address,
          });
        } else {
          request = await publicClient.simulateContract({
            address: LENS_HUB_PROXY_ADDRESS_MATIC,
            abi: LensHubProxy,
            functionName: "post",
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
            ],
            account: address,
          });
        }
        const res = await clientWallet.writeContract(request.request);
        clearPost();
        const tx = await publicClient.waitForTransactionReceipt({ hash: res });

        await handleIndexCheck(
          {
            forTxHash: tx.transactionHash,
          },
          dispatch
        );
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
    const newHTMLPost =
      postHTML?.substring(0, postHTML.lastIndexOf("@")) +
      `@${user?.handle?.localName}</span>`;
    const newElementPost =
      postDescription?.substring(0, postDescription.lastIndexOf("@")) +
      `@${user?.handle?.localName}`;
    setPostDescription(newElementPost);

    setPostHTML(newHTMLPost);
  };

  useEffect(() => {
    if (document.querySelector("#highlighted-content3")) {
      document.querySelector("#highlighted-content3")!.innerHTML =
        postHTML.length === 0 ? "Have something to say?" : postHTML;
    }
  }, [postHTML]);

  return {
    postDescription,
    textElement,
    handlePostDescription,
    postLoading,
    caretCoord,
    mentionProfiles,
    profilesOpen,
    handleMentionClick,
    handleKeyDownDelete,
    handlePost,
    preElement,
    mediaLoading,
    setMediaLoading,
  };
};

export default useMakePost;
