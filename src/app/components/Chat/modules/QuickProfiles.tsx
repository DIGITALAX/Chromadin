import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { Account } from "@lens-protocol/client";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ModalContext } from "@/app/providers";

const QuickProfiles: FunctionComponent = (): JSX.Element => {
  const path = usePathname();
  const search = useSearchParams();
  const router = useRouter();
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto overflow-x-scroll">
      <div className="relative w-full overflow-x-scroll h-fit grid grid-flow-col auto-cols-auto gap-2">
        {context?.designerProfiles?.map((profile: Account, index: number) => {
          return (
            <div
              key={index}
              className="relative flex h-fit w-fit rounded-full"
              id="crt"
              onClick={() => {
                const params = new URLSearchParams(search?.toString());

                params.set("profile", profile?.username?.localName!);
                if (!search.get("option")) {
                  params.set("option", "history");
                }

                router.replace(path + `?${params.toString()}`);
              }}
            >
              <div className="relative w-10 h-10 flex rounded-full hover:opacity-70 cursor-pointer active:scale-95">
                <Image
                  layout="fill"
                  className="rounded-full w-full h-full"
                  objectFit="cover"
                  draggable={false}
                  objectPosition={"center"}
                  src={handleProfilePicture(profile?.metadata?.picture)}
                  onError={(e) => handleImageError(e)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickProfiles;
