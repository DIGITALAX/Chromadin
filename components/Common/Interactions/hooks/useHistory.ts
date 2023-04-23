import getBuyerHistory from "@/graphql/subgraph/queries/getBuyerHistory";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { History, useHistoryResults } from "../types/interactions.types";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import getDefaultProfile from "@/graphql/lens/queries/getDefaultProfile";
import { setHistoryRedux } from "@/redux/reducers/historySlice";

const useHistory = (): useHistoryResults => {
  const { address } = useAccount();
  const dispatch = useDispatch();
  const historyReducer = useSelector(
    (state: RootState) => state.app.historyReducer.value
  );
  const [history, setHistory] = useState<History[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const options = useSelector(
    (state: RootState) => state.app.optionsReducer.value
  );
  const indexModal = useSelector(
    (state: RootState) => state.app.indexModalReducer.message
  );

  const getUserHistory = async () => {
    if (!address) return;
    setHistoryLoading(true);
    try {
      const res = await getBuyerHistory({
        buyer_contains: address,
      });
      if (res.data.tokensBoughts.length > 0) {
        const history = await Promise.all(
          res.data.tokensBoughts.map(async (history: History) => {
            const json = await fetchIPFSJSON(
              (history.uri as any)
                ?.split("ipfs://")[1]
                ?.replace(/"/g, "")
                ?.trim()
            );
            let defaultProfile;
            defaultProfile = await getDefaultProfile(history.creator);
            if (!defaultProfile?.data?.defaultProfile) {
              defaultProfile = {
                handle: "syntheticfutures.lens",
                picture: {
                  original: {
                    url: "ipfs://Qmd7PdjsVSfVs6j4uFbxZLsHmzkJw2DYQLxbmgX7aDWkb3",
                  },
                },
              };
            } else {
              defaultProfile = defaultProfile?.data?.defaultProfile;
            }
            return {
              ...history,
              uri: json,
              profile: defaultProfile,
            };
          })
        );
        dispatch(setHistoryRedux(history));
        setHistory(history);
      }
    } catch (err: any) {
      setHistoryLoading(false);
      console.error(err.message);
    }
    setHistoryLoading(false);
  };

  useEffect(() => {
    if (
      options === "history" &&
      (historyReducer.length < 1 || indexModal === "Purchase Successful")
    ) {
      getUserHistory();
    }
  }, [options, indexModal]);

  return { history, historyLoading };
};

export default useHistory;
