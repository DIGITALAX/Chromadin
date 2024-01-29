
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
  graphLoading: boolean;
  setCanvas: (e: string) => void;
  canvas: string;
  graphsRedux: any[];
};

export type PiesProps = {
  piesRedux: {
    handle: string;
    percentage: string;
  }[];
  piesLoading: boolean;
};

export type RatesProps = {
  ratesRedux: number[];
  ratesLoading: boolean;
};
