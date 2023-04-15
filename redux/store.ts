import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import authStatusReducer from "./reducers/authStatusSlice";
import lensProfileReducer from "./reducers/lensProfileSlice";
import mainVideoReducer from "./reducers/mainVideoSlice";
import viewReducer from "./reducers/viewSlice";
import mainNFTReducer from "./reducers/mainNFTSlice";
import indexModalReducer from "./reducers/indexModalSlice";
import dispatcherReducer from "./reducers/dispatcherSlice";
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

const reducer = combineReducers({
  authStatusReducer,
  lensProfileReducer,
  mainVideoReducer,
  viewReducer,
  mainNFTReducer,
  indexModalReducer,
  dispatcherReducer,
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
