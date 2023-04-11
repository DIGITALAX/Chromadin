import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="og:url" content="https://chromadin.xyz/" />
        <meta name="og:title" content="Chromadin" />
        <meta
          name="og:description"
          content="  There are whispers of new apps that can't be taken away from you. Stirrings of resistance decentralized in code. Where users own the network, direct messages are reliably private, and the channels we see the world through can be counted on to stay fully independent. Engagement and influence flow back to you. Like it was always meant to be."
        />
        <meta name="og:image" content="https://chromadin.xyz/card.png/" />
        <meta name="twitter:card" content="summary" />
        <meta name="og:url" content="https://chromadin.xyz/" />
        <meta name="og:image" content="https://chromadin.xyz/card.png/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@igitalax_" />
        <meta name="twitter:creator" content="@digitalax_" />
        <meta name="twitter:image" content="https://chromadin.xyz/card.png/" />
        <meta name="twitter:url" content="https://chromadin.xyz/" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="canonical" href="https://chromadin.xyz/" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/ARCADECLASSIC.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/DS-DIGI.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/EarlsRevenge.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/Geometria.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: "Arcade Classic";
                font-weight: 400;
                src: url("./fonts/ARCADECLASSIC.ttf");
              }

              @font-face {
                font-family: "Geometria";
                font-weight: 400;
                src: url("./fonts/Geometria.ttf");
              }
              
              @font-face {
                font-family: "DS Digital";
                font-weight: 400;
                src: url("./fonts/DS-DIGI.ttf");
              }
              
              @font-face {
                font-family: "Earls Revenge";
                font-weight: 400;
                src: url("./fonts/EarlsRevenge.ttf");
              }
            `,
          }}
        ></style>
      </Head>
      <body>
        <script>0</script>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
