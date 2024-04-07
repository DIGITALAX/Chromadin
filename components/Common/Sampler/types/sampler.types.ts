import { TFunction } from "i18next";

export type TopBarProps = {
  totalCollects: number;
  totalMirrors: number;
  totalPosts: number;
  volumeCollectChange: number;
  volumeProfileChange: number;
  topBarLoading: boolean;
};

export type StatsProps = {
  statsRedux: any[][];
  statsLoading: boolean;
};

export type GraphsProps = {
  t: TFunction<"common", undefined>;
  graphLoading: boolean;
  setCanvas: (e: string) => void;
  canvas: string;
  graphsRedux: any[];
};

export type PiesProps = {
  t: TFunction<"common", undefined>;
  piesRedux: {
    handle: string;
    percentage: string;
  }[];
  piesLoading: boolean;
};

export type RatesProps = {
  ratesRedux: number[];
  t: TFunction<"common", undefined>;
  ratesLoading: boolean;
};
