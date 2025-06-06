import { FunctionComponent, JSX } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import lodash from "lodash";
import { usePathname, useRouter } from "next/navigation";
import { FilterVendingProps } from "../types/market.types";

const FilterVending: FunctionComponent<FilterVendingProps> = ({
  handleOpenDropdown,
  openDropdown,
  values,
  selectorValue,
  filterUpdate,
}): JSX.Element => {
  const path = usePathname();
  return (
    <div
      className={`relative w-fit h-fit flex flex-row font-earl text-white text-xs lowercase`}
    >
      <div
        className={`relative w-24 h-fit px-3 flex py-2 rounded-tr-lg ${
          !openDropdown && "rounded-bl-lg"
        } cursor-pointer gap-3 items-center justify-center border border-white hover:opacity-80`}
        onClick={() => handleOpenDropdown(!openDropdown)}
      >
        <div className="relative w-full h-fit items-center justify-center flex">
          <div className="relative justify-center items-center w-fit h-fit">
            {
              selectorValue?.[
                path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as "es" | "en"
              ]
            }
          </div>
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center">
          <IoMdArrowDropdown color="#FFDE90" size={15} />
        </div>
      </div>
      <div className="absolute flex flex-col items-start justify-start w-24 h-fit cursor-pointer z-1 top-8">
        {openDropdown &&
          lodash
            .filter(
              values,
              (item) =>
                item?.[
                  path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as "es" | "en"
                ] !==
                selectorValue?.[
                  path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as "es" | "en"
                ]
            )
            ?.map((item: { en: string; es: string }, index: number) => {
              return (
                <div
                  key={index}
                  className={`relative w-full h-fit px-3 py-2 ${
                    index === values.length - 2 && "rounded-bl-lg"
                  } flex flex-col items-center justify-center gap-3 cursor-pointer hover:text-ama bg-black border-b border-x border-white ${
                    index === 0 && "border-t"
                  }`}
                  onClick={() => {
                    handleOpenDropdown(!openDropdown);
                    filterUpdate(item!);
                  }}
                >
                  <div className="relative w-fit h-fit flex flex-col items-center justify-center">
                    {openDropdown
                      ? item?.[
                          path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as "es" | "en"
                        ]
                      : selectorValue?.[
                          path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as "es" | "en"
                        ]}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default FilterVending;
