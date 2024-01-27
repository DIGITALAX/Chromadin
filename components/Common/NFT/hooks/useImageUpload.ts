import { MediaType, UploadedMedia } from "@/components/Home/types/home.types";
import {
  getCommentData,
  getPostData,
  setCommentData,
  setPostData,
} from "@/lib/lens/utils";
import { FormEvent, useEffect, useState } from "react";
import lodash from "lodash";
import { setPostImages } from "@/redux/reducers/postImageSlice";
import { setPublicationImages } from "@/redux/reducers/publicationImageSlice";
import { setIPFS } from "@/redux/reducers/IPFSSlice";
import { setImageLoadingRedux } from "@/redux/reducers/imageLoadingSlice";
import { AnyAction, Dispatch } from "redux";

const useImageUpload = (
  dispatch: Dispatch<AnyAction>,
  page: string,
  postOpen: boolean,
  imagesUploaded: UploadedMedia[],
  imagesUploadedPub: UploadedMedia[]
) => {
  const [clientRendered, setClientRendered] = useState<boolean>(false);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const [mappedFeaturedFiles, setMappedFeaturedFiles] = useState<
    UploadedMedia[]
  >(
    page !== "chat"
      ? !postOpen
        ? JSON.parse(getCommentData() || "{}").images || []
        : JSON.parse(getPostData() || "{}").images || []
      : []
  );

  const uploadImage = async (
    e: FormEvent | File[],
    pasted?: boolean,
    feed?: boolean
  ): Promise<void> => {
    if (!pasted) {
      if ((e as any)?.target?.files?.length < 1) {
        return;
      }
    } else {
      if ((e as File[]).length < 1) {
        return;
      }
    }
    let finalImages: UploadedMedia[] = [];
    dispatch(setImageLoadingRedux(true));
    let uploadCounter = 0; // add a counter here
    const numberOfFiles = pasted
      ? (e as File[]).length
      : (e as any).target.files.length;

    const imageFiles = Array.from(
      pasted
        ? (e as File[])
        : ((e as FormEvent).target as HTMLFormElement)?.files
    );

    await Promise.all(
      imageFiles.map(async (_, index: number) => {
        try {
          // const compressedImage = await compressImageFiles(
          //   (e as any).target.files[index] as File
          // );
          const response = await fetch("/api/ipfs", {
            method: "POST",
            body: pasted
              ? (e as File[])[index]
              : (e as any).target.files[index],
          });
          if (response.status !== 200) {
            dispatch(setImageLoadingRedux(false));
            return;
          } else {
            let cid = await response.json();
            finalImages.push({
              cid: String(cid?.cid),
              type: MediaType.Image,
            });
            uploadCounter += 1; // increment counter here

            if (uploadCounter === numberOfFiles) {
              // check counter here
              dispatch(setImageLoadingRedux(false));
            }
            if (
              finalImages?.length ===
              (pasted
                ? (e as File[]).length
                : ((e as FormEvent).target as HTMLFormElement).files?.length)
            ) {
              let newArr = [
                ...(postOpen ? imagesUploadedPub : (imagesUploaded as any)),
                ...finalImages,
              ];
              setMappedFeaturedFiles(newArr);
              if (feed) {
                if (postOpen) {
                  const postStorage = JSON.parse(getPostData() || "{}");
                  setPostData(
                    JSON.stringify({
                      ...postStorage,
                      images: newArr,
                    })
                  );
                } else {
                  const postStorage = JSON.parse(getCommentData() || "{}");
                  setCommentData(
                    JSON.stringify({
                      ...postStorage,
                      images: newArr,
                    })
                  );
                }
              }
            }
          }
        } catch (err: any) {
          dispatch(setIPFS(true));
          console.error(err.message);
          dispatch(setImageLoadingRedux(false));
        }
      })
    );
  };

  const uploadVideo = async (e: FormEvent, feed?: boolean) => {
    try {
      if ((e as any).target.files.length < 1) {
        return;
      }
      setVideoLoading(true);
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: (e.target as HTMLFormElement).files[0],
      });
      let cid = await response.json();
      let newArr = [
        ...(postOpen ? imagesUploadedPub : (imagesUploaded as any)),
        { cid: String(cid?.cid), type: MediaType.Video },
      ];
      setMappedFeaturedFiles(newArr);

      if (feed) {
        if (postOpen) {
          const postStorage = JSON.parse(getPostData() || "{}");
          setPostData(
            JSON.stringify({
              ...postStorage,
              images: newArr,
            })
          );
        } else {
          const postStorage = JSON.parse(getCommentData() || "{}");
          setCommentData(
            JSON.stringify({
              ...postStorage,
              images: newArr,
            })
          );
        }
      }
    } catch (err: any) {
      dispatch(setIPFS(true));
      console.error(err.message);
    }
    setVideoLoading(false);
  };

  const handleRemoveImage = (image: UploadedMedia, feed?: boolean): void => {
    const cleanedArray = lodash.filter(
      postOpen ? imagesUploadedPub : (imagesUploaded as any),
      (uploaded) => uploaded.cid !== image.cid
    );
    setMappedFeaturedFiles(cleanedArray);

    if (feed) {
      if (postOpen) {
        const postStorage = JSON.parse(getPostData() || "{}");
        setPostData(
          JSON.stringify({
            ...postStorage,
            images: cleanedArray,
          })
        );
      } else {
        const postStorage = JSON.parse(getCommentData() || "{}");
        setCommentData(
          JSON.stringify({
            ...postStorage,
            images: cleanedArray,
          })
        );
      }
    }
  };

  useEffect(() => {
    if (postOpen) {
      if (mappedFeaturedFiles.length > 3) {
        setMappedFeaturedFiles(mappedFeaturedFiles.slice(0, 4));
        dispatch(setPublicationImages(mappedFeaturedFiles.slice(0, 4)));
      } else {
        dispatch(setPublicationImages(mappedFeaturedFiles));
      }
    } else {
      if (mappedFeaturedFiles.length > 3) {
        setMappedFeaturedFiles(mappedFeaturedFiles.slice(0, 4));
        dispatch(setPostImages(mappedFeaturedFiles.slice(0, 4)));
      } else {
        dispatch(setPostImages(mappedFeaturedFiles));
      }
    }
  }, [mappedFeaturedFiles]);

  useEffect(() => {
    setClientRendered(true);
  }, []);

  return {
    uploadImage,
    mappedFeaturedFiles,
    handleRemoveImage,
    videoLoading,
    uploadVideo,
    clientRendered,
  };
};

export default useImageUpload;
