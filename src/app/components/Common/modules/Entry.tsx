"use client";

import { Viewer } from "../types/common.types";
import { useContext } from "react";
import { ModalContext } from "@/app/providers";
import useChannels from "../../Player/hooks/useChannels";
import Interactions from "../../SideBar/modules/Interactions";
import SideBar from "../../SideBar/modules/Sidebar";
import SwitchView from "./SwitchView";

export default function Entry({ dict }: { dict: any }) {
  const context = useContext(ModalContext);
  const {
    fetchMoreVideos,
    secondaryComment,
    setSecondaryComment,
    commentLoading,
    setCommentsLoading,
  } = useChannels();
  return (
    <div className="relative w-full h-full flex flex-col overflow-x-hidden selection:bg-ama selection:text-moda">
      <div className="relative w-full flex flex-row xl:flex-nowrap flex-wrap h-fit xl:h-[55rem] overflow-y-hidden">
        <div className="relative flex flex-col xl:flex-row items-start justify-start w-full h-full">
          <SideBar fetchMoreVideos={fetchMoreVideos} dict={dict} />
          <div className="relative w-full h-full flex flex-col gap-5 items-start justify-start overflow-y-scroll">
            <SwitchView
              commentsLoading={commentLoading}
              secondaryComment={secondaryComment}
              setCommentsLoading={setCommentsLoading}
              setSecondaryComment={setSecondaryComment}
              dict={dict}
              fetchMoreVideos={fetchMoreVideos}
            />
          </div>
        </div>
        {context?.viewer !== Viewer.Sampler &&
          context?.viewer !== Viewer.Chat && (
            <div className="w-full xl:w-fit h-full flex">
              <Interactions
                dict={dict}
                secondaryComment={secondaryComment}
                setSecondaryComment={setSecondaryComment}
                commentLoading={commentLoading}
              />
            </div>
          )}
      </div>
    </div>
  );
}
