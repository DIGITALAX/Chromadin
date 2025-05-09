import { JSX } from "react";
import ModalsEntry from "../../Modals/modules/ModalsEntry";
import FrequencyEntry from "./FrequencyEntry";
import MarqueeEntry from "./MarqueeEntry";

export default function Wrapper({
  dict,
  page,
}: {
  dict: any;
  page: JSX.Element;
}) {
  return (
    <div className="relative w-full h-full flex flex-col overflow-x-hidden">
      {page}
      <FrequencyEntry dict={dict} />
      <MarqueeEntry dict={dict} />
      <ModalsEntry dict={dict} />
    </div>
  );
}
