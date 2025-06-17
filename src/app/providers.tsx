"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { createContext, SetStateAction, useEffect, useState } from "react";
import {
  Account,
  BigDecimal,
  Context,
  DateTime,
  Post,
  PublicClient,
  SimpleCollectAction,
  mainnet,
} from "@lens-protocol/client";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { StorageClient } from "@lens-chain/storage-client";
import { chains } from "@lens-chain/sdk/viem";
import {
  CollectionInfo,
  Indexar,
  LensConnected,
  Options,
  VideoControls,
  VideoInfo,
  Viewer,
} from "./components/Common/types/common.types";
import {
  MediaImageMimeType,
  MediaVideoMimeType,
} from "@lens-protocol/metadata";
import { OracleData } from "./components/Market/types/market.types";
import { SimpleCollect } from "./components/Modals/types/modals.types";

export const config = createConfig(
  getDefaultConfig({
    appName: "Chromadin",
    walletConnectProjectId: process.env
      .NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
    appUrl: "https://chromadin.xyz/",
    appIcon: "https://chromadin.xyz/favicon.ico",
    chains: [chains.mainnet],
    transports: {
      [chains.mainnet.id]: http("https://rpc.lens.xyz"),
    },
    ssr: true,
  })
);

const queryClient = new QueryClient();

export const ModalContext = createContext<
  | {
      who: { type: string; id: string } | undefined;
      setWho: (
        e: SetStateAction<{ type: string; id: string } | undefined>
      ) => void;
      makePost: {
        open: boolean;
        quote?: Post;
      };
      setMakePost: (
        e: SetStateAction<{
          open: boolean;
          quote?: Post;
        }>
      ) => void;
      oracleData: OracleData[];
      setOracleData: (e: SetStateAction<OracleData[]>) => void;
      gif: {
        open: boolean;
        id?: string;
      };
      setGif: (
        e: SetStateAction<{
          open: boolean;
          id?: string;
        }>
      ) => void;
      collectOptions: {
        open: boolean;
        id?: string;
      };
      setCollectOptions: (
        e: SetStateAction<{
          open: boolean;
          id?: string;
        }>
      ) => void;
      quest: boolean;
      setQuest: (e: SetStateAction<boolean>) => void;
      metrics: boolean;
      setMetrics: (e: SetStateAction<boolean>) => void;
      videoControlsInfo: VideoControls;
      setVideoControlsInfo: (e: SetStateAction<VideoControls>) => void;
      isCreator: boolean;
      setIsCreator: (e: SetStateAction<boolean>) => void;
      follow: Account | undefined;
      setFollow: (e: SetStateAction<Account | undefined>) => void;
      modalOpen: string | undefined;
      setModalOpen: (e: SetStateAction<string | undefined>) => void;
      collect:
        | {
            id: string;
            stats: number;
            action: SimpleCollectAction;
          }
        | undefined;
      setCollect: (
        e: SetStateAction<
          | {
              id: string;
              stats: number;
              action: SimpleCollectAction;
            }
          | undefined
        >
      ) => void;
      videoInfo: VideoInfo;
      setVideoInfo: (e: SetStateAction<VideoInfo>) => void;
      signless: boolean;
      setSignless: (e: SetStateAction<boolean>) => void;
      success: {
        open: boolean;
        media?: string | undefined;
      };
      setSuccess: (
        e: SetStateAction<{
          open: boolean;
          media?: string | undefined;
        }>
      ) => void;
      indexar: Indexar;
      setIndexar: (e: SetStateAction<Indexar>) => void;
      viewer: Viewer;
      setViewer: (e: SetStateAction<Viewer>) => void;
      options: Options;
      setOptions: (e: SetStateAction<Options>) => void;
      designerProfiles: Account[];
      setDesignerProfiles: (e: SetStateAction<Account[]>) => void;
      collectionInfo: CollectionInfo;
      setCollectionInfo: (e: SetStateAction<CollectionInfo>) => void;
      setConnect: (e: SetStateAction<boolean>) => void;
      connect: boolean;
      setCrearCuenta: (e: SetStateAction<boolean>) => void;
      crearCuenta: boolean;
      clienteLens: PublicClient<Context> | undefined;
      lensConectado: LensConnected | undefined;
      setLensConectado: (e: SetStateAction<LensConnected | undefined>) => void;
      clienteAlmacenamiento: StorageClient | undefined;
      verImagen: { item: string; type: string } | undefined;
      setVerImagen: (
        e: SetStateAction<{ item: string; type: string } | undefined>
      ) => void;
      postInfo: {
        collectTypes?: {
          [key: string]: SimpleCollect | undefined;
        };
        media?: {
          [key: string]: {
            item: string;
            type: MediaImageMimeType | MediaVideoMimeType;
          }[];
        };
      };
      setPostInfo: (
        e: SetStateAction<{
          collectTypes?: {
            [key: string]: SimpleCollect | undefined;
          };
          media?: {
            [key: string]: {
              item: string;
              type: MediaImageMimeType | MediaVideoMimeType;
            }[];
          };
        }>
      ) => void;
    }
  | undefined
>(undefined);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [makePost, setMakePost] = useState<{
    open: boolean;
    quote?: Post;
  }>({
    open: false,
  });
  const [gif, setGif] = useState<{
    open: boolean;
    id?: string;
  }>({
    open: false,
  });
  const [collectOptions, setCollectOptions] = useState<{
    open: boolean;
    id?: string;
  }>({
    open: false,
  });
  const [postInfo, setPostInfo] = useState<{
    collectTypes?: {
      [key: string]: SimpleCollect | undefined;
    };
    media?: {
      [key: string]: {
        item: string;
        type: MediaImageMimeType | MediaVideoMimeType;
      }[];
    };
  }>({});
  const [oracleData, setOracleData] = useState<OracleData[]>([]);
  const [clienteLens, setClienteLens] = useState<PublicClient | undefined>();
  const [follow, setFollow] = useState<Account | undefined>();
  const [success, setSuccess] = useState<{
    open: boolean;
    media?: string | undefined;
  }>({ open: false });
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [quest, setQuest] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<boolean>(false);
  const [collect, setCollect] = useState<
    { id: string; stats: number; action: SimpleCollectAction } | undefined
  >();
  const [modalOpen, setModalOpen] = useState<string | undefined>();
  const [options, setOptions] = useState<Options>(Options.Fulfillment);
  const [crearCuenta, setCrearCuenta] = useState<boolean>(false);
  const [connect, setConnect] = useState<boolean>(false);
  const [verImagen, setVerImagen] = useState<
    { item: string; type: string } | undefined
  >();
  const clienteAlmacenamiento = StorageClient.create();
  const [lensConectado, setLensConectado] = useState<LensConnected>();
  const [signless, setSignless] = useState<boolean>(false);
  const [viewer, setViewer] = useState<Viewer>(Viewer.Stream);
  const [designerProfiles, setDesignerProfiles] = useState<Account[]>([]);
  const [indexar, setIndexar] = useState<Indexar>(Indexar.Inactivo);
  const [collectionInfo, setCollectionInfo] = useState<CollectionInfo>({
    skip: 0,
    hasMore: true,
    collections: [],
    collectionsLoading: false,
    moreCollectionsLoading: false,
  });
  const [who, setWho] = useState<
    | {
        type: string;
        id: string;
      }
    | undefined
  >();
  const [videoInfo, setVideoInfo] = useState<VideoInfo>({
    hasMore: true,
    channels: [],
    currentIndex: 0,
  });
  const [videoControlsInfo, setVideoControlsInfo] = useState<VideoControls>({
    duration: 0,
    currentTime: 0,
    heart: false,
    isPlaying: false,
    videosLoading: false,
  });

  useEffect(() => {
    if (!clienteLens) {
      setClienteLens(
        PublicClient.create({
          environment: mainnet,
          storage: window.localStorage,
        })
      );
    }
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            "--ck-font-family": '"Manaspace", cursive',
          }}
        >
          <ModalContext.Provider
            value={{
              who,
              setWho,
              makePost,
              setMakePost,
              success,
              setSuccess,
              oracleData,
              setOracleData,
              gif,
              setGif,
              collectOptions,
              setCollectOptions,
              postInfo,
              setPostInfo,
              quest,
              setQuest,
              metrics,
              setMetrics,
              modalOpen,
              setModalOpen,
              viewer,
              setViewer,
              designerProfiles,
              setDesignerProfiles,
              crearCuenta,
              setCrearCuenta,
              isCreator,
              setIsCreator,
              connect,
              setConnect,
              clienteLens,
              clienteAlmacenamiento,
              lensConectado,
              setLensConectado,
              verImagen,
              setVerImagen,
              collectionInfo,
              setCollectionInfo,
              options,
              setOptions,
              videoInfo,
              setVideoInfo,
              collect,
              setCollect,
              follow,
              setFollow,
              indexar,
              setIndexar,
              signless,
              setSignless,
              videoControlsInfo,
              setVideoControlsInfo,
            }}
          >
            {children}
          </ModalContext.Provider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
