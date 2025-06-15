import { Metadata } from "next";
import DropEntry from "@/app/components/Autograph/modules/DropEntry";
import { getDictionary } from "@/app/[lang]/dictionaries";
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

  return {
    title: `Drop | ${drop} | ${autograph}`,
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
    lang: string;
  }>;
}) {
  const { drop, autograph, lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <DropEntry autograph={autograph} drop={drop} dict={dict} />;
}
