import { LabelProps } from "@radix-ui/react-label";

export const Label: React.FC<LabelProps> = ({ children, ...rest }) => {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1" {...rest}>
      {children}
    </label>
  );
};
