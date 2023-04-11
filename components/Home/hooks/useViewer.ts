import { setView } from "@/redux/reducers/viewSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useViewer = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const viewer = useSelector((state: RootState) => state.app.viewReducer.value);

  useEffect(() => {
    if (router.asPath.includes("#")) {
      dispatch(setView(router.asPath.split("#")[1]));
    }
  }, [router.asPath]);

  return { viewer };
};

export default useViewer;
