import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import Image from "next/legacy/image";
import { usePathname } from "next/navigation";
import { FunctionComponent, JSX } from "react";
import {
  PiArrowFatLinesLeftFill,
  PiArrowFatLinesRightFill,
} from "react-icons/pi";
import Auth from "./Auth";
import useConnect from "../hooks/useConnect";

const Connect: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const path = usePathname();
  const { changeLanguage } = useConnect();

  return (
    <div className="relative w-full h-fit py-8 lg:py-3 px-3 flex flex-col sm:flex-row lg:flex-col items-center gap-4">
      <div className="relative w-full h-fit flex">
        <Auth dict={dict} />
      </div>
      <div className="relative items-center justify-center w-full h-full flex flex-col gap-2 items-center">
        <div className="relative justify-center w-full h-fit flex items-center">
          <div className="relative flex flex-row gap-5 w-fit h-fit">
            {[...Array(5)].map((_: any, index: number) => {
              return (
                <div key={index} className="relative w-fit h-fit flex">
                  <div className="relative w-5 h-4 flex">
                    <Image
                      src={`${INFURA_GATEWAY_INTERNAL}QmfXzGt2RHdEfwgiLiYqEmdsDdSHm1SBdq1Cpys1gHTe5s`}
                      layout="fill"
                      alt="stripes"
                      draggable={false}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center flex flex-row gap-3">
          <div className="relative w-fit h-fit flex items-center justify-center text-white flex-col text-center font-earl uppercase">
            <div className="text-base flex items-center justify-center">
              {dict?.Common?.select}
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-2">
              <div
                className="relative flex items-center justify-center w-fit h-fit active:scale-95 cursor-pointer"
                onClick={() => changeLanguage()}
              >
                <PiArrowFatLinesLeftFill size={20} color={"white"} />
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                {path.includes("/en/") ? "en" : "es"}
              </div>
              <div
                className="relative flex items-center justify-center w-fit h-fit active:scale-95 cursor-pointer"
                onClick={() => changeLanguage()}
              >
                <PiArrowFatLinesRightFill size={20} color={"white"} />
              </div>
            </div>
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center">
            <div className="relative w-8 h-10 flex items-center justify-center">
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY_INTERNAL}${
                  path?.includes("/es/")
                    ? "QmY43U5RovVkoGrkLiFyA2VPMnGxf5e3NgYZ95u9aNJdem"
                    : path?.includes("/en/")
                    ? "QmXdyvCYjZ7FkPjgFX5BPi98WTpPdJT5FHhzhtbyzkJuNs"
                    : "Qmb2rQi84hLXtiY673VaBHMTB32Lo1Xe1ah4Q7mG2fKf4J"
                }`}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;
