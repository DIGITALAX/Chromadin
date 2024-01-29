import { MediaType } from "@/components/Home/types/home.types";
import {
  PostCollectGifState,
  setPostCollectGif,
} from "@/redux/reducers/postCollectGifSlice";
import { ChangeEvent, SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";

const setPostMedia = async (
  e: ChangeEvent<HTMLInputElement>,
  type: string,
  setMediaLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void,
  index: number,
  dispatch: Dispatch<AnyAction>,
  postCollectGif: PostCollectGifState,
  id: string
) => {
  if (!e.target.files) return;


  if (type === MediaType.Video) {
    setMediaLoading((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        video: true,
      };
      return arr;
    });

    const videoReaders = Array.from(e.target.files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    await Promise.all(videoReaders).then((newVideos: string[]) => {
      const images = { ...postCollectGif?.media };
      images[id] = [
        ...(images?.[id] || []),
        ...newVideos?.map((item) => ({
          media: item,
          type: MediaType.Video,
        })),
      ];

      dispatch(
        setPostCollectGif({
          actionType: postCollectGif?.type,
          actionId: postCollectGif?.id,
          actionCollectTypes: postCollectGif?.collectTypes,
          actionMedia: images,
        })
      );
    });
    setMediaLoading((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        video: false,
      };
      return arr;
    });
  } else {
    setMediaLoading((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        image: true,
      };
      return arr;
    });
    let types: string[] = [];
    const imageReaders = Array.from(e.target.files).map((file) => {
      types.push(file.type);
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    await Promise.all(imageReaders).then((newImages: string[]) => {
      const images = { ...postCollectGif?.media };
      images[id] = [
        ...(images?.[id] || []),
        ...newImages?.map((item) => ({
          media: item,
          type: MediaType.Image,
        })),
      ];

      dispatch(
        setPostCollectGif({
          actionType: postCollectGif?.type,
          actionId: postCollectGif?.id,
          actionCollectTypes: postCollectGif?.collectTypes,
          actionMedia: images,
        })
      );
    });

    setMediaLoading((prev) => {
      const arr = [...(prev || [])];
      arr[index] = {
        ...(arr[index] || {}),
        image: false,
      };
      return arr;
    });
  }
};

export default setPostMedia;
