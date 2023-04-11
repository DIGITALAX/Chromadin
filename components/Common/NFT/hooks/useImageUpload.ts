import { MediaType, UploadedMedia } from "@/components/Home/types/home.types";
import { getCommentData, setCommentData } from "@/lib/lens/utils";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import lodash from "lodash";
import { setPostImages } from "@/redux/reducers/postImageSlice";
import compressImageFiles from "@/lib/helpers/compressImageFiles";
import fileLimitAlert from "@/lib/helpers/fileLimitAlert";
import videoLimitAlert from "@/lib/helpers/videoLimitAlert";

const useImageUpload = () => {
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const [mappedFeaturedFiles, setMappedFeaturedFiles] = useState<
    UploadedMedia[]
  >(JSON.parse(getCommentData() || "{}").images || []);
  const dispatch = useDispatch();
  const imagesUploaded = useSelector(
    (state: RootState) => state.app.postImageReducer.value
  );

  const uploadImage = async (
    e: FormEvent | File,
    canvas?: boolean
  ): Promise<void> => {
    if (!canvas) {
      if ((e as any)?.target?.files?.length < 1) {
        return;
      }
    }
    let finalImages: UploadedMedia[] = [];
    setImageLoading(true);
    if (canvas) {
      try {
        const compressedImage = await compressImageFiles(e as File);
        const response = await fetch("/api/ipfs", {
          method: "POST",
          body: compressedImage as any,
        });
        let cid = await response.json();
        finalImages.push({
          cid: String(cid?.cid),
          type: MediaType.Image,
        });
        setMappedFeaturedFiles([...finalImages]);
      } catch (err: any) {
        console.error(err.message);
      }
      setImageLoading(false);
    } else {
      if (fileLimitAlert((e as any).target.files[0])) {
        setImageLoading(false);
        return;
      }
      Array.from(((e as FormEvent).target as HTMLFormElement)?.files).map(
        async (file: any, index: number) => {
          try {
            const compressedImage = await compressImageFiles(
              (e as any).target.files[index] as File
            );
            const response = await fetch("/api/ipfs", {
              method: "POST",
              body: compressedImage as any,
            });
            if (response.status !== 200) {
              setImageLoading(false);
            } else {
              let cid = await response.json();
              finalImages.push({
                cid: String(cid?.cid),
                type: MediaType.Image,
              });
              if (
                finalImages?.length ===
                ((e as FormEvent).target as HTMLFormElement).files?.length
              ) {
                let newArr = [...(imagesUploaded as any), ...finalImages];
                setMappedFeaturedFiles(newArr);
                const postStorage = JSON.parse(getCommentData() || "{}");
                setCommentData(
                  JSON.stringify({
                    ...postStorage,
                    images: newArr,
                  })
                );
                setImageLoading(false);
              }
            }
          } catch (err: any) {
            console.error(err.message);
          }
        }
      );
    }
  };

  const uploadVideo = async (e: FormEvent) => {
    try {
      if ((e as any).target.files.length < 1) {
        return;
      }
      if (videoLimitAlert((e as any).target.files[0])) {
        return;
      }
      setVideoLoading(true);
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: (e.target as HTMLFormElement).files[0],
      });
      let cid = await response.json();
      let newArr = [
        ...(imagesUploaded as any),
        { cid: String(cid?.cid), type: MediaType.Video },
      ];
      setMappedFeaturedFiles(newArr);
      const postStorage = JSON.parse(getCommentData() || "{}");
      setCommentData(
        JSON.stringify({
          ...postStorage,
          images: newArr,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoLoading(false);
  };

  const handleRemoveImage = (image: UploadedMedia): void => {
    const cleanedArray = lodash.filter(
      imagesUploaded,
      (uploaded) => uploaded.cid !== image.cid
    );
    setMappedFeaturedFiles(cleanedArray);
    const postStorage = JSON.parse(getCommentData() || "{}");
    setCommentData(
      JSON.stringify({
        ...postStorage,
        images: cleanedArray,
      })
    );
  };

  useEffect(() => {
    if (mappedFeaturedFiles.length > 3) {
      setMappedFeaturedFiles(mappedFeaturedFiles.slice(0, 4));
      dispatch(setPostImages(mappedFeaturedFiles.slice(0, 4)));
    } else {
      dispatch(setPostImages(mappedFeaturedFiles));
    }
  }, [mappedFeaturedFiles]);

  return {
    uploadImage,
    imageLoading,
    mappedFeaturedFiles,
    handleRemoveImage,
    videoLoading,
    uploadVideo,
  };
};

export default useImageUpload;
