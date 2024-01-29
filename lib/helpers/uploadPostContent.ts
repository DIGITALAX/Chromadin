import { v4 as uuidv4 } from "uuid";

import { PublicationMetadataMainFocusType } from "@/components/Home/types/generated";
import convertToFile from "./convertToFile";
import { MediaType, UploadedMedia } from "@/components/Home/types/home.types";

const uploadPostContent = async (
  contentText: string | undefined,
  media: UploadedMedia[]
): Promise<string | undefined> => {
  let $schema: string,
    mainContentFocus: PublicationMetadataMainFocusType,
    value: object = {};

  if (media?.length < 1 || !media) {
    $schema = "https://json-schemas.lens.dev/publications/text-only/3.0.0.json";
    mainContentFocus = PublicationMetadataMainFocusType.TextOnly;
  } else {
    const cleanedGifs = media
      ?.map((item) => {
        if (item.type == MediaType.Gif) {
          return item.media;
        }
      })
      ?.filter(Boolean);
    const cleanedImages = media
      ?.map((item) => {
        if (item?.type == MediaType.Image) {
          return item.media;
        }
      })
      ?.filter(Boolean);
    const cleanedVideos = media
      ?.map((item) => {
        if (item?.type == MediaType.Video) {
          return item.media;
        }
      })
      ?.filter(Boolean);

    const mediaWithKeys = [
      ...(await Promise.all(
        (cleanedVideos || []).map(async (video) => ({
          type: "video/mp4",
          item: video?.includes("ipfs://")
            ? video
            : convertToFile(video!, "video/mp4"),
          cover: await convertCover(video!),
        }))
      )),
      ...(cleanedImages || []).map((image) => ({
        type: "image/png",
        item:
          image &&
          (image?.includes("ipfs://")
            ? image
            : convertToFile(image, "image/png")),
      })),
      ...(cleanedGifs || []).map((gif) => ({
        type: "image/gif",
        item: gif,
      })),
    ]
      ?.filter(Boolean)
      ?.filter((item) => item.item);

    const uploads = await Promise.all(
      mediaWithKeys.map(async (media) => {
        if (
          typeof media?.item == "string" &&
          ((media?.item as String)?.includes("ipfs://") ||
            (media?.item as String)?.includes("https://media.tenor.com"))
        ) {
          return { type: media?.type, item: media?.item };
        } else {
          const response = await fetch("/api/ipfs", {
            method: "POST",
            body: media.item,
          });
          const responseJSON = await response.json();
          return { type: media?.type, item: "ipfs://" + responseJSON.cid };
        }
      })
    );

    const primaryMedia = uploads[0];
    if (primaryMedia?.type === "video/mp4") {
      $schema = "https://json-schemas.lens.dev/publications/video/3.0.0.json";
      mainContentFocus = PublicationMetadataMainFocusType.Video;
      value = {
        video: primaryMedia,
      };
    } else if (primaryMedia?.type === "audio/mpeg") {
      $schema = "https://json-schemas.lens.dev/publications/audio/3.0.0.json";
      mainContentFocus = PublicationMetadataMainFocusType.Audio;
      value = {
        audio: primaryMedia,
      };
    } else {
      $schema = "https://json-schemas.lens.dev/publications/image/3.0.0.json";
      mainContentFocus = PublicationMetadataMainFocusType.Image;
      value = { image: primaryMedia };
    }

    const attachments = uploads.filter(
      (media) => media.item !== primaryMedia.item
    );

    if (attachments?.length > 0) {
      value = {
        ...value,
        attachments: attachments,
      };
    }
  }

  try {
    const object = {
      $schema,
      lens: {
        mainContentFocus,
        title:
          contentText && contentText?.trim() !== ""
            ? contentText.slice(0, 20)
            : undefined,
        content:
          contentText && contentText?.trim() !== "" ? contentText : undefined,
        appId: "chromadin",
        ...value,
        id: uuidv4(),
        hideFromFeed: false,
        locale: "en",
      },
    };

    let cid: string = "";

    const response = await fetch("/api/ipfs", {
      method: "POST",
      body: JSON.stringify(object),
    });
    let responseJSON = await response.json();
    cid = responseJSON?.cid;

    return "ipfs://" + cid;
  } catch (err: any) {
    console.error(err.message);
  }
};

export default uploadPostContent;

const convertCover = async (vid: string): Promise<string | undefined> => {
  try {
    const video = document.createElement("video");
    video.src = vid;
    video.currentTime = 0.1;

    let url: string = "";

    video.addEventListener("loadeddata", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      url = canvas.toDataURL();
    });

    video.load();

    const loadedCover = await fetch("/api/ipfs", {
      method: "POST",
      body: convertToFile(url, "image/png"),
    });
    const res = await loadedCover.json();

    return "ipfs://" + res?.cid;
  } catch (err: any) {
    console.error(err.message);
  }
};
