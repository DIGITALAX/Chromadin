import { INFURA_GATEWAY } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import moment from "moment";
import Image from "next/legacy/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FunctionComponent, JSX } from "react";
import { ProfileProps } from "../types/chat.types";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import Reactions from "./Reactions";

const Profile: FunctionComponent<ProfileProps> = ({
  post,
  dict,
  index,
  setOpenComment,
  disabled,
}): JSX.Element => {
  const router = useRouter();
  const path = usePathname();
  const search = useSearchParams();
  return (
    <div
      className={`relative h-auto rounded-md pr-px py-px w-full sm:w-40 preG:min-w-[7.5rem]`}
      id="sideProfile"
    >
      <div
        className={`relative w-full h-full bg-shame rounded-md flex flex-col items-start sm:items-center py-1.5 px-1 gap-3`}
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmSjh6dsibg9yDfBwRfC5YSWFTmwpwPxRDTFG8DzLHzFyB`}
          layout="fill"
          objectFit="cover"
          className="absolute w-full h-full rounded-lg"
          draggable={false}
        />
        <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
          <div
            className={`w-20 relative h-8 rounded-full flex justify-self-center`}
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmfDmMCcgcseCFzGam9DbmDk5sQRbt6zrQVhvj4nTeuLGq`}
              layout="fill"
              alt="backdrop"
              priority
              draggable={false}
              className="rounded-full w-full h-full"
            />
          </div>
          <div
            className={`absolute rounded-full flex bg-white w-8 h-full justify-self-center sm:right-6 col-start-1 cursor-pointer active:scale-95 hover:opacity-80`}
            id="crt"
            onClick={() => {
              const params = new URLSearchParams(search.toString());
              params.set(
                "profile",
                post?.__typename !== "Repost"
                  ? post?.author?.username?.localName!
                  : post?.repostOf?.author?.username?.localName!
              );

              if (!params.has("option")) {
                params.set("option", "history");
              }

              router.replace(`${path}?${params.toString()}`);
            }}
          >
            <Image
              src={handleProfilePicture(
                post?.__typename !== "Repost"
                  ? post?.author?.metadata?.picture
                  : post?.repostOf?.author?.metadata?.picture
              )}
              onError={(e) => handleImageError(e)}
              objectFit="cover"
              alt="pfp"
              layout="fill"
              className="relative w-full h-full rounded-full"
              draggable={false}
            />
          </div>
        </div>
        <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
          <div
            className={`relative w-fit h-fit font-dosis text-xs justify-self-center`}
            id={"username"}
          >
            {post?.__typename !== "Repost"
              ? Number(post?.author?.username?.localName?.length) > 25
                ? post?.author?.username?.localName?.substring(0, 20) + "..."
                : post?.author?.username?.localName
              : Number(post?.repostOf?.author?.username?.localName?.length) > 20
              ? post?.repostOf?.author?.username?.localName?.substring(0, 25) +
                "..."
              : post?.repostOf?.author?.username?.localName}
          </div>
        </div>
        <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
          <div
            className={`relative w-fit h-fit font-clash text-xs justify-self-center text-black`}
          >
            {post?.__typename !== "Repost"
              ? post?.author?.username?.value
              : post?.repostOf?.author?.username?.value?.slice(0,9)}
          </div>
        </div>
        <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
          <div
            className={`relative w-fit h-fit text-offBlack font-dosis justify-self-center fo:pb-0 pb-2 text-xs `}
          >
            {moment(`${post?.timestamp}`).fromNow()}
          </div>
        </div>
        <div className="relative w-full h-full grid grid-flow-col auto-cols-auto items-end pt-3">
          <Reactions
            disabled={disabled}
            dict={dict}
            publication={post?.__typename == "Repost" ? post?.repostOf : post}
            setOpenComment={setOpenComment}
            index={index}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
