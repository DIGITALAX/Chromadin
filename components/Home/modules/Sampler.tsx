import useStats from "@/components/Common/Sampler/hooks/useStats";
import Graphs from "@/components/Common/Sampler/modules/Graphs";
import Pies from "@/components/Common/Sampler/modules/Pies";
import Rates from "@/components/Common/Sampler/modules/Rates";
import Stats from "@/components/Common/Sampler/modules/Stats";
import { INFURA_GATEWAY } from "@/lib/constants";
import { RootState } from "@/redux/store";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { useSelector } from "react-redux";

const Sampler: FunctionComponent = (): JSX.Element => {

  const {
    statTitles,
    statsLoading,
    topAccountsFollowed,
    totalChanges,
    graphData,
    setCanvas,
    canvas,
  } = useStats();
  const rates = useSelector((state: RootState) => state.app.ratesReducer.value);
  const stats = useSelector((state: RootState) => state.app.statsReducer.value);
  const pies = useSelector((state: RootState) => state.app.piesReducer.value);
  const graphs = useSelector(
    (state: RootState) => state.app.graphReducer.value
  );
  return (
    <div className="relative w-full h-full mid:h-[57.2rem] xl:h-[54.8rem] gap-3 flex">
      <div className="absolute w-full h-full bg-cover">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmUpj8mFnHji5fiqShj5GiCEdE8Ab8jTZBWHrGBXVTRg9c`}
          layout="fill"
          alt="retrowavebg"
          objectFit="cover"
          priority
          draggable={false}
        />
      </div>
      <div className="relative flex flex-col p-4 gap-3" id="sampler">
        <div className="relative flex flex-row w-full h-fit mid:h-full gap-3 xl:flex-nowrap flex-wrap xl:overflow-y-visible overflow-y-scroll">
          <Graphs
            graphData={graphData}
            graphLoading={statsLoading}
            canvas={canvas}
            setCanvas={setCanvas}
            graphsRedux={graphs}
          />
          <div className="relative w-full xl:w-200 mid:h-fit xl:h-full flex flex-col gap-3">
            <Pies
              topAccountsFollowed={topAccountsFollowed}
              piesRedux={pies}
              piesLoading={statsLoading}
            />
            <Rates
              totalChanges={totalChanges}
              ratesRedux={rates}
              ratesLoading={statsLoading}
            />
          </div>
        </div>
        <Stats
          statTitles={statTitles}
          statsRedux={stats}
          statsLoading={statsLoading}
        />
      </div>
    </div>
  );
};
export default Sampler;
