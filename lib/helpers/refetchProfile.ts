import { Profile } from "@/components/Home/types/generated";
import { getOneProfile } from "@/graphql/lens/queries/getProfile";
import { setLensProfile } from "@/redux/reducers/lensProfileSlice";
import { AnyAction, Dispatch } from "redux";

const refetchProfile = async (
  dispatch: Dispatch<AnyAction>,
  id: string,
) => {
  try {
    const datos = await getOneProfile(
      {
        forProfileId: id,
      },
      true
    );

    dispatch(setLensProfile(datos?.data?.profile as Profile));
  } catch (err: any) {
    console.error(err.message);
  }
};

export default refetchProfile;
