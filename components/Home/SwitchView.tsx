import { FunctionComponent } from "react";
import useViewer from "./hooks/useViewer";
import Vending from "./modules/Vending";
import { useDispatch } from "react-redux";
import Sampler from "./modules/Sampler";
import { useRouter } from "next/router";
import Wavs from "./modules/Wavs";

const SwitchView: FunctionComponent = (): JSX.Element => {
  const { viewer } = useViewer();
  const dispatch = useDispatch();
  const router = useRouter();

  switch (viewer) {
    case "collect":
      return <Vending dispatch={dispatch} router={router} />;

    case "sampler":
      return <Sampler />;

    case "chat":
      return <Wavs />;

    default:
      return <></>;
  }
};

export default SwitchView;
