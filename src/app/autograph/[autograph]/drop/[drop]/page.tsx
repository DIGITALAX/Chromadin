import { Suspense } from "react";
import { Metadata } from "next";
import DropEntry from "@/app/components/Autograph/modules/DropEntry";
import { getDictionary } from "@/app/[lang]/dictionaries";
import Wrapper from "@/app/components/Common/modules/Wrapper";
import RouterChange from "@/app/components/Autograph/modules/RouterChange";
import { LOCALES } from "@/app/lib/constants";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    drop: string;
    autograph: string;
  }>;
}): Promise<Metadata> => {
  const { drop, autograph } = await params;
  const dropName = decodeURIComponent(drop);
  const autographName = decodeURIComponent(autograph);

  return {
    title: `${dropName} | ${autographName} | Drop | Chromadin`,
    alternates: {
      canonical: `https://chromadin.xyz/autograph/${autograph}/drop/${drop}/`,
      languages: LOCALES.reduce((acc, item) => {
        acc[
          item
        ] = `https://chromadin.xyz/${item}/autograph/${autograph}/drop/${drop}/`;
        return acc;
      }, {} as { [key: string]: string }),
    },
  };
};

export default async function Autograph({
  params,
}: {
  params: Promise<{
    drop: string;
    autograph: string;
  }>;
}) {
  const { drop, autograph } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={
        <Suspense fallback={<RouterChange />}>
          <DropEntry autograph={autograph} drop={drop} dict={dict} />
        </Suspense>
      }
    ></Wrapper>
  );
}
