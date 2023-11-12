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
import productTypeReducer from "./reducers/productTypeSlice";
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
import historyReducer from "./reducers/historySlice";
import ratesReducer from "./reducers/ratesSlice";
import statsReducer from "./reducers/statsSlice";
import piesReducer from "./reducers/piesSlice";
import graphReducer from "./reducers/graphSlice";
import nftScreenReducer from "./reducers/nftScreenSlice";
import isCreatorReducer from "./reducers/isCreatorSlice";
import priceFilterReducer from "./reducers/priceFilterSlice";
import dateFilterReducer from "./reducers/dateFilterSlice";
import dropsReducer from "./reducers/dropsSlice";
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
import scrollPosReducer from "./reducers/scrollPosSlice";
import individualFeedCountReducer from "./reducers/individualFeedCountReducer";
import fullScreenVideoReducer from "./reducers/fullScreenVideoSlice";
import videoSyncReducer from "./reducers/videoSyncSlice";
import seekSecondReducer from "./reducers/seekSecondSlice";
import videoCountReducer from "./reducers/videoCountSlice";
import profileReducer from "./reducers/profileSlice";
import profileFeedCountReducer from "./reducers/profileFeedCountSlice";
import profileFeedReducer from "./reducers/profileFeedSlice";
import profilePaginatedReducer from "./reducers/profilePaginatedSlice";
import profileScrollPosReducer from "./reducers/profileScrollPosSlice";
import quickProfilesReducer from "./reducers/quickProfilesSlice";
import historyURLReducer from "./reducers/historyURLSlice";
import superFollowReducer from "./reducers/superFollowSlice";
import rainReducer from "./reducers/rainSlice";
import makePostReducer from "./reducers/makePostSlice";
import publicationImageReducer from "./reducers/publicationImageSlice";
import postSentReducer from "./reducers/postSentSlice";
import decryptReducer from "./reducers/decryptSlice";
import filterDecryptReducer from "./reducers/filterDecryptSlice";
import decryptFeedCountReducer from "./reducers/decryptFeedCountSlice";
import decryptFeedReducer from "./reducers/decryptFeedSlice";
import decryptPaginatedReducer from "./reducers/decryptPaginatedSlice";
import decryptScrollPosReducer from "./reducers/decryptScrollPosSlice";
import decryptProfileFeedCountReducer from "./reducers/decryptProfileCountSlice";
import decryptProfileFeedReducer from "./reducers/decryptProfileFeedSlice";
import decryptProfilePaginatedReducer from "./reducers/decryptProfilePaginatedSlice";
import decryptProfileScrollPosReducer from "./reducers/decryptProfileScrollPosSlice";
import collectionPaginatedReducer from "./reducers/collectionPaginatedSlice";
import buyerHistoryReducer from "./reducers/buyerHistorySlice";
import IPFSReducer from "./reducers/IPFSSlice";
import hasMoreVideosReducer from "./reducers/hasMoreVideosSlice";
import hasMoreCollectionReducer from "./reducers/hasMoreCollectionSlice";
import hasMoreHistoryReducer from "./reducers/hasMoreHistoryReducer";
import historyPaginationReducer from "./reducers/historyPaginationSlice";
import buyerHistoryPaginationReducer from "./reducers/buyerHistoryPaginationSlice";
import hasMoreBuyerHistoryReducer from "./reducers/hasMoreBuyerHistorySlice";
import autoCollectionReducer from "./reducers/autoCollectionSlice";
import imageLoadingReducer from "./reducers/imageLoadingSlice";
import autoDropReducer from "./reducers/autoDropSlice";
import autographReducer from "./reducers/autographSlice";
import fulfillmentDetailsReducer from "./reducers/fulfillmentDetailsSlice";
import encryptedInformationReducer from "./reducers/encryptedInformationSlice";
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
  productTypeReducer,
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
  historyReducer,
  ratesReducer,
  piesReducer,
  statsReducer,
  graphReducer,
  isCreatorReducer,
  priceFilterReducer,
  dateFilterReducer,
  dropsReducer,
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
  scrollPosReducer,
  individualFeedCountReducer,
  fullScreenVideoReducer,
  videoSyncReducer,
  seekSecondReducer,
  videoCountReducer,
  profileReducer,
  profileFeedCountReducer,
  profileFeedReducer,
  profilePaginatedReducer,
  profileScrollPosReducer,
  quickProfilesReducer,
  historyURLReducer,
  superFollowReducer,
  rainReducer,
  makePostReducer,
  publicationImageReducer,
  postSentReducer,
  decryptReducer,
  filterDecryptReducer,
  decryptFeedCountReducer,
  decryptFeedReducer,
  decryptPaginatedReducer,
  decryptScrollPosReducer,
  decryptProfileFeedCountReducer,
  decryptProfileFeedReducer,
  decryptProfilePaginatedReducer,
  decryptProfileScrollPosReducer,
  collectionPaginatedReducer,
  buyerHistoryReducer,
  IPFSReducer,
  hasMoreVideosReducer,
  hasMoreCollectionReducer,
  hasMoreHistoryReducer,
  historyPaginationReducer,
  buyerHistoryPaginationReducer,
  hasMoreBuyerHistoryReducer,
  autoCollectionReducer,
  imageLoadingReducer,
  autoDropReducer,
  autographReducer,
  fulfillmentDetailsReducer,
  connectedReducer,
  encryptedInformationReducer,
  nftScreenReducer,
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
