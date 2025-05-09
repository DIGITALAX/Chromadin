import { FunctionComponent, JSX, useContext } from "react";
import Account from "./Account";
import { Options } from "../types/common.types";
import Fulfillment from "../../Market/modules/Fulfillment";
import { ModalContext } from "@/app/providers";
import History from "../../Market/modules/History";

const Switch: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  switch (context?.options) {
    case Options.Account:
      return <Account dict={dict} />;

    case Options.Fulfillment:
      return <Fulfillment dict={dict} />;

    default:
      return <History dict={dict} />;
  }
};

export default Switch;
