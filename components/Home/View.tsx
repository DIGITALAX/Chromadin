import { FunctionComponent } from "react";
import Video from "../Common/Video/modules/Video";
import SwitchView from "./SwitchView";
import { ViewProps } from "./types/home.types";

const View: FunctionComponent<ViewProps> = ({viewer}): JSX.Element => {

  return (
    <div className="flex flex-col w-full h-full">
      <Video viewer={viewer} />
      <SwitchView />
    </div>
  );
};

export default View;
