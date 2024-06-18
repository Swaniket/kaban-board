import { useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import { TColumn, TId } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface IProps {
  column: TColumn;
  deleteColumn: (id: TId) => void;
  updateColumn: (id: TId, title: string) => void
}

function ColumnContainer(props: IProps) {
  const { column, deleteColumn, updateColumn } = props;
  const [editMode, setEditMode] = useState<boolean>(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-columnBackgroundColor opacity-40 border-2 border-rose-500 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      {/* Column title */}
      <div
        onClick={() => setEditMode(true)}
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-3 flex items-center justify-between"
      >
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              autoFocus
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
              className="bg-black focus:border-rose-500 border-rounded outline-none px-2"
            />
          )}
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
