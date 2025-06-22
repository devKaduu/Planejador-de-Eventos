import { cn } from "../../utils";
import { TextareaProps } from "./props";

export const Textarea: React.FC<TextareaProps> = ({ className, ...rest }) => {
  return (
    <textarea
      rows={3}
      className={cn([
        "flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        className,
      ])}
      {...rest}
    />
  );
};
