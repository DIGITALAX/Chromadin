import { Erc20 } from "@/components/Home/types/lens.types";

export type CollectButtonProps = {
    values?: string[] | Erc20[];
    col: string;
    row: string;
    openDropdown: boolean;
    handleOpenDropdown: (e: boolean) => void;
    selectValue: string | undefined;
    selectFunction: (e: string) => void;
    label: string;
    mixtape?: boolean;
  };

  export type CollectInputProps = {
    id: string;
    name: string;
    step?: string;
    min?: string;
    max?: string;
    placeholder?: string;
    defaultValue?: string;
    col?: string;
    row?: string;
    label?: string;
    valueChange: number;
    handleValueChange: (e: number) => void;
    mixtape?: boolean;
  };