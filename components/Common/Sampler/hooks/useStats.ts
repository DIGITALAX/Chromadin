import { useEffect, useState } from "react";
import getDailyMappings from "@/graphql/subgraph/queries/getDailyMappings";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { setSamplerRedux } from "@/redux/reducers/samplerSlice";
import { AnyAction, Dispatch } from "redux";
import { Viewer } from "../../Interactions/types/interactions.types";

const useStats = (
  dispatch: Dispatch<AnyAction>,
  viewer: Viewer,
  stats: any[]
) => {
  const [statsLoading, setStatsLoading] = useState<boolean>(false);
  const [canvas, setCanvas] = useState<string>("interests");

  const getDashboardData = async () => {
    setStatsLoading(true);
    try {
      const res = await getDailyMappings();
      const stats = [
        [
          "Top 50 Mirrorers (All Time)",
          await fetchIPFSJSON(
            res.data?.dailyMappingsAddeds[0]?._topMirrorers as any
          ),
        ],
        [
          "Top 50 Collectors (All Time)",
          await fetchIPFSJSON(
            res.data?.dailyMappingsAddeds[0]?._topCollectors as any
          ),
        ],
        [
          "Top 50 Authors (All Time)",
          await fetchIPFSJSON(
            res.data?.dailyMappingsAddeds[0]?._topPosters as any
          ),
        ],
        [
          "Unique Collects (24HRS)",
          await fetchIPFSJSON(res.data?.dailyMappingsAddeds[0]?._unique as any),
        ],
        [
          "Pub Collect β (All Time)",
          await fetchIPFSJSON(
            res.data?.dailyMappingsAddeds[0]?._amountToCollect as any
          ),
        ],
        [
          "Pub Collect β (72HRS)",
          await fetchIPFSJSON(
            res.data?.dailyMappingsAddeds[0]?._amountToCollect72 as any
          ),
        ],
        [
          "Amount Paid Leaderboard (72HRS)",
          await fetchIPFSJSON(
            res.data?.dailyMappingsAddeds[0]?._highestSpend as any
          ),
        ],
      ];
      const jsonFollow = await fetchIPFSJSON(
        res.data?.dailyMappingsAddeds[0]?._topFollowed as any
      );
      const total = jsonFollow.reduce(
        (accumulator: number, currentValue: any) =>
          accumulator + Number(currentValue.count),
        0
      );
      const follow = jsonFollow?.slice(0, 12).map((row: any) => {
        const percentage = ((Number(row.count) / Number(total)) * 100).toFixed(
          2
        );
        return {
          handle: row.handle,
          percentage: percentage,
        };
      });

      const jsonRevenue = await fetchIPFSJSON(
        res.data?.dailyMappingsAddeds[0]?._revenueChange as any
      );
      const changes = [
        ((Number(jsonRevenue[1].total_amount_24) -
          Number(jsonRevenue[0].total_amount_48)) /
          Number(jsonRevenue[0].total_amount_48)) *
          100,
        ((Number(jsonRevenue[2].total_post_24) -
          Number(jsonRevenue[3].total_post_48)) /
          Number(jsonRevenue[3].total_post_48)) *
          100,
      ];
      const jsonGraph = await fetchIPFSJSON(
        res.data?.dailyMappingsAddeds[0]?._graph as any
      );
      const graphData = jsonGraph.map((jsonGraph: any[], index: number) => {
        let totalCount: number;
        if (index < 2) {
          totalCount = jsonGraph.reduce(
            (acc, obj) => acc + Number(obj.count),
            0
          );
        } else {
          totalCount = jsonGraph.reduce(
            (acc, obj) => acc + Number(obj.total_amount_of_collects),
            0
          );
        }
        return jsonGraph.map((obj) => ({
          ...obj,
          label:
            index === 0
              ? obj.hashtag
              : index === 1
              ? obj.interest
              : {
                  handle: obj.handle,
                  pfp: obj.profile_picture_s3_url,
                },
          percentage:
            index < 2
              ? (Number(obj.count) / totalCount) * 100
              : (Number(obj.total_amount_of_collects) / totalCount) * 100,
        }));
      });

      const graphs = [
        { name: "interests", data: graphData[1] },
        { name: "music", data: graphData[2] },
        { name: "images", data: graphData[3] },
        { name: "video", data: graphData[4] },
        { name: "hashtags", data: graphData[0] },
      ];

      dispatch(
        setSamplerRedux({
          graphs,
          stats,
          pies: follow,
          rates: changes,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }

    setStatsLoading(false);
  };

  useEffect(() => {
    if (viewer === Viewer.Sampler && stats?.length === 0) {
      getDashboardData();
    }
  }, [viewer]);

  return {
    statsLoading,
    setCanvas,
    canvas,
  };
};

export default useStats;
