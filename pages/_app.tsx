import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { store } from "./../redux/store";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
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

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors,
});

export default function App({ Component, pageProps }: AppProps) {
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
          <div className="relative w-full h-full flex flex-col overflow-x-hidden">
            <Component {...pageProps} router={router} />
            <Frequency router={router} />
            <Marquee />
            <Modals router={router} />
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </Provider>
  );
}
