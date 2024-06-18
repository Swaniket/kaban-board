import { useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { TColumn, TId } from "../types";
import ColumnContainer from "./ColumnContainer";

function KabanBoard() {
  const [columns, setColumn] = useState<TColumn[]>([]);

  const createNewColumn = () => {
    const columnToAdd: TColumn = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumn([...columns, columnToAdd]);
  };

  const generateId = () => {
    // Generate a random number b/w 0 and 10,000
    return Math.floor(Math.random() * 10001);
  };

  const deleteColumn = (id: TId) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumn(filteredColumns);
  };

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <div className="m-auto flex gap-4">
        <div className="flex gap-4">
          {columns.map((column) => (
            <ColumnContainer
              key={column.id}
              column={column}
              deleteColumn={deleteColumn}
            />
          ))}
        </div>

        <button
          className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-2 ring-rose-400 hover:ring-2 flex gap-2 items-center"
          onClick={() => createNewColumn()}
        >
          <PlusIcon /> Add Column
        </button>
      </div>
    </div>
  );
}

export default KabanBoard;
