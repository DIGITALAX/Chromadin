import { Suspense } from "react";
import Entry from "../components/Common/modules/Entry";
import { getDictionary } from "./dictionaries";
import { tParams } from "./layout";
import RouterChange from "../components/Autograph/modules/RouterChange";
import { Metadata } from "next";
import { LOCALES } from "../lib/constants";

export const generateMetadata = async ({
  params,
}: {
  params: tParams;
}): Promise<Metadata> => {
  const { lang } = await params;
  const locale = lang ?? "en";

  return {
    title: "Chromadin",
    alternates: {
      canonical: `https://chromadin.xyz/${locale}/`,
      languages: LOCALES.reduce((acc, item) => {
        acc[item] = `https://chromadin.xyz/${item}/`;
        return acc;
      }, {} as { [key: string]: string }),
    },
  };
};

export default async function IndexPage({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang ?? "en");
  return (
    <Suspense fallback={<RouterChange />}>
      <Entry dict={dict} />
    </Suspense>
  );
}
