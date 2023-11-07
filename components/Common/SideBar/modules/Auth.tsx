import { FunctionComponent } from "react";
import Wallet from "./Wallet";
import Profile from "./Profile";
import { AuthProps } from "../types/sidebar.types";

const Auth: FunctionComponent<AuthProps> = ({
  connected,
  handleConnect,
  handleLensSignIn,
  profile,
  mainPage,
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
      return <Profile profile={profile} mainPage={mainPage} />;

    default:
      return (
        <Wallet
          handleTransaction={connected ? handleLensSignIn : handleConnect}
          buttonText={connected ? "SOCIAL" : "CONNECT"}
          isConnected={connected}
          mainPage={mainPage}
        />
      );
  }
};

export default Auth;
