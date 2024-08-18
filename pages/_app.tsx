import "@/styles/globals.css";
import "./../i18n";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { store } from "./../redux/store";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { useTranslation } from "next-i18next";
import { appWithTranslation } from "next-i18next";
import { Provider } from "react-redux";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import Modals from "@/components/Common/Modals/modules/Modals";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import RouterChange from "@/components/Common/Loading/RouterChange";
import Frequency from "@/components/Common/Frequency/modules/Frequency";
import Marquee from "@/components/Common/Marquee/Marquee";
import {
  createReactClient,
  LivepeerConfig,
  studioProvider,
} from "@livepeer/react";
import { KinoraProvider } from "kinora-sdk";
import { apolloClient } from "@/lib/lens/client";

const { publicClient, webSocketPublicClient, chains } = configureChains(
  [polygon],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
    }),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "Chromadin",
  chains,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
});

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_STUDIO_KEY!,
  }),
});

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors,
});

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [routerChangeLoading, setRouterChangeLoading] =
    useState<boolean>(false);
  useEffect(() => {
    console.log(`
    ██████╗░██╗░█████╗░██╗░░░░░  ██╗███╗░░██╗  ████████╗░█████╗░  ████████╗██╗░░██╗███████╗
    ██╔══██╗██║██╔══██╗██║░░░░░  ██║████╗░██║  ╚══██╔══╝██╔══██╗  ╚══██╔══╝██║░░██║██╔════╝
    ██║░░██║██║███████║██║░░░░░  ██║██╔██╗██║  ░░░██║░░░██║░░██║  ░░░██║░░░███████║█████╗░░
    ██║░░██║██║██╔══██║██║░░░░░  ██║██║╚████║  ░░░██║░░░██║░░██║  ░░░██║░░░██╔══██║██╔══╝░░
    ██████╔╝██║██║░░██║███████╗  ██║██║░╚███║  ░░░██║░░░╚█████╔╝  ░░░██║░░░██║░░██║███████╗
    ╚═════╝░╚═╝╚═╝░░╚═╝╚══════╝  ╚═╝╚═╝░░╚══╝  ░░░╚═╝░░░░╚════╝░  ░░░╚═╝░░░╚═╝░░╚═╝╚══════╝
    
    ██████╗░██╗███╗░░██╗
    ██╔══██╗██║████╗░██║
    ██║░░██║██║██╔██╗██║
    ██║░░██║██║██║╚████║
    ██████╔╝██║██║░╚███║
    ╚═════╝░╚═╝╚═╝░░╚══╝`);
  }, []);

  useEffect(() => {
    const handleStart = () => {
      setRouterChangeLoading(true);
    };

    const handleStop = () => {
      setRouterChangeLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  if (routerChangeLoading) {
    return <RouterChange />;
  }

  return (
    <Provider store={store}>
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={chains}>
          <LivepeerConfig client={livepeerClient}>
            <KinoraProvider playerAuthedApolloClient={apolloClient}>
              <div className="relative w-full h-full flex flex-col overflow-x-hidden">
                <Component {...pageProps} router={router} />
                <Frequency router={router} />
                <Marquee />
                <Modals router={router} />
                <div style={{ display: "none" }}>
                  Web3, Web3 Fashion, Moda Web3, Open Source, CC0, Emma-Jane
                  MacKinnon-Lee, Open Source LLMs, DIGITALAX, F3Manifesto,
                  www.digitalax.xyz, www.f3manifesto.xyz, Women, Life, Freedom.
                </div>
              </div>
            </KinoraProvider>
          </LivepeerConfig>
        </RainbowKitProvider>
      </WagmiConfig>
    </Provider>
  );
}

export default appWithTranslation(App);
