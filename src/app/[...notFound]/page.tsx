import NotFoundEntry from "@/app/components/Common/modules/NotFoundEntry";
import Wrapper from "../components/Common/modules/Wrapper";
import { Suspense } from "react";
import { getDictionary } from "../[lang]/dictionaries";

export default async function NotFound() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={
        <Suspense>
          <NotFoundEntry dict={dict} />
        </Suspense>
      }
    ></Wrapper>
  );
}
