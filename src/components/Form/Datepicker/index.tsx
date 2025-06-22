import ReactDatePicker from "react-datepicker";
import { DatepickerProps } from "./props";

export const Datepicker: React.FC<DatepickerProps> = ({
  selected,
  onChange,
  minDate,
}) => {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      minDate={minDate}
      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      dateFormat="dd/MM/yyyy"
    />
  );
};
