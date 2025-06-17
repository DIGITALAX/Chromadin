import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { LOCALES } from "./lib/constants";

export const metadata: Metadata = {
  title: "Chromadin",
  metadataBase: new URL("https://chromadin.xyz/"),
  alternates: {
    canonical: `https://chromadin.xyz/`,
    languages: LOCALES.reduce((acc, item) => {
      acc[item] = `https://chromadin.xyz/${item}/`;
      return acc;
    }, {} as { [key: string]: string }),
  },
  description:
    "There are whispers of new apps that can't be taken away from you. Stirrings of resistance decentralized in code. Where users own the network, direct messages are reliably private, and the channels we see the world through can be counted on to stay fully independent. Engagement and influence flow back to you. Like it was always meant to be.",
  twitter: {
    description:
      "There are whispers of new apps that can't be taken away from you. Stirrings of resistance decentralized in code. Where users own the network, direct messages are reliably private, and the channels we see the world through can be counted on to stay fully independent. Engagement and influence flow back to you. Like it was always meant to be.",
    creator: "@digitalax_",
    site: "@digitalax_",
    card: "summary_large_image",
  },
  robots: {
    googleBot: {
      index: true,
      follow: true,
    },
  },
  keywords: [
    "Web3",
    "Web3 Fashion",
    "Moda Web3",
    "Open Source",
    "CC0",
    "Emma-Jane MacKinnon-Lee",
    "Open Source LLMs",
    "DIGITALAX",
    "F3Manifesto",
    "digitalax.xyz",
    "f3manifesto.xyz",
    "Women",
    "Life",
    "Freedom",
  ],
  creator: "Emma-Jane MacKinnon-Lee",
  publisher: "Emma-Jane MacKinnon-Lee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Chromadin",
              url: "https://chromadin.xyz/",
              founder: {
                "@type": "Person",
                name: "Emma-Jane MacKinnon-Lee",
                url: "https://emmajanemackinnonlee.com/",
                sameAs: [
                  "https://emmajanemackinnonlee.com/",
                  "https://syntheticfutures.xyz/",
                  "https://web3fashion.xyz/",
                  "https://emancipa.xyz/",
                  "https://highlangu.com/",
                  "https://digitalax.xyz/",
                  "https://cc0web3fashion.com/",
                  "https://cc0web3.com/",
                  "https://cuntism.net/",
                  "https://dhawu.com/",
                  "https://twitter.com/emmajane1313",
                  "https://medium.com/@casadeespejos",
                  "https://www.flickr.com/photos/emmajanemackinnonlee/",
                ],
              },
            }),
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
