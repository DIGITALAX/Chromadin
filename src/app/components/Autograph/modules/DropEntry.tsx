"use client";

import { FunctionComponent, JSX } from "react";
import Bar from "./Bar";
import RouterChange from "./RouterChange";
import NotFoundEntry from "../../Common/modules/NotFoundEntry";
import useDrop from "../hooks/useDrop";
import AllDrops from "./AllDrops";

const DropEntry: FunctionComponent<{
  dict: any;
  drop: string;
  autograph: string;
}> = ({ dict, drop, autograph }): JSX.Element => {
  const { dropLoading, profile, collections } = useDrop(drop, autograph);

  if (dropLoading) {
    return <RouterChange />;
  }

  return (
    <div
      className="relative w-full flex flex-col bg-black items-center justify-start h-full gap-6 z-0"
      id="calc"
    >
      <Bar dict={dict} />
      {collections?.length > 0 ? (
        <div className="relative flex flex-col w-full h-fit gap-10 px-3 sm:px-8 lg:px-20 py-10">
          <AllDrops dict={dict} collections={collections} profile={profile!} />
        </div>
      ) : (
        <NotFoundEntry dict={dict} />
      )}
    </div>
  );
};

export default DropEntry;
