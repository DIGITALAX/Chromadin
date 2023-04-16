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

const useChannels = (): UseChannelsResults => {
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const channelsDispatched = useSelector(
    (state: RootState) => state.app.channelsReducer.value
  );
  const dispatch = useDispatch();
  const [videos, setVideos] = useState<Publication[]>([]);
  const [liked, setLiked] = useState<boolean[]>([]);
  const [mirrored, setMirrored] = useState<boolean[]>([]);
  const [tab, setTab] = useState<number>(0);
  const [videosLoading, setVideosLoading] = useState<boolean>(false);

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
      dispatch(setChannelsRedux(sortedArr.reverse()));
      setVideos(sortedArr);
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
        hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        setMirrored(hasMirroredArr);
      }
      dispatch(
        setMainVideo({
          actionVideo: `${INFURA_GATEWAY}/ipfs/${
            sortedArr[0]?.metadata?.media[0]?.original?.url?.split("ipfs://")[1]
          }`,
          actionCollected: sortedArr[0]?.hasCollectedByMe,
          actionLiked: hasReactedArr?.hasReactedArr?.[0],
          actionMirrored: hasMirroredArr?.[0],
          actionId: sortedArr[0].id,
          actionLocal: `${json[0].link}`,
        })
      );
    } catch (err: any) {
      setVideosLoading(false);
      console.error(err.message);
    }
    setVideosLoading(false);
  };

  useEffect(() => {
    if (!channelsDispatched || channelsDispatched.length < 1) {
      getVideos();
    }
  }, [lensProfile]);

  return { videos, liked, mirrored, tab, setTab, videosLoading };
};

export default useChannels;
