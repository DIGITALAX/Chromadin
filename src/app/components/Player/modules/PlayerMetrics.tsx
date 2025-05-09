// import { INFURA_GATEWAY } from "@/app/lib/constants";
// import { formatPlayerTime } from "@/app/lib/helpers/formatPlayerTime";
// import Image from "next/legacy/image";
// import { FunctionComponent, JSX } from "react";

// const PlayerMetrics: FunctionComponent<PlayerMetricsProps> = ({
//   metrics,
//   text,
// }): JSX.Element => {
//   return (
//     <div className="relative w-full h-fit flex flex-wrap gap-4 items-start justify-start">
//       {metrics ? (
//         Object.entries(metrics)
//           ?.filter(
//             ([key]) =>
//               ![
//                 "publication",
//                 "__typename",
//                 "playerId",
//                 "pubId",
//                 "profileId",
//                 "videoBytes",
//                 "mostReplayedArea",
//                 "mostReplayed",
//                 "details",
//               ]?.includes(key)
//           )
//           ?.filter(([_, value]) => value !== false && Number(value) !== 0)
//           ?.sort(
//             ([keyA], [keyB]) =>
//               ["react", "comment", "bookmark", "mirror", "quote"].indexOf(
//                 keyA
//               ) -
//               ["react", "comment", "bookmark", "mirror", "quote"].indexOf(keyB)
//           )
//           ?.map(([key, value]) => {
//             if (value === true) {
//               key = key?.split("has")?.[1];
//               return {
//                 key,
//                 value,
//                 image: key?.toLowerCase()?.includes("react")
//                   ? "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ"
//                   : key?.toLowerCase()?.includes("mirror")
//                   ? "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3"
//                   : key?.toLowerCase()?.includes("quote")
//                   ? "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM"
//                   : key?.toLowerCase()?.includes("bookmark")
//                   ? "QmVXkRB4HCd6gkXmj1cweEh4nVV6oBuKCAWfsKUEJae433"
//                   : key?.toLowerCase()?.includes("comment")
//                   ? "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n"
//                   : "QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF",
//               };
//             } else {
//               const newKey = key?.toLowerCase()?.includes("secondary")
//                 ? key
//                     ?.replace(/([A-Z])/g, " $1")
//                     .trim()
//                     ?.replace(/\b([Ss])econdary\b/g, "")
//                     ?.replace(/(min)/g, "")
//                 : key
//                     ?.replace(/(min)/g, "")
//                     ?.replace(/([A-Z])/g, " $1")
//                     .trim()
//                     ?.replace(/\b([Ss])econdary\b/g, "");
//               return {
//                 key: newKey,
//                 value:
//                   key?.includes("duration") && value
//                     ? formatPlayerTime(value)
//                     : value,
//                 image: newKey
//                   ?.split("On")?.[0]
//                   ?.toLowerCase()
//                   ?.includes("react")
//                   ? "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ"
//                   : newKey?.split("On")?.[0]?.toLowerCase()?.includes("mirror")
//                   ? "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3"
//                   : newKey?.split("On")?.[0]?.toLowerCase()?.includes("quote")
//                   ? "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM"
//                   : newKey
//                       ?.split("On")?.[0]
//                       ?.toLowerCase()
//                       ?.includes("bookmark")
//                   ? "QmVXkRB4HCd6gkXmj1cweEh4nVV6oBuKCAWfsKUEJae433"
//                   : newKey?.split("On")?.[0]?.toLowerCase()?.includes("comment")
//                   ? "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n"
//                   : "QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF",
//               };
//             }
//           })
//           ?.map(
//             (
//               item: {
//                 key: string;
//                 value: number | boolean;
//                 image?: string;
//               },
//               index: number
//             ) => {
//               return (
//                 <div
//                   key={index}
//                   className="relative w-fit h-fit items-start justify-start gap-1 font-dosis text-white text-xs flex flex-col"
//                 >
//                   <div className="flex items-start justify-start w-fit h-fit break-words">
//                     {item?.key}
//                   </div>
//                   <div className="relative w-fit h-fit flex items-center justify-center">
//                     {item?.value !== true ? (
//                       !item?.key?.includes("On") ? (
//                         <div className="px-1.5 py-1 relative flex h-5 min-w-[3.5rem] w-fit break-words  items-center justify-center rounded-sm bg-nave border border-girasol text-xs text-white font-dosis">
//                           <div className="relative w-fit h-fit flex items-center justify-center">
//                             {!Number.isNaN(Number(item?.value))
//                               ? String(item?.value)?.includes(".")
//                                 ? Number(item?.value)?.toFixed(3)
//                                 : item?.value
//                               : item?.value}
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="relative w-fit h-fit flex flex-row gap-1.5 items-center justify-center">
//                           <div className="relative w-fit h-fit flex items-center justify-center text-xs text-white font-dosis">
//                             {!Number.isNaN(Number(item?.value))
//                               ? String(item?.value)?.includes(".")
//                                 ? Number(item?.value)?.toFixed(3)
//                                 : item?.value
//                               : String(item?.value)
//                                   ?.replaceAll(/00:00:/g, "")
//                                   ?.replace(
//                                     /(\d+):(\d+)(\d+)-(\d+):(\d+)(\d+)/g,
//                                     "$1:$2-$4:$5"
//                                   )}
//                             {" x"}
//                           </div>
//                           <div
//                             className={`relative w-5 h-5 flex items-center justify-center`}
//                           >
//                             <Image
//                               src={`${INFURA_GATEWAY_INTERNAL}${item?.image}`}
//                               draggable={false}
//                               layout="fill"
//                             />
//                           </div>
//                         </div>
//                       )
//                     ) : (
//                       <div
//                         className={`relative w-5 h-5 flex items-center justify-center`}
//                       >
//                         <Image
//                           src={`${INFURA_GATEWAY_INTERNAL}${item?.image}`}
//                           draggable={false}
//                           layout="fill"
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             }
//           )
//       ) : (
//         <div className="relative w-full h-fit flex items-center justify-center text-center text-gray-500 font-earl text-xs">
//           {text}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PlayerMetrics;
