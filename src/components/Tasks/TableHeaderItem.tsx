type TableHeaderItemProps = {
  text: string;
};

export const TableHeaderItem: React.FC<TableHeaderItemProps> = ({ text }) => {
  return (
    <th className="px-6 py-3 border border-black text-center min-w-[300px]">
      {text}
    </th>
  );
};
