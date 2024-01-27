import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import lensProfileReducer from "./reducers/lensProfileSlice";
import mainVideoReducer from "./reducers/mainVideoSlice";
import viewReducer from "./reducers/viewSlice";
import mainNFTReducer from "./reducers/mainNFTSlice";
import indexModalReducer from "./reducers/indexModalSlice";
import postImageReducer from "./reducers/postImageSlice";
import collectValueTypeReducer from "./reducers/collectValueTypeSlice";
import optionsReducer from "./reducers/optionsSlice";
import oracleDataReducer from "./reducers/oracleDataSlice";
import collectionsReducer from "./reducers/collectionsSlice";
import modalReducer from "./reducers/modalSlice";
import purchaseReducer from "./reducers/purchaseSlice";
import approvalArgsReducer from "./reducers/approvalArgsSlice";
import postCollectReducer from "./reducers/postCollectSlice";
import followerOnlyReducer from "./reducers/followerOnlySlice";
import noHandleReducer from "./reducers/noHandleSlice";
import imageViewerReducer from "./reducers/imageViewerSlice";
import channelsReducer from "./reducers/channelsSlice";
import collectOpenReducer from "./reducers/collectOpenSlice";
import reactIdReducer from "./reducers/reactIdSlice";
import secondaryCommentReducer from "./reducers/secondaryCommentSlice";
import errorReducer from "./reducers/errorSlice";
import successReducer from "./reducers/successSlice";
import ratesReducer from "./reducers/ratesSlice";
import statsReducer from "./reducers/statsSlice";
import piesReducer from "./reducers/piesSlice";
import graphReducer from "./reducers/graphSlice";
import isCreatorReducer from "./reducers/isCreatorSlice";
import priceFilterReducer from "./reducers/priceFilterSlice";
import dateFilterReducer from "./reducers/dateFilterSlice";
import commentFeedCountReducer from "./reducers/commentFeedCountSlice";
import reactionFeedCountReducer from "./reducers/reactionFeedCountSlice";
import reactionStateReducer from "./reducers/reactionStateSlice";
import openCommentReducer from "./reducers/openCommentSlice";
import feedTypeReducer from "./reducers/feedTypeSlice";
import imageFeedViewerReducer from "./reducers/imageFeedViewerSlice";
import feedReactIdReducer from "./reducers/feedReactIdSlice";
import feedReducer from "./reducers/feedSlice";
import commentReducer from "./reducers/commentSlice";
import paginatedReducer from "./reducers/paginatedSlice";
import individualFeedCountReducer from "./reducers/individualFeedCountReducer";
import fullScreenVideoReducer from "./reducers/fullScreenVideoSlice";
import videoSyncReducer from "./reducers/videoSyncSlice";
import seekSecondReducer from "./reducers/seekSecondSlice";
import videoCountReducer from "./reducers/videoCountSlice";
import profileReducer from "./reducers/profileSlice";
import profileFeedCountReducer from "./reducers/profileFeedCountSlice";
import profileFeedReducer from "./reducers/profileFeedSlice";
import profilePaginatedReducer from "./reducers/profilePaginatedSlice";
import quickProfilesReducer from "./reducers/quickProfilesSlice";
import historyURLReducer from "./reducers/historyURLSlice";
import superFollowReducer from "./reducers/superFollowSlice";
import rainReducer from "./reducers/rainSlice";
import makePostReducer from "./reducers/makePostSlice";
import publicationImageReducer from "./reducers/publicationImageSlice";
import postSentReducer from "./reducers/postSentSlice";
import collectionPaginatedReducer from "./reducers/collectionPaginatedSlice";
import IPFSReducer from "./reducers/IPFSSlice";
import hasMoreVideosReducer from "./reducers/hasMoreVideosSlice";
import hasMoreCollectionReducer from "./reducers/hasMoreCollectionSlice";
import historyDataReducer from "./reducers/hasMoreHistoryReducer";
import imageLoadingReducer from "./reducers/imageLoadingSlice";
import connectedReducer from "./reducers/connectedSlice";

const reducer = combineReducers({
  lensProfileReducer,
  mainVideoReducer,
  viewReducer,
  mainNFTReducer,
  indexModalReducer,
  postImageReducer,
  collectValueTypeReducer,
  optionsReducer,
  collectionsReducer,
  modalReducer,
  purchaseReducer,
  approvalArgsReducer,
  postCollectReducer,
  followerOnlyReducer,
  noHandleReducer,
  imageViewerReducer,
  channelsReducer,
  collectOpenReducer,
  reactIdReducer,
  secondaryCommentReducer,
  errorReducer,
  successReducer,
  ratesReducer,
  piesReducer,
  statsReducer,
  graphReducer,
  isCreatorReducer,
  priceFilterReducer,
  dateFilterReducer,
  feedTypeReducer,
  openCommentReducer,
  reactionStateReducer,
  commentFeedCountReducer,
  reactionFeedCountReducer,
  imageFeedViewerReducer,
  feedReactIdReducer,
  feedReducer,
  commentReducer,
  paginatedReducer,
  individualFeedCountReducer,
  fullScreenVideoReducer,
  videoSyncReducer,
  seekSecondReducer,
  videoCountReducer,
  profileReducer,
  profileFeedCountReducer,
  profileFeedReducer,
  profilePaginatedReducer,
  quickProfilesReducer,
  historyURLReducer,
  superFollowReducer,
  rainReducer,
  makePostReducer,
  publicationImageReducer,
  postSentReducer,
  collectionPaginatedReducer,
  IPFSReducer,
  hasMoreVideosReducer,
  hasMoreCollectionReducer,
  historyDataReducer,
  imageLoadingReducer,
  connectedReducer,
  oracleDataReducer,
});

export const store = configureStore({
  reducer: {
    app: reducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
