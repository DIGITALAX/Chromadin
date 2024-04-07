import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { ConnectProps } from "../types/sidebar.types";
import Auth from "./Auth";
import {
  PiArrowFatLinesLeftFill,
  PiArrowFatLinesRightFill,
} from "react-icons/pi";

const Connect: FunctionComponent<ConnectProps> = ({
  openConnectModal,
  connected,
  handleLensSignIn,
  profile,
  handleLogout,
  t,
  i18n,
  chosenLanguage,
  setChosenLanguage,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full py-8 lg:py-3 px-3 flex flex-col sm:flex-row lg:flex-col items-center gap-4">
      <Auth
        handleLogout={handleLogout}
        connected={connected}
        handleLensSignIn={handleLensSignIn}
        profile={profile}
        openConnectModal={openConnectModal}
        t={t}
      />
      <div className="relative justify-center sm:justify-end w-full h-full flex flex-row gap-2">
        <div className="relative w-20 sm:w-14 lg:w-full lg:h-28 h-14 flex">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmfWD8eQEZUuyqmnzYVj2r4bS2vNWHYibSkHW7N27yJw7a`}
            layout="fill"
            alt="qr"
            draggable={false}
            priority
          />
        </div>
        <div className="relative w-fit h-full flex font-earl text-white text-xs">
          {t("scan")}
        </div>
        <div className="relative justify-end w-full sm:w-40 lg:w-full h-full flex flex-col gap-4 items-center">
          <div className="relative grid grid-flow-col auto-cols-auto w-1/2 self-end">
            {[...Array(5)].map((_: any, index: number) => (
              <Image
                key={index}
                src={`${INFURA_GATEWAY}/ipfs/QmfXzGt2RHdEfwgiLiYqEmdsDdSHm1SBdq1Cpys1gHTe5s`}
                height={10}
                width={5}
                alt="stripes"
                draggable={false}
              />
            ))}
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center flex flex-row gap-3">
            <div className="relative w-fit h-fit flex items-center justify-center text-white flex-col text-center font-earl uppercase">
              <div className="text-base flex items-center justify-center">
                {t("select")}
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-2">
                <div
                  className="relative flex items-center justify-center w-fit h-fit active:scale-95 cursor-pointer"
                  onClick={() =>
                    setChosenLanguage((prev) =>
                      prev == "es" ? "ar" : prev == "en" ? "es" : "en"
                    )
                  }
                >
                  <PiArrowFatLinesLeftFill size={20} color={"white"} />
                </div>
                <div className="relative w-fit h-fit flex items-center justify-center">
                  {chosenLanguage}
                </div>
                <div
                  className="relative flex items-center justify-center w-fit h-fit active:scale-95 cursor-pointer"
                  onClick={() =>
                    setChosenLanguage((prev) =>
                      prev == "es" ? "en" : prev == "en" ? "ar" : "es"
                    )
                  }
                >
                  <PiArrowFatLinesRightFill size={20} color={"white"} />
                </div>
              </div>
              <div
                onClick={() =>
                  chosenLanguage !== "ar" && i18n.changeLanguage(chosenLanguage)
                }
                className={`text-xxs flex items-center justify-center px-2 border border-white rounded-sm h-6 w-full ${
                  chosenLanguage !== "ar" && "cursor-pointer active:scale-95"
                }`}
              >
                ~* {chosenLanguage == "ar" ? t("soon") : t("ve")} *~
              </div>
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center">
              <div className="relative w-8 h-10 flex items-center justify-center">
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${
                    chosenLanguage == "es"
                      ? "QmY43U5RovVkoGrkLiFyA2VPMnGxf5e3NgYZ95u9aNJdem"
                      : chosenLanguage == "en"
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
    </div>
  );
};

export default Connect;
