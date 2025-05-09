import { INFURA_GATEWAY } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import useLens from "../../Common/hooks/useLens";
import { useAccount } from "wagmi";
import { useModal } from "connectkit";

const MakePost: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  const { isConnected, chainId, address } = useAccount();
  const { openOnboarding,  openSwitchNetworks } = useModal();
  const { lensCargando, handleConectarse } = useLens(
    isConnected,
    address,
    dict
  );
  return (
    <div className="relative w-full h-fit flex justify-end ml-auto">
      <div
        className="relative w-4 h-4 flex cursor-pointer active:scale-95"
        onClick={() =>
          !isConnected
            ? chainId !== 232
              ? openSwitchNetworks?.()
              : openOnboarding?.()
            : context?.lensConectado?.profile
            ? context?.setMakePost({
                open: true,
                quote: undefined,
              })
            : !lensCargando && handleConectarse()
        }
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmSRHvHoTZHuEpzaV8apWqubM92QG94a7q6spVgrNkQZbA`}
          className="w-full h-full flex"
          layout="fill"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default MakePost;
