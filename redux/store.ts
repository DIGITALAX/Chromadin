import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import lensProfileReducer from "./reducers/lensProfileSlice";
import viewReducer from "./reducers/viewSlice";
import indexModalReducer from "./reducers/indexModalSlice";
import optionsReducer from "./reducers/optionsSlice";
import oracleDataReducer from "./reducers/oracleDataSlice";
import followCollectReducer from "./reducers/followCollectSlice";
import modalReducer from "./reducers/modalSlice";
import postCollectGifReducer from "./reducers/postCollectGifSlice";
import noHandleReducer from "./reducers/noHandleSlice";
import imageViewerReducer from "./reducers/imageViewerSlice";
import channelsReducer from "./reducers/channelsSlice";
import errorReducer from "./reducers/errorSlice";
import successReducer from "./reducers/successSlice";
import samplerReducer from "./reducers/samplerSlice";
import isCreatorReducer from "./reducers/isCreatorSlice";
import filterReducer from "./reducers/filterSlice";
import whoReducer from "./reducers/whoSlice";
import fullScreenVideoReducer from "./reducers/fullScreenVideoSlice";
import quickProfilesReducer from "./reducers/quickProfilesSlice";
import historyURLReducer from "./reducers/historyURLSlice";
import superFollowReducer from "./reducers/superFollowSlice";
import rainReducer from "./reducers/rainSlice";
import makePostReducer from "./reducers/makePostSlice";
import collectionInfoReducer from "./reducers/collectionInfoSlice";
import videoInfoReducer from "./reducers/videoInfoSlice";
import historyDataReducer from "./reducers/historyDataReducer";
import walletConnectedReducer from "./reducers/walletConnectedSlice";
import enabledCurrenciesReducer from "./reducers/enabledCurrenciesSlice";

const reducer = combineReducers({
  lensProfileReducer,
  viewReducer,
  indexModalReducer,
  optionsReducer,
  modalReducer,
  noHandleReducer,
  imageViewerReducer,
  channelsReducer,
  errorReducer,
  successReducer,
  samplerReducer,
  isCreatorReducer,
  fullScreenVideoReducer,
  quickProfilesReducer,
  historyURLReducer,
  superFollowReducer,
  rainReducer,
  makePostReducer,
  whoReducer,
  collectionInfoReducer,
  videoInfoReducer,
  historyDataReducer,
  walletConnectedReducer,
  oracleDataReducer,
  filterReducer,
  enabledCurrenciesReducer,
  postCollectGifReducer,
  followCollectReducer,
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
