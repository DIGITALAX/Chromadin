import { Suspense } from "react";
import { Metadata } from "next";
import DropEntry from "@/app/components/Autograph/modules/DropEntry";
import { getDictionary } from "@/app/[lang]/dictionaries";
import Wrapper from "@/app/components/Common/modules/Wrapper";
import RouterChange from "@/app/components/Autograph/modules/RouterChange";

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
