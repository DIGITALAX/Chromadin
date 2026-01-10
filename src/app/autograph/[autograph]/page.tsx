import { Suspense } from "react";
import RouterChange from "../../components/Autograph/modules/RouterChange";
import AutographEntry from "../../components/Autograph/modules/AutographEntry";
import { getDictionary } from "../../[lang]/dictionaries";
import Wrapper from "../../components/Common/modules/Wrapper";
import { Metadata } from "next";
import { LOCALES } from "@/app/lib/constants";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    autograph: string;
  }>;
}): Promise<Metadata> => {
  const { autograph } = await params;
  const autographName = decodeURIComponent(autograph);

  return {
    title: `${autographName} | Autograph | Chromadin`,
    alternates: {
      canonical: `https://chromadin.xyz/autograph/${autograph}/`,
      languages: LOCALES.reduce((acc, item) => {
        acc[item] = `https://chromadin.xyz/${item}/autograph/${autograph}/`;
        return acc;
      }, {} as { [key: string]: string }),
    },
  };
};

export default async function Autograph({
  params,
}: {
  params: Promise<{
    autograph: string;
  }>;
}) {
  const { autograph } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={
        <Suspense fallback={<RouterChange />}>
          <AutographEntry name={autograph} dict={dict} />
        </Suspense>
      }
    ></Wrapper>
  );
}
