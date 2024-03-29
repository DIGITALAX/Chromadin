import {
  Quote,
  Comment,
  Mirror,
  Post,
  Maybe,
  PublicationMetadataMediaAudio,
  PublicationMetadataMediaImage,
  PublicationMetadataMediaVideo,
  PublicationMetadataMedia,
} from "@/components/Home/types/generated";
import { INFURA_GATEWAY } from "../constants";

export const postMetadata = (
  publication: Post | Mirror | Quote | Comment
): Maybe<PublicationMetadataMedia[]> | undefined => {
  const pub =
    publication?.__typename === "Mirror"
      ? publication.mirrorOn
      : (publication as Post);

  return pub?.isEncrypted &&
    (pub as any)?.decrypted &&
    ((pub as any)?.decrypted?.__typename === "VideoMetadataV3" ||
      (pub as any)?.__typename === "ImageMetadataV3" ||
      (pub as any)?.__typename === "AudioMetadataV3")
    ? [(pub as any)?.asset, ...((pub as any)?.attachments || [])]
    : pub?.metadata?.__typename === "VideoMetadataV3" ||
      pub?.metadata?.__typename === "ImageMetadataV3" ||
      pub?.metadata?.__typename === "AudioMetadataV3"
    ? [pub?.metadata?.asset, ...(pub?.metadata?.attachments || [])]
    : undefined;
};

export const metadataMedia = (
  media:
    | PublicationMetadataMediaAudio
    | PublicationMetadataMediaImage
    | PublicationMetadataMediaVideo
):
  | {
      url: string;
      type: "Image" | "Video" | "Audio";
    }
  | undefined => {
  switch (media.__typename) {
    case "PublicationMetadataMediaAudio":
      return {
        url: media.audio.optimized?.uri
          ? media.audio.optimized?.uri
          : media.audio?.raw?.uri?.includes("ipfs://")
          ? `${INFURA_GATEWAY}/ipfs/${
              media.audio?.raw?.uri?.split("ipfs://")[1]
            }`
          : media.audio?.raw?.uri,
        type: "Audio",
      };

    case "PublicationMetadataMediaImage":
      return {
        url: media.image.optimized?.uri
          ? media.image.optimized?.uri
          : media.image?.raw?.uri?.includes("ipfs://")
          ? `${INFURA_GATEWAY}/ipfs/${
              media.image?.raw?.uri?.split("ipfs://")[1]
            }`
          : media.image?.raw?.uri,
        type: "Image",
      };

    case "PublicationMetadataMediaVideo":
      return {
        url: media.video?.raw?.uri
          ? media.video?.raw?.uri?.includes("ipfs://")
            ? `${INFURA_GATEWAY}/ipfs/${
                media.video?.raw?.uri?.split("ipfs://")[1]
              }`
            : media.video.optimized?.uri
          : media.video?.raw?.uri,
        type: "Video",
      };
  }
};
