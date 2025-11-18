import { tParams } from "@/app/[lang]/layout";
import FrequencyEntry from "./FrequencyEntry";
import { getDictionary } from "@/app/[lang]/dictionaries";

export default async function Frequency({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang ?? "en");
  return <FrequencyEntry dict={dict} />;
}
