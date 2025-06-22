import { ComponentProps } from "react";

export type SelectProps = ComponentProps<"select"> & {
  options: SelectOption[];
};

export type SelectOption = {
  text: string;
  value: string;
};
