import { FunctionComponent, JSX } from "react";
import Channels from "../../Player/modules/Channels";
import Connect from "../../Common/modules/Connect";
import Switcher from "../../Common/modules/Switcher";
import { SidebarProps } from "../types/sidebar.types";

const SideBar: FunctionComponent<SidebarProps> = ({
  dict,
  fetchMoreVideos,
}): JSX.Element => {
  return (
    <div className="relative w-full xl:w-80 h-[40rem] xl:h-full items-start justify-start flex flex-col">
      <Switcher dict={dict} />
      <Channels fetchMoreVideos={fetchMoreVideos} />
      <Connect dict={dict} />
    </div>
  );
};

export default SideBar;
