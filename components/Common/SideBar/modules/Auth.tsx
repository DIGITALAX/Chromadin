import { FunctionComponent } from "react";
import Wallet from "./Wallet";
import Profile from "./Profile";
import { AuthProps } from "../types/sidebar.types";

const Auth: FunctionComponent<AuthProps> = ({
  connected,
  openConnectModal,
  handleLensSignIn,
  profile,
  mainPage,
  router
}): JSX.Element => {
  let action: string;
  const decideStringAction = () => {
    if (connected && profile?.handle) {
      action = "profile";
    }
    return action;
  };

  switch (decideStringAction()) {
    case "profile":
      return <Profile router={router} profile={profile} mainPage={mainPage} />;

    default:
      return (
        <Wallet
          handleTransaction={connected ? handleLensSignIn : openConnectModal}
          buttonText={connected ? "SOCIAL" : "CONNECT"}
          isConnected={connected}
          mainPage={mainPage}
        />
      );
  }
};

export default Auth;
