import getBuyerHistory, {
  getBuyerHistorySpecific,
  getBuyerHistorySpecificUpdated,
  getBuyerHistoryUpdated,
} from "@/graphql/subgraph/queries/getBuyerHistory";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { History, useHistoryResults } from "../types/interactions.types";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import getDefaultProfile from "@/graphql/lens/queries/getDefaultProfile";
import { setHistoryRedux } from "@/redux/reducers/historySlice";
import { useAccount } from "wagmi";
import { setBuyerHistoryRedux } from "@/redux/reducers/buyerHistorySlice";
import { setHistoryPaginated } from "@/redux/reducers/historyPaginationSlice";
import { setHasMoreHistorysRedux } from "@/redux/reducers/hasMoreHistoryReducer";
import { setBuyerHistoryPaginated } from "@/redux/reducers/buyerHistoryPaginationSlice";
import { setHasMoreBuyerHistorysRedux } from "@/redux/reducers/hasMoreBuyerHistorySlice";
import { INFURA_GATEWAY } from "@/lib/constants";

const useHistory = (): useHistoryResults => {
  const { address } = useAccount();
  const dispatch = useDispatch();
  const historyReducer = useSelector(
    (state: RootState) => state.app.historyReducer.value
  );
  const buyerHistoryReducer = useSelector(
    (state: RootState) => state.app.buyerHistoryReducer.value
  );
  const [historySwitch, setHistorySwitch] = useState<boolean>(false);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [moreHistoryLoading, setMoreHistoryLoading] = useState<boolean>(false);
  const options = useSelector(
    (state: RootState) => state.app.optionsReducer.value
  );
  const indexModal = useSelector(
    (state: RootState) => state.app.indexModalReducer.message
  );
  const historyPagination = useSelector(
    (state: RootState) => state.app.historyPaginationReducer
  );
  const buyerPagination = useSelector(
    (state: RootState) => state.app.buyerHistoryPaginationReducer
  );
  const hasMoreUserHistory = useSelector(
    (state: RootState) => state.app.hasMoreHistoryReducer.value
  );
  const hasMoreBuyerHistory = useSelector(
    (state: RootState) => state.app.hasMoreBuyerHistoryReducer.value
  );

  const getUserHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await getBuyerHistoryUpdated(12, 0);
      let data = res.data.updatedChromadinMarketTokensBoughts;
      if (data?.length < 12) {
        const res = await getBuyerHistory(12, 0);
        data = [...data, ...(res.data.tokensBoughts || [])];
        dispatch(
          setHasMoreHistorysRedux({
            old: true,
            new: false,
          })
        );
      } else {
        dispatch(
          setHasMoreHistorysRedux({
            old: true,
            new: true,
          })
        );
      }

      if (data.length > 0) {
        const history = await Promise.all(
          data.map(async (history: History) => {
            const json = await fetchIPFSJSON(
              (history.uri as any)
                ?.split("ipfs://")[1]
                ?.replace(/"/g, "")
                ?.trim()
            );

            const type = await fetch(
              `${INFURA_GATEWAY}/ipfs/${json.image?.split("ipfs://")[1]}`,
              { method: "HEAD" }
            ).then((response) => {
              if (response.ok) {
                return response.headers.get("Content-Type");
              }
            });

            const defaultProfile = await getDefaultProfile({
              for: history.creator,
            });
            return {
              ...history,
              uri: {
                ...json,
                type,
              },
              profile: defaultProfile?.data?.defaultProfile,
            };
          })
        );

        dispatch(setHistoryRedux(history));
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setHistoryLoading(false);
  };

  const getHistorySpecific = async () => {
    if (!address) return;
    setHistoryLoading(true);
    try {
      const res = await getBuyerHistorySpecificUpdated(
        address as string,
        12,
        0
      );
      let data = res.data.updatedChromadinMarketTokensBoughts;
      if (data.length < 12) {
        const res = await getBuyerHistorySpecific(address as string, 12, 0);
        data = [...data, ...(res.data.tokensBoughts || [])];
        dispatch(
          setHasMoreBuyerHistorysRedux({
            old: true,
            new: false,
          })
        );
      } else {
        dispatch(
          setHasMoreBuyerHistorysRedux({
            old: true,
            new: true,
          })
        );
      }
      if (data.length > 0) {
        const history = await Promise.all(
          data.map(async (history: History) => {
            const json = await fetchIPFSJSON(
              (history.uri as any)
                ?.split("ipfs://")[1]
                ?.replace(/"/g, "")
                ?.trim()
            );

            const type = await fetch(
              `${INFURA_GATEWAY}/ipfs/${json.image?.split("ipfs://")[1]}`,
              { method: "HEAD" }
            ).then((response) => {
              if (response.ok) {
                return response.headers.get("Content-Type");
              }
            });

            const defaultProfile = await getDefaultProfile({
              for: history.creator,
            });
            return {
              ...history,
              uri: {
                ...json,
                type,
              },
              profile: defaultProfile?.data?.defaultProfile,
            };
          })
        );

        dispatch(setBuyerHistoryRedux(history));
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setHistoryLoading(false);
  };

  const getMoreUserHistory = async () => {
    if (
      moreHistoryLoading ||
      (!hasMoreUserHistory.old && !hasMoreUserHistory.new)
    ) {
      return;
    }
    setMoreHistoryLoading(true);
    let data;
    try {
      if (hasMoreUserHistory.new) {
        const res = await getBuyerHistoryUpdated(
          historyPagination.first,
          historyPagination.skip
        );
        data = res.data.updatedChromadinMarketTokensBoughts;
        if (data?.length < 12) {
          const res = await getBuyerHistory(
            historyPagination.first,
            historyPagination.skip
          );
          data = [...data, ...(res?.data?.tokensBoughts || [])];
          dispatch(
            setHasMoreHistorysRedux({
              old: true,
              new: false,
            })
          );
        } else {
          dispatch(
            setHasMoreHistorysRedux({
              old: true,
              new: true,
            })
          );
        }
      } else {
        const res = await getBuyerHistory(
          historyPagination.first,
          historyPagination.skip
        );
        data = res?.data?.tokensBoughts;
        if (data?.length < 12) {
          dispatch(
            setHasMoreHistorysRedux({
              old: false,
              new: false,
            })
          );
        } else {
          dispatch(
            setHasMoreHistorysRedux({
              old: true,
              new: false,
            })
          );
        }
      }

      if (data.length > 0) {
        const history = await Promise.all(
          data.map(async (history: History) => {
            const json = await fetchIPFSJSON(
              (history.uri as any)
                ?.split("ipfs://")[1]
                ?.replace(/"/g, "")
                ?.trim()
            );

            const type = await fetch(
              `${INFURA_GATEWAY}/ipfs/${json.image?.split("ipfs://")[1]}`,
              { method: "HEAD" }
            ).then((response) => {
              if (response.ok) {
                return response.headers.get("Content-Type");
              }
            });

            const defaultProfile = await getDefaultProfile({
              for: history.creator,
            });
            return {
              ...history,
              uri: {
                ...json,
                type,
              },
              profile: defaultProfile?.data?.defaultProfile,
            };
          })
        );

        dispatch(setHistoryRedux([...historyReducer, ...history]));
        dispatch(
          setHistoryPaginated({
            actionFirst: historyPagination.first,
            actionSkip: historyPagination.skip + 12,
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setMoreHistoryLoading(false);
  };

  const getMoreBuyerHistory = async () => {
    if (
      moreHistoryLoading ||
      (!hasMoreBuyerHistory.new && !hasMoreBuyerHistory.old)
    ) {
      return;
    }
    setMoreHistoryLoading(true);
    try {
      let data;
      if (hasMoreBuyerHistory.new) {
        const res = await getBuyerHistorySpecificUpdated(
          address as string,
          buyerPagination.first,
          buyerPagination.skip
        );
        data = res?.data?.updatedChromadinMarketTokensBoughts;
        if (data?.length < 12) {
          const res = await getBuyerHistorySpecific(
            address as string,
            buyerPagination.first,
            buyerPagination.skip
          );
          data = [...data, ...(res?.data?.tokensBoughts || [])];
          dispatch(
            setHasMoreBuyerHistorysRedux({
              old: true,
              new: false,
            })
          );
        } else {
          dispatch(
            setHasMoreBuyerHistorysRedux({
              old: true,
              new: true,
            })
          );
        }
      } else {
        const res = await getBuyerHistorySpecific(
          address as string,
          buyerPagination.first,
          buyerPagination.skip
        );
        data = res?.data?.tokensBoughts;

        if (data?.length < 12) {
          dispatch(
            setHasMoreBuyerHistorysRedux({
              old: false,
              new: false,
            })
          );
        } else {
          dispatch(
            setHasMoreBuyerHistorysRedux({
              old: true,
              new: false,
            })
          );
        }
      }

      if (data.length > 0) {
        const history = await Promise.all(
          data.map(async (history: History) => {
            const json = await fetchIPFSJSON(
              (history.uri as any)
                ?.split("ipfs://")[1]
                ?.replace(/"/g, "")
                ?.trim()
            );

            const type = await fetch(
              `${INFURA_GATEWAY}/ipfs/${json.image?.split("ipfs://")[1]}`,
              { method: "HEAD" }
            ).then((response) => {
              if (response.ok) {
                return response.headers.get("Content-Type");
              }
            });

            const defaultProfile = await getDefaultProfile({
              for: history.creator,
            });
            return {
              ...history,
              uri: {
                ...json,
                type,
              },
              profile: defaultProfile?.data?.defaultProfile,
            };
          })
        );
        dispatch(setBuyerHistoryRedux(history));
        dispatch(
          setBuyerHistoryPaginated({
            actionFirst: buyerPagination.first,
            actionSkip: buyerPagination.skip + 12,
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setMoreHistoryLoading(false);
  };

  useEffect(() => {
    if (
      options === "history" &&
      ((!historySwitch && historyReducer.length < 1) ||
        indexModal === "Purchase Successful" ||
        (historySwitch && buyerHistoryReducer.length < 1))
    ) {
      if (historySwitch) {
        getHistorySpecific();
      } else {
        getUserHistory();
      }
    }
  }, [options, indexModal, history, address, historySwitch]);

  return {
    historyLoading,
    historySwitch,
    setHistorySwitch,
    getMoreUserHistory,
    getMoreBuyerHistory,
    moreHistoryLoading,
  };
};

export default useHistory;
