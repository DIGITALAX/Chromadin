import { useEffect, useState } from "react";
import { UseChannelsResults } from "../types/sidebar.types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  profilePublications,
  profilePublicationsAuth,
} from "@/graphql/lens/queries/getVideos";
import { Publication } from "@/components/Home/types/lens.types";
import checkPostReactions from "@/lib/helpers/checkPostReactions";
import checkIfMirrored from "@/lib/helpers/checkIfMirrored";
import { ApolloQueryResult } from "@apollo/client";
import { setMainVideo } from "@/redux/reducers/mainVideoSlice";
import { INFURA_GATEWAY } from "@/lib/constants";
import json from "./../../../../public/videos/local.json";
import { setChannelsRedux } from "@/redux/reducers/channelsSlice";
import lodash from "lodash";
import { setReactId } from "@/redux/reducers/reactIdSlice";

const useChannels = (): UseChannelsResults => {
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const mainVideo = useSelector(
    (state: RootState) => state.app.mainVideoReducer
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const channelsDispatched = useSelector(
    (state: RootState) => state.app.channelsReducer.value
  );
  const indexer = useSelector(
    (state: RootState) => state.app.indexModalReducer.message
  );
  const reactId = useSelector(
    (state: RootState) => state.app.reactIdReducer.value
  );
  const dispatch = useDispatch();
  const [videos, setVideos] = useState<Publication[]>([]);
  const [liked, setLiked] = useState<boolean[]>([]);
  const [collected, setCollected] = useState<boolean[]>([]);
  const [mirrored, setMirrored] = useState<boolean[]>([]);
  const [tab, setTab] = useState<number>(0);
  const [videosLoading, setVideosLoading] = useState<boolean>(false);
  const [mirrorAmount, setMirrorAmount] = useState<number[]>([]);
  const [likeAmount, setLikeAmount] = useState<number[]>([]);
  const [collectAmount, setCollectAmount] = useState<number[]>([]);

  const getVideos = async (): Promise<void> => {
    setVideosLoading(true);
    try {
      let data: ApolloQueryResult<any>, hasReactedArr, hasMirroredArr;
      if (authStatus && lensProfile) {
        data = await profilePublicationsAuth({
          profileId: "0x01c6a9",
          publicationTypes: ["POST"],
          limit: 30,
        });
      } else {
        data = await profilePublications({
          profileId: "0x01c6a9",
          publicationTypes: ["POST"],
          limit: 30,
        });
      }
      const arr: any[] = [...data?.data.publications?.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      const reversedArr = sortedArr.reverse();
      const lastTwo = reversedArr.splice(-2);
      [lastTwo[0], lastTwo[1]] = [lastTwo[1], lastTwo[0]];
      reversedArr.unshift(...lastTwo.reverse());
      dispatch(setChannelsRedux(reversedArr));
      setVideos(reversedArr);
      setCollected(reversedArr.map((obj: Publication) => obj.hasCollectedByMe));
      setMirrorAmount(
        reversedArr.map((obj: Publication) => obj.stats.totalAmountOfMirrors)
      );
      setCollectAmount(
        reversedArr.map((obj: Publication) => obj.stats.totalAmountOfCollects)
      );
      setLikeAmount(
        reversedArr.map((obj: Publication) => obj.stats.totalUpvotes)
      );
      if (authStatus && lensProfile) {
        hasReactedArr = await checkPostReactions(
          {
            profileId: "0x01c6a9",
            publicationTypes: ["POST"],
            limit: 30,
          },
          lensProfile
        );
        setLiked(hasReactedArr);
        hasMirroredArr = await checkIfMirrored(reversedArr, lensProfile);
        setMirrored(hasMirroredArr);
      }
      dispatch(
        setMainVideo({
          actionVideo: `${INFURA_GATEWAY}/ipfs/${
            reversedArr[0]?.metadata?.media[0]?.original?.url?.split(
              "ipfs://"
            )[1]
          }`,
          actionCollected: reversedArr[0]?.hasCollectedByMe,
          actionLiked: hasReactedArr?.[0],
          actionMirrored: hasMirroredArr?.[0],
          actionId: reversedArr[0].id,
          actionLocal: `${json[0].link}`,
        })
      );
    } catch (err: any) {
      setVideosLoading(false);
      console.error(err.message);
    }
    setVideosLoading(false);
  };

  const refetchInteractions = async () => {
    let data: ApolloQueryResult<any>;
    try {
      if (authStatus && lensProfile) {
        data = await profilePublicationsAuth({
          profileId: "0x01c6a9",
          publicationTypes: ["POST"],
          limit: 30,
        });
      } else {
        data = await profilePublications({
          profileId: "0x01c6a9",
          publicationTypes: ["POST"],
          limit: 30,
        });
      }
      const arr: any[] = [...data?.data.publications?.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      const reversedArr = sortedArr.reverse();
      const lastTwo = reversedArr.splice(-2);
      [lastTwo[0], lastTwo[1]] = [lastTwo[1], lastTwo[0]];
      reversedArr.unshift(...lastTwo.reverse());
      const hasReactedArr = await checkPostReactions(
        {
          profileId: "0x01c6a9",
          publicationTypes: ["POST"],
          limit: 30,
        },
        lensProfile
      );
      const hasMirroredArr = await checkIfMirrored(
        videos?.length > 0 ? videos : channelsDispatched,
        lensProfile
      );
      setLiked(hasReactedArr);
      const hasCollectedArr = reversedArr.map(
        (obj: Publication) => obj.hasCollectedByMe
      );
      setCollected(hasCollectedArr);
      setMirrored(hasMirroredArr);
      setMirrorAmount(
        reversedArr.map((obj: Publication) => obj.stats.totalAmountOfMirrors)
      );
      setCollectAmount(
        reversedArr.map((obj: Publication) => obj.stats.totalAmountOfCollects)
      );
      setLikeAmount(
        reversedArr.map((obj: Publication) => obj.stats.totalUpvotes)
      );
      if (reactId === mainVideo.id) {
        const currentIndex = lodash.findIndex(
          videos?.length > 0 ? videos : channelsDispatched,
          { id: reactId }
        );
        dispatch(
          setMainVideo({
            actionVideo: mainVideo.video,
            actionCollected: hasCollectedArr?.[currentIndex],
            actionLiked: hasReactedArr?.[currentIndex],
            actionMirrored: hasMirroredArr?.[currentIndex],
            actionId: mainVideo.id,
            actionLocal: mainVideo.local,
          })
        );
      }
      dispatch(setReactId(""));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (indexer === "Successfully Indexed" && reactId !== "") {
      refetchInteractions();
    }
  }, [indexer]);

  useEffect(() => {
    if (!channelsDispatched || channelsDispatched?.length < 1) {
      getVideos();
    }
  }, [lensProfile]);

  return {
    videos,
    liked,
    mirrored,
    tab,
    setTab,
    videosLoading,
    collected,
    likeAmount,
    collectAmount,
    mirrorAmount,
  };
};

export default useChannels;
