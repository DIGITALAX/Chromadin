import { ModalContext } from "@/app/providers";
import { Account, PageSize } from "@lens-protocol/client";
import { fetchAccounts } from "@lens-protocol/client/actions";
import { useContext, useState } from "react";

const useSearch = () => {
  const context = useContext(ModalContext);
  const [profilesFound, setProfilesFound] = useState<Account[]>([]);
  const [profilesOpen, setProfilesOpen] = useState<boolean>(false);
  const [searchTarget, setSearchTarget] = useState<string>("");
  const [info, setInfo] = useState<{
    paginated: string | undefined;
    hasMore: boolean;
  }>({
    paginated: undefined,
    hasMore: true,
  });

  const searchProfiles = async (e: any) => {
    let target =
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1];
    if (target?.trim() == "") return;
    setSearchTarget(target);

    try {
      const allProfiles = await fetchAccounts(context?.clienteLens!, {
        pageSize: PageSize.Ten,
        filter: {
          searchBy: {
            localNameQuery: target,
          },
        },
      });

      if (allProfiles.isOk()) {
        setProfilesOpen(true);
        setProfilesFound((allProfiles?.value?.items || []) as Account[]);
        setInfo({
          paginated: allProfiles?.value?.pageInfo?.next!,
          hasMore: allProfiles?.value?.items?.length === 10 ? true : false,
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const fetchMoreProfiles = async () => {
    if (!info.hasMore || searchTarget === "") return;

    try {
      const allProfiles = await fetchAccounts(context?.clienteLens!, {
        cursor: info?.paginated,
        pageSize: PageSize.Ten,
        filter: {
          searchBy: {
            localNameQuery:
              searchTarget.split(" ")[searchTarget.split(" ")?.length - 1],
          },
        },
      });

      if (allProfiles.isOk()) {
        setProfilesOpen(true);
        setProfilesFound([
          ...profilesFound,
          ...(allProfiles?.value?.items || []),
        ] as Account[]);
        setInfo({
          paginated: allProfiles?.value?.pageInfo?.next!,
          hasMore: allProfiles?.value?.items?.length === 10 ? true : false,
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return {
    searchProfiles,
    profilesFound,
    profilesOpen,
    fetchMoreProfiles,
    setProfilesOpen,
    setProfilesFound,
    info,
  };
};

export default useSearch;
