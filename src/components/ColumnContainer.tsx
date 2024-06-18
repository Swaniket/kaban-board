import TrashIcon from "../icons/TrashIcon";
import { TColumn, TId } from "../types";

interface IProps {
  column: TColumn;
  deleteColumn: (id: TId) => void;
}

function ColumnContainer(props: IProps) {
  const { column, deleteColumn } = props;

  return (
    <div
      className="
            bg-columnBackgroundColor
            w-[350px]
            h-[500px]
            max-h-[500px]
            rounded-md
            flex
            flex-col
        "
    >
      {/* Column title */}
      <div className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-3 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">
            0
          </div>
          {column.title}
        </div>
        <button
          className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2"
          onClick={() => deleteColumn(column.id)}
        >
          <TrashIcon />
        </button>
      </div>

      {/* Column Task Container */}
      <div className="flex flex-grow">Content</div>
      {/* Column Footer */}
      <div>Footer</div>
    </div>
  );
}

export default ColumnContainer;
