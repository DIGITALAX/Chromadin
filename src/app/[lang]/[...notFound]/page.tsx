import NotFoundEntry from "@/app/components/Common/modules/NotFoundEntry";
import { getDictionary } from "../dictionaries";

export type tParams = Promise<{ lang: string }>;

export default async function NotFound({ params }: { params: tParams }) {
  const { lang } = await params;

  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <NotFoundEntry dict={dict} />;
}
