import { Metadata } from "next";
import { getDictionary } from "@/app/[lang]/dictionaries";
import CollectEntry from "@/app/components/Autograph/modules/CollectEntry";

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
  };
};

export default async function Autograph({
  params,
}: {
  params: Promise<{
    collection: string;
    autograph: string;
    lang: string;
  }>;
}) {
  const { collection, autograph, lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return (
    <CollectEntry
      autograph={autograph}
      collectionName={collection}
      dict={dict}
    />
  );
}
