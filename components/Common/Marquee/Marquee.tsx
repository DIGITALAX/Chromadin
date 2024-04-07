import { FunctionComponent } from "react";
import MarqueeText from "react-fast-marquee";
import { useTranslation } from "next-i18next";

const Marquee: FunctionComponent = (): JSX.Element => {
  const { t } = useTranslation("common");
  return (
    <div className="relative w-full h-10 border-y border-white py-3 flex flex-row">
      <MarqueeText gradient={false} speed={70} direction={"right"}>
        {Array.from({ length: 30 }).map((_, index: number) => {
          return (
            <span
              className="relative font-arcade text-sm text-white px-5"
              key={index}
            >
              {t("colls")}
            </span>
          );
        })}
      </MarqueeText>
    </div>
  );
};

export default Marquee;
