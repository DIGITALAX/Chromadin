import { Suspense } from "react";
import { Metadata } from "next";
import { getDictionary } from "@/app/[lang]/dictionaries";
import Wrapper from "@/app/components/Common/modules/Wrapper";
import RouterChange from "@/app/components/Autograph/modules/RouterChange";
import CollectEntry from "@/app/components/Autograph/modules/CollectEntry";
import { LOCALES, INFURA_GATEWAY_INTERNAL, VIDEO_COVERS } from "@/app/lib/constants";
import { getOneCollection } from "@/../../graph/queries/getAllCollections";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    collection: string;
    autograph: string;
  }>;
}): Promise<Metadata> => {
  const { collection, autograph } = await params;
  const collectionTitle = decodeURIComponent(collection).replace(/-/g, " ");

  const collectionData = await getOneCollection(collectionTitle);
  const coll = collectionData?.data?.collectionCreateds?.[0];

  const description = coll?.metadata?.description
    ? coll.metadata.description
    : `${collectionTitle} by ${autograph}. Web3 Fashion collection on Chromadin.`;

  const image = coll?.metadata?.images?.[0]?.split("ipfs://")?.[1];
  const imageUrl = image ? `${INFURA_GATEWAY_INTERNAL}${image}` : undefined;

  return {
    title: `${collectionTitle} | ${autograph} | Collection | Chromadin`,
    description,
    keywords: ["Web3 Fashion", "DIGITALAX", collectionTitle, autograph, "NFT", "Decentralized", "Open Source"],
    alternates: {
      canonical: `https://chromadin.xyz/autograph/${autograph}/collection/${collection}/`,
      languages: LOCALES.reduce((acc, item) => {
        acc[
          item
        ] = `https://chromadin.xyz/${item}/autograph/${autograph}/collection/${collection}/`;
        return acc;
      }, {} as { [key: string]: string }),
    },
    openGraph: {
      title: `${collectionTitle} | ${autograph} | Chromadin`,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${collectionTitle} | ${autograph} | Chromadin`,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
};

export default async function Autograph({
  params,
}: {
  params: Promise<{
    collection: string;
    autograph: string;
  }>;
}) {
  const { collection, autograph } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");

  const collectionTitle = decodeURIComponent(collection).replace(/-/g, " ");
  const collectionData = await getOneCollection(collectionTitle);
  const coll = collectionData?.data?.collectionCreateds?.[0];

  const description = coll?.metadata?.description
    ? coll.metadata.description
    : `${collectionTitle} - Web3 Fashion NFT Collection by ${autograph} on Chromadin`;

  const image = coll?.metadata?.images?.[0]?.split("ipfs://")?.[1];
  const imageUrl = image ? `${INFURA_GATEWAY_INTERNAL}${image}` : undefined;

  const collectionId = coll?.collectionId?.toString();
  const videoCoverMap = new Map(
    VIDEO_COVERS.map((item: { poster: string; id: string }) => [item.id, item.poster])
  );
  const hasVideo = collectionId && videoCoverMap.has(collectionId);
  const posterHash = hasVideo ? videoCoverMap.get(collectionId) : null;

  const price = coll?.price ? parseFloat(coll.price) / 1e18 : null;
  const tokenSymbol = coll?.acceptedTokens?.[0] === "0xE5ecd226b3032910CEaa43ba92EE8232f8237553" ? "WETH" : "MONA";

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://chromadin.xyz/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Autograph",
        item: `https://chromadin.xyz/autograph/${autograph}/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: collectionTitle,
        item: `https://chromadin.xyz/autograph/${autograph}/collection/${collection}/`,
      },
    ],
  };

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: collectionTitle,
    description,
    image: imageUrl,
    brand: {
      "@type": "Brand",
      name: "DIGITALAX",
    },
    ...(price && {
      offers: {
        "@type": "Offer",
        priceCurrency: tokenSymbol,
        price: price.toString(),
        availability: "https://schema.org/InStock",
        url: `https://chromadin.xyz/autograph/${autograph}/collection/${collection}/`,
      },
    }),
    ...(hasVideo && posterHash && {
      video: {
        "@type": "VideoObject",
        name: collectionTitle,
        description,
        thumbnailUrl: `${INFURA_GATEWAY_INTERNAL}${posterHash}`,
        uploadDate: new Date(coll?.blockTimestamp * 1000).toISOString(),
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />
      <Wrapper
        dict={dict}
        page={
          <Suspense fallback={<RouterChange />}>
            <CollectEntry
              autograph={autograph}
              collectionName={collection}
              dict={dict}
            />
          </Suspense>
        }
      ></Wrapper>
    </>
  );
}
