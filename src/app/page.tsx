import { Suspense } from "react";
import Wrapper from "./components/Common/modules/Wrapper";
import Entry from "./components/Common/modules/Entry";
import { getDictionary } from "./[lang]/dictionaries";
import RouterChange from "./components/Autograph/modules/RouterChange";

export default async function IndexPage() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={
        <Suspense fallback={<RouterChange />}>
          <Entry dict={dict} />
        </Suspense>
      }
    ></Wrapper>
  );
}
