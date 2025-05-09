import { Metadata } from "next";
import DropEntry from "@/app/components/Autograph/modules/DropEntry";
import { getDictionary } from "@/app/[lang]/dictionaries";

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
