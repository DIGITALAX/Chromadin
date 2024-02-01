import getBuyerHistory, {
  getBuyerHistorySpecific,
} from "@/graphql/subgraph/queries/getBuyerHistory";
import { useEffect, useState } from "react";
import { History, Options } from "../types/interactions.types";
import getDefaultProfile from "@/graphql/lens/queries/getDefaultProfile";
import { AnyAction, Dispatch } from "redux";
import { getOneCollectionById } from "@/graphql/subgraph/queries/getAllCollections";
import {
  HistoryDataState,
  setHistoryDataRedux,
} from "@/redux/reducers/historyDataReducer";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";

const useHistory = (
  address: `0x${string}` | undefined,
  dispatch: Dispatch<AnyAction>,
  historyURL: string,
  options: Options,
  indexModal: string | undefined,
  historyData: HistoryDataState
) => {
  const [historySwitch, setHistorySwitch] = useState<boolean>(false);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);

  const getUserHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await getBuyerHistory(12, 0);
      const data = res.data.tokensBoughts || [];

      if (data.length > 0) {
        const history = await Promise.all(
          data.map(async (history: History) => {
            const defaultProfile = await getDefaultProfile({
              for: history.buyer,
            });
            const col = await getOneCollectionById(
              history?.subOrderCollectionIds?.[0]
            );
            let collection = col?.data?.collectionCreateds?.[0];

            if (!collection?.collectionMetadata) {
              const data = await fetchIPFSJSON(collection?.uri);
              collection = {
                ...collection,
                collectionMetadata: {
                  ...data,
                  mediaTypes: data?.mediaTypes?.[0],
                },
              };
            }

            if (!collection?.dropMetadata) {
              const data = await fetchIPFSJSON(collection?.dropURI);
              collection = {
                ...collection,
                dropMetadata: {
                  ...data,
                },
              };
            }

            return {
              ...history,
              collection,
              profile: defaultProfile?.data?.defaultProfile,
            };
          })
        );

        dispatch(
          setHistoryDataRedux({
            actionBuyerHistory: history,
            actionAllHistory: historyData.allHistory,
            actionHasMoreBuyerHistory: history?.length == 12 ? true : false,
            actionHasMoreHistory: historyData.hasMoreAllHistory,
            actionAllSkip: historyData.allSkip,
            actionBuyerSkip: history?.length == 12 ? 12 : 0,
          })
        );
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
      const res = await getBuyerHistorySpecific(address as string, 12, 0);
      const data = res.data.tokensBoughts || [];

      if (data.length > 0) {
        const history = await Promise.all(
          data.map(async (history: History) => {
            const defaultProfile = await getDefaultProfile({
              for: history.buyer,
            });
            const col = await getOneCollectionById(
              history?.subOrderCollectionIds?.[0]
            );
            let collection = col?.data?.collectionCreateds?.[0];

            if (!collection?.collectionMetadata) {
              const data = await fetchIPFSJSON(collection?.uri);
              collection = {
                ...collection,
                collectionMetadata: {
                  ...data,
                  mediaTypes: data?.mediaTypes?.[0],
                },
              };
            }

            if (!collection?.dropMetadata) {
              const data = await fetchIPFSJSON(collection?.dropURI);
              collection = {
                ...collection,
                dropMetadata: {
                  ...data,
                },
              };
            }
            return {
              ...history,
              collection,
              profile: defaultProfile?.data?.defaultProfile,
            };
          })
        );

        dispatch(
          setHistoryDataRedux({
            actionAllHistory: history,
            actionBuyerHistory: historyData.buyerHistory,
            actionHasMoreHistory: history?.length == 12 ? true : false,
            actionHasMoreBuyerHistory: historyData.hasMoreBuyerHistory,
            actionBuyerSkip: historyData.buyerSkip,
            actionAllSkip: history?.length == 12 ? 12 : 0,
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setHistoryLoading(false);
  };

  const getMoreUserHistory = async () => {
    if (!historyData?.hasMoreAllHistory) {
      return;
    }
    let data;
    try {
      const res = await getBuyerHistory(12, historyData.allSkip);
      data = res?.data?.tokensBoughts;

      if (data.length > 0) {
        const history = await Promise.all(
          data.map(async (history: History) => {
            const defaultProfile = await getDefaultProfile({
              for: history.buyer,
            });
            const col = await getOneCollectionById(
              history?.subOrderCollectionIds?.[0]
            );
            let collection = col?.data?.collectionCreateds?.[0];

            if (!collection?.collectionMetadata) {
              const data = await fetchIPFSJSON(collection?.uri);
              collection = {
                ...collection,
                collectionMetadata: {
                  ...data,
                  mediaTypes: data?.mediaTypes?.[0],
                },
              };
            }

            if (!collection?.dropMetadata) {
              const data = await fetchIPFSJSON(collection?.dropURI);
              collection = {
                ...collection,
                dropMetadata: {
                  ...data,
                },
              };
            }
            return {
              ...history,
              collection,
              profile: defaultProfile?.data?.defaultProfile,
            };
          })
        );

        dispatch(
          setHistoryDataRedux({
            actionAllHistory: [...historyData?.allHistory, ...history],
            actionBuyerHistory: historyData.buyerHistory,
            actionHasMoreHistory: history?.length == 12 ? true : false,
            actionHasMoreBuyerHistory: historyData.hasMoreBuyerHistory,
            actionBuyerSkip: historyData.buyerSkip,
            actionAllSkip:
              history?.length == 12 ? historyData?.allSkip + 12 : 0,
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMoreBuyerHistory = async () => {
    if (!historyData?.hasMoreBuyerHistory) {
      return;
    }

    try {
      const res = await getBuyerHistorySpecific(
        address as string,
        12,
        historyData?.buyerSkip
      );
      const data = res?.data?.tokensBoughts;

      if (data.length > 0) {
        const history = await Promise.all(
          data.map(async (history: History) => {
            const defaultProfile = await getDefaultProfile({
              for: history.buyer,
            });
            const col = await getOneCollectionById(
              history?.subOrderCollectionIds?.[0]
            );
            let collection = col?.data?.collectionCreateds?.[0];

            if (!collection?.collectionMetadata) {
              const data = await fetchIPFSJSON(collection?.uri);
              collection = {
                ...collection,
                collectionMetadata: {
                  ...data,
                  mediaTypes: data?.mediaTypes?.[0],
                },
              };
            }

            if (!collection?.dropMetadata) {
              const data = await fetchIPFSJSON(collection?.dropURI);
              collection = {
                ...collection,
                dropMetadata: {
                  ...data,
                },
              };
            }
            return {
              ...history,
              collection,
              profile: defaultProfile?.data?.defaultProfile,
            };
          })
        );
        dispatch(
          setHistoryDataRedux({
            actionBuyerHistory: [...historyData?.buyerHistory, ...history],
            actionAllHistory: historyData.allHistory,
            actionHasMoreBuyerHistory: history?.length == 12 ? true : false,
            actionHasMoreHistory: historyData.hasMoreAllHistory,
            actionAllSkip: historyData.allSkip,
            actionBuyerSkip:
              history?.length == 12 ? historyData?.buyerSkip + 12 : 0,
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      options === Options.History &&
      ((!historySwitch && historyData?.allHistory?.length < 1) ||
        indexModal === "Purchase Successful" ||
        (historySwitch && historyData?.buyerHistory?.length < 1))
    ) {
      if (historySwitch) {
        getHistorySpecific();
      } else {
        getUserHistory();
      }
    }
  }, [options, indexModal, historyURL, address, historySwitch]);

  return {
    historyLoading,
    historySwitch,
    setHistorySwitch,
    getMoreUserHistory,
    getMoreBuyerHistory,
  };
};

export default useHistory;
