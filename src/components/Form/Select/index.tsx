import { SelectProps } from "./props";

export const Select: React.FC<SelectProps> = ({ options, ...rest }) => {
  return (
    <select
      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      {...rest}
    >
      {options.map(({ text, value }, i) => (
        <option key={i} value={value}>
          {text}
        </option>
      ))}
    </select>
  );
};
