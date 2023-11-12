
export type TopBarProps = {
  totalCollects: number;
  totalMirrors: number;
  totalPosts: number;
  volumeCollectChange: number;
  volumeProfileChange: number;
  topBarLoading: boolean;
};

export type StatsProps = {
  statsTitles: any[][];
  statsRedux: any[][];
  statsLoading: boolean;
};

export type UseStatsResults = {
  statsTitles: any[][];
  statsLoading: boolean;
  totalChanges: number[];
  topAccountsFollowed: {
    handle: string;
    percentage: string;
  }[];
  graphData: any[];
  setCanvas: (e: string) => void;
  canvas: string;
};

export type UseBarResults = {
  totalCollects: number;
  totalMirrors: number;
  totalPosts: number;
  volumeCollectChange: number;
  volumeProfileChange: number;
  topBarLoading: boolean;
};

export type GraphsProps = {
  graphLoading: boolean;
  graphData: any[];
  setCanvas: (e: string) => void;
  canvas: string;
  graphsRedux: any[];
};

export type PiesProps = {
  topAccountsFollowed: {
    handle: string;
    percentage: string;
  }[];
  piesRedux: any[];
  piesLoading: boolean;
};

export type RatesProps = {
  totalChanges: number[];
  ratesRedux: any[];
  ratesLoading: boolean;
};
