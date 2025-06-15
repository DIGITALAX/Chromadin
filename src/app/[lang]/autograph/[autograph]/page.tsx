import AutographEntry from "@/app/components/Autograph/modules/AutographEntry";
import { Metadata } from "next";
import { getDictionary } from "../../dictionaries";
import { LOCALES } from "@/app/lib/constants";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    autograph: string;
  }>;
}): Promise<Metadata> => {
  const { autograph } = await params;

  return {
    title: `Autograph | ${autograph}`,
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
    lang: string;
  }>;
}) {
  const { autograph, lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <AutographEntry name={autograph} dict={dict} />;
}
