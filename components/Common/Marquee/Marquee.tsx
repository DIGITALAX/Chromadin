import { FunctionComponent } from "react";
import MarqueeText from "react-fast-marquee";

const Marquee: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-10 border-y border-white py-3">
      <MarqueeText gradient={false} speed={70} direction={"right"}>
        <span className="relative font-arcade text-sm text-white px-5">
          NEW SYNTH COLLECTIONS
        </span>
        <span className="relative font-arcade text-sm text-white px-5">
          NEW SYNTH COLLECTIONS
        </span>
        <span className="relative font-arcade text-sm text-white px-5">
          NEW SYNTH COLLECTIONS
        </span>
        <span className="relative font-arcade text-sm text-white px-5">
          NEW SYNTH COLLECTIONS
        </span>
        <span className="relative font-arcade text-sm text-white px-5">
          NEW SYNTH COLLECTIONS
        </span>
        <span className="relative font-arcade text-sm text-white px-5">
          NEW SYNTH COLLECTIONS
        </span>
        <span className="relative font-arcade text-sm text-white px-5">
          NEW SYNTH COLLECTIONS
        </span>
        <span className="relative font-arcade text-sm text-white px-5">
          NEW SYNTH COLLECTIONS
        </span>
      </MarqueeText>
    </div>
  );
};

export default Marquee;
