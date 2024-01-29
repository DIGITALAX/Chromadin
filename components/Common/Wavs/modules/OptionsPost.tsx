import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/image";
import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { OptionsPostProps } from "../types/wavs.types";
import { setPostCollectGif } from "@/redux/reducers/postCollectGifSlice";
import setPostMedia from "@/lib/helpers/setPostMedia";
import { MediaType } from "@/components/Home/types/home.types";

const OptionsPost: FunctionComponent<OptionsPostProps> = ({
  mediaLoading,
  setMediaLoading,
  postLoading,
  postCollectGif,
  dispatch,
  id,
  index,
}): JSX.Element => {
  return (
    <div className="relative w-fit h-fit flex flex-row gap-2 pl-2">
      <div
        className={`relative w-4 h-4 items-center flex cursor-pointer ${
          postCollectGif?.media?.[id]?.length === 4 && "opacity-20"
        }`}
        onClick={() =>
          dispatch(
            setPostCollectGif({
              actionType: "gif",
              actionId: id,
              actionCollectTypes: postCollectGif?.collectTypes,
              actionMedia: postCollectGif?.media,
            })
          )
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
          !postLoading &&
          !mediaLoading?.[index]?.image &&
          (!postCollectGif?.media?.[id]?.length ||
            postCollectGif?.media?.[id]?.length < 4) &&
          "cursor-pointer active:scale-95"
        } ${mediaLoading?.[index]?.image && "animate-spin"} ${
          postCollectGif?.media?.[id]?.length === 4 && "opacity-20"
        }`}
        onChange={(e: any) =>
          !postLoading &&
          !mediaLoading?.[index]?.image &&
          setPostMedia(
            e,
            MediaType.Image,
            setMediaLoading,
            index,
            dispatch,
            postCollectGif,
            id
          )
        }
      >
        {!mediaLoading?.[index]?.image ? (
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
            mediaLoading?.[index]?.image ||
            postLoading ||
            postCollectGif?.media?.[id]?.length === 4
              ? true
              : false
          }
        />
      </label>
      <label
        className={`relative w-4 h-4 items-center flex ${
          !postLoading &&
          !mediaLoading?.[index]?.video &&
          (!postCollectGif?.media?.[id]?.length ||
            postCollectGif?.media?.[id]?.length < 4) &&
          "cursor-pointer active:scale-95"
        } ${mediaLoading?.[index]?.video && "animate-spin"} ${
          postCollectGif?.media?.[id]?.length === 4 && "opacity-20"
        }`}
        onChange={(e: any) =>
          !postLoading &&
          !mediaLoading?.[index]?.video &&
          setPostMedia(
            e,
            MediaType.Video,
            setMediaLoading,
            index,
            dispatch,
            postCollectGif,
            id
          )
        }
      >
        {!mediaLoading?.[index]?.video ? (
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
            mediaLoading?.[index]?.video ||
            postLoading ||
            postCollectGif?.media?.[id]?.length === 4
              ? true
              : false
          }
        />
      </label>
      <div
        className="relative w-4 h-4 items-center flex cursor-pointer"
        onClick={() =>
          dispatch(
            setPostCollectGif({
              actionType: "collect",
              actionId: id,
              actionCollectTypes: postCollectGif?.collectTypes,
              actionMedia: postCollectGif?.media,
            })
          )
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
