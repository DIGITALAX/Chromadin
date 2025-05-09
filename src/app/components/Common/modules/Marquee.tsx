import { tParams } from "@/app/[lang]/layout";
import { getDictionary } from "@/app/[lang]/dictionaries";
import MarqueeEntry from "./MarqueeEntry";

export default async function Marquee({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <MarqueeEntry dict={dict} />;
}
