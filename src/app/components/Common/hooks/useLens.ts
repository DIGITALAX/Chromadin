import { evmAddress } from "@lens-protocol/client";
import {
  fetchAccountsAvailable,
  revokeAuthentication,
} from "@lens-protocol/client/actions";
import { useContext, useEffect, useState } from "react";
import { createWalletClient, custom } from "viem";
import { chains } from "@lens-chain/sdk/viem";
import { ModalContext } from "@/app/providers";
import { getOracleData } from "../../../../../graph/queries/getOracleData";
import { Viewer } from "../types/common.types";
import { usePathname } from "next/navigation";
import { getApolloLens } from "@/app/lib/lens/client";

const useLens = (
  isConnected: boolean,
  address: `0x${string}` | undefined,
  dict: any
) => {
  const contexto = useContext(ModalContext);
  const path = usePathname();
  const [lensCargando, setLensCargando] = useState<boolean>(false);

  const resumeLensSession = async () => {
    try {
      const resumed = await contexto?.clienteLens?.resumeSession();

      if (resumed?.isOk()) {
        const accounts = await fetchAccountsAvailable(contexto?.clienteLens!, {
          managedBy: evmAddress(address!),
          includeOwned: true,
        });

        if (accounts.isErr()) {
          return;
        }

        contexto?.setLensConectado?.({
          profile: accounts.value.items?.[0]?.account,
          sessionClient: resumed?.value,
          apollo: getApolloLens(resumed.value?.getCredentials()),
        });
      }
    } catch (err) {
      console.error("Error al reanudar la sesión:", err);
      return null;
    }
  };

  useEffect(() => {
    if (contexto?.clienteLens && address && !contexto?.lensConectado?.profile) {
      resumeLensSession();
    }
  }, [address, contexto?.clienteLens]);

  const handleConectarse = async () => {
    if (!address || !contexto?.clienteLens) return;
    setLensCargando(true);
    try {
      const signer = createWalletClient({
        chain: chains.mainnet,
        transport: custom(window.ethereum!),
        account: address,
      });
      const accounts = await fetchAccountsAvailable(contexto?.clienteLens, {
        managedBy: evmAddress(signer.account.address),
        includeOwned: true,
      });

      if (accounts.isErr()) {
        setLensCargando(false);
        return;
      }
      if (accounts.value.items?.[0]?.account?.address) {
        const authenticated = await contexto?.clienteLens?.login({
          accountOwner: {
            account: evmAddress(accounts.value.items?.[0]?.account?.address),
            owner: signer.account?.address?.toLowerCase(),
          },
          signMessage: (message) => signer.signMessage({ message }),
        });

        if (authenticated.isErr()) {
          console.error(authenticated.error);
          contexto?.setModalOpen?.(dict?.auth);
          setLensCargando(false);
          return;
        }

        const sessionClient = authenticated.value;

        contexto?.setLensConectado?.({
          sessionClient,
          profile: accounts.value.items?.[0]?.account,
          apollo: getApolloLens(sessionClient?.getCredentials()),
        });
      } else {
        const authenticatedOnboarding = await contexto?.clienteLens.login({
          onboardingUser: {
            wallet: signer.account.address,
          },
          signMessage: (message) => signer.signMessage({ message }),
        });

        if (authenticatedOnboarding.isErr()) {
          console.error(authenticatedOnboarding.error);
          contexto?.setModalOpen?.(dict?.onboard);

          setLensCargando(false);
          return;
        }

        const sessionClient = authenticatedOnboarding.value;

        contexto?.setLensConectado?.({
          sessionClient,
          apollo: getApolloLens(sessionClient?.getCredentials()),
        });

        contexto?.setCrearCuenta?.(true);
        contexto?.setConnect?.(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setLensCargando(false);
  };

  const salir = async () => {
    setLensCargando(true);
    try {
      const auth =
        contexto?.lensConectado?.sessionClient?.getAuthenticatedUser();

      if (auth?.isOk()) {
        await revokeAuthentication(contexto?.lensConectado?.sessionClient!, {
          authenticationId: auth.value?.authenticationId,
        });

        contexto?.setLensConectado?.(undefined);
        window.localStorage.removeItem("lens.mainnet.credentials");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setLensCargando(false);
  };

  const handleOracles = async (): Promise<void> => {
    try {
      const data = await getOracleData();
      contexto?.setOracleData(data?.data?.currencyAddeds);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      !isConnected &&
      contexto?.lensConectado?.profile &&
      contexto?.clienteLens
    ) {
      salir();
    }
  }, [isConnected]);

  useEffect(() => {
    if (Number(contexto?.oracleData?.length) < 1) {
      handleOracles();
    }
  }, []);

  useEffect(() => {
    if (path?.includes("/autograph/")) {
      contexto?.setViewer(Viewer.Autograph);
    } else {
      if (contexto?.viewer == Viewer.Autograph) {
        contexto?.setViewer(Viewer.Stream);
      }
    }
  }, [path]);

  return {
    lensCargando,
    salir,
    handleConectarse,
  };
};

export default useLens;
