import { ModalContext } from "@/app/providers";
import { Account, PageSize } from "@lens-protocol/client";
import { fetchWhoExecutedActionOnPost } from "@lens-protocol/client/actions";
import { useContext, useEffect, useState } from "react";

const useCollects = () => {
  const context = useContext(ModalContext);
  const [collectsLoading, setCollectsLoading] = useState<boolean>(false);
  const [collectors, setCollectors] = useState<Account[]>([]);
  const [collectInfo, setCollectInfo] = useState<{
    hasMore: boolean;
    paginated: string | undefined;
  }>({
    hasMore: true,
    paginated: undefined,
  });

  const getPostCollects = async (): Promise<void> => {
    setCollectsLoading(true);
    try {
      const data = await fetchWhoExecutedActionOnPost(
        context?.lensConectado?.sessionClient || context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          post: context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id,
        }
      );

      if (!data?.isOk()) {
        return;
      }
      setCollectors(data?.value?.items as any[]);

      setCollectInfo({
        hasMore: data?.value?.items?.length < 10 ? false : true,
        paginated: data?.value?.pageInfo?.next!,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectsLoading(false);
  };

  const getMorePostCollects = async (): Promise<void> => {
    if (!collectInfo?.hasMore) return;
    try {
      const data = await fetchWhoExecutedActionOnPost(
        context?.lensConectado?.sessionClient || context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          post: context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id,
          cursor: collectInfo?.paginated,
        }
      );

      if (!data?.isOk()) {
        return;
      }

      setCollectors((prev) => [...prev, ...(data?.value?.items as any[])]);

      setCollectInfo({
        hasMore: data?.value?.items?.length < 10 ? false : true,
        paginated: data?.value?.pageInfo?.next!,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id && context?.clienteLens)  {
      getPostCollects();
    }
  }, [context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id, context?.lensConectado?.profile, context?.clienteLens]);

  return {
    collectors,
    collectsLoading,
    getMorePostCollects,
    collectInfo,
  };
};

export default useCollects;
