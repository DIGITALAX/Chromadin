import { Suspense } from "react";
import { Metadata } from "next";
import { getDictionary } from "@/app/[lang]/dictionaries";
import Wrapper from "@/app/components/Common/modules/Wrapper";
import RouterChange from "@/app/components/Autograph/modules/RouterChange";
import CollectEntry from "@/app/components/Autograph/modules/CollectEntry";
import { LOCALES } from "@/app/lib/constants";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    collection: string;
    autograph: string;
  }>;
}): Promise<Metadata> => {
  const { collection, autograph } = await params;

  return {
    title: `Collection | ${collection} | ${autograph}`,
    alternates: {
      canonical: `https://chromadin.xyz/autograph/${autograph}/collection/${collection}/`,
      languages: LOCALES.reduce((acc, item) => {
        acc[
          item
        ] = `https://chromadin.xyz/${item}/autograph/${autograph}/collection/${collection}/`;
        return acc;
      }, {} as { [key: string]: string }),
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
  return (
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
  );
}
