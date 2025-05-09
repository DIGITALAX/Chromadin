import { INFURA_GATEWAY } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import Image from "next/image";
import { FunctionComponent, JSX, useContext, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { OptionsPostProps } from "../types/main.types";
import setPostMedia from "@/app/lib/helpers/setPostMedia";

const OptionsPost: FunctionComponent<OptionsPostProps> = ({
  id,
  commentLoading,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const [mediaLoading, setMediaLoading] = useState<{
    image: boolean;
    video: boolean;
  }>({
    image: false,
    video: false,
  });
  return (
    <div className="relative w-fit h-fit flex flex-row gap-2 pl-2">
      <div
        className={`relative w-4 h-4 items-center flex cursor-pointer ${
          context?.postInfo?.media?.[id]?.length === 4 && "opacity-20"
        }`}
        onClick={() =>
          context?.setGif({
            open: true,
            id,
          })
        }
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmSmqvoqB88FsKruGmZHGg65MZfC4dxHH6KpMBrHrUDxQs`}
          alt="opt"
          fill
          draggable={false}
        />
      </div>
      <label
        className={`relative w-4 h-4 items-center flex ${
          !commentLoading &&
          !mediaLoading.image &&
          (!context?.postInfo?.media?.[id]?.length ||
            context?.postInfo?.media?.[id]?.length < 4) &&
          "cursor-pointer active:scale-95"
        } ${mediaLoading?.image && "animate-spin"} ${
          context?.postInfo?.media?.[id]?.length === 4 && "opacity-20"
        }`}
        onChange={async (e: any) => {
          if (!commentLoading && !mediaLoading.image) {
            setMediaLoading((prev) => ({
              ...prev,
              image: true,
            }));
            const media = await setPostMedia(
              e,
              "image/png",
              id,
              context?.postInfo?.media
            );

            if (media) {
              context?.setPostInfo((prev) => ({
                ...prev,
                media,
              }));
            }

            setMediaLoading((prev) => ({
              ...prev,
              image: false,
            }));
          }
        }}
      >
        {!mediaLoading?.image ? (
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmR3SNUJj2BNc8iTCAZ1pf6CngJkKwi6vJ36YSroF4N6HE`}
            alt="opt"
            fill
            draggable={false}
          />
        ) : (
          <AiOutlineLoading color="white" size={15} />
        )}
        <input
          type="file"
          accept="image/png"
          hidden
          required
          id="files"
          multiple={true}
          name="images"
          className="caret-transparent"
          disabled={
            mediaLoading.image ||
            commentLoading ||
            context?.postInfo?.media?.[id]?.length === 4
              ? true
              : false
          }
        />
      </label>
      <label
        className={`relative w-4 h-4 items-center flex ${
          !commentLoading &&
          !mediaLoading.video &&
          (!context?.postInfo?.media?.[id]?.length ||
            context?.postInfo?.media?.[id]?.length < 4) &&
          "cursor-pointer active:scale-95"
        } ${mediaLoading?.video && "animate-spin"} ${
          context?.postInfo?.media?.[id]?.length === 4 && "opacity-20"
        } `}
        onChange={async (e: any) => {
          if (!commentLoading && !mediaLoading.video) {
            setMediaLoading((prev) => ({
              ...prev,
              video: true,
            }));
            const media = await setPostMedia(
              e,
              "video/mp4",
              id,
              context?.postInfo?.media
            );
            if (media) {
              context?.setPostInfo((prev) => ({
                ...prev,
                media,
              }));
            }

            setMediaLoading((prev) => ({
              ...prev,
              video: false,
            }));
          }
        }}
      >
        {!mediaLoading?.video ? (
          <Image
            src={`${INFURA_GATEWAY}/ipfs/Qme5Ss6at8oXuaUr8ADqTZojr44Sf81P2M5GszNYTB8Mhq`}
            alt="opt"
            fill
            draggable={false}
          />
        ) : (
          <AiOutlineLoading color="white" size={15} />
        )}
        <input
          type="file"
          accept="video/mp4"
          hidden
          required
          id="files"
          multiple={false}
          name="video"
          className="caret-transparent"
          disabled={
            mediaLoading.video ||
            commentLoading ||
            context?.postInfo?.media?.[id]?.length === 4
              ? true
              : false
          }
        />
      </label>
      <div
        className="relative w-4 h-4 items-center flex cursor-pointer"
        onClick={() =>
          context?.setCollectOptions({
            open: true,
            id,
          })
        }
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmeMxvbUP4ryQYdX8c6THtUfnJ3phgvSgbaQScHfVghgpz`}
          alt="opt"
          fill
          draggable={false}
        />
      </div>
    </div>
  );
};

export default OptionsPost;
