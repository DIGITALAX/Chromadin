"use client";

import { FunctionComponent, JSX } from "react";
import MarqueeText from "react-fast-marquee";

const MarqueeEntry: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  return (
    <div className="relative w-full h-10 border-y border-white py-3 flex flex-row">
      <MarqueeText gradient={false} speed={70} direction={"right"}>
        {Array.from({ length: 30 }).map((_, index: number) => {
          return (
            <span
              className="relative font-arcade text-sm text-white px-5"
              key={index}
            >
              {dict?.Common?.colls}
            </span>
          );
        })}
      </MarqueeText>
    </div>
  );
};

export default MarqueeEntry;
