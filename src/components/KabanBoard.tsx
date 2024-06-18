import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { TColumn, TId } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

function KabanBoard() {
  const [columns, setColumn] = useState<TColumn[]>([]);
  const [activeDragColumn, setActiveDragColumn] = useState<TColumn | null>(
    null
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, //3px - means we need to move 3px to activate the drag
      },
    })
  );

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

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

  const updateColumn = (id: TId, title: string) => {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumn(newColumns);
  };

  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === "Column") {
      setActiveDragColumn(e.active.data.current?.column);
      return;
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    // Swap the postion in the columns array
    setColumn((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        sensors={sensors}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnContainer
                  key={column.id}
                  column={column}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                />
              ))}
            </SortableContext>
          </div>

          <button
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-2 ring-rose-400 hover:ring-2 flex gap-2 items-center"
            onClick={() => createNewColumn()}
          >
            <PlusIcon /> Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeDragColumn && (
              <ColumnContainer
                column={activeDragColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default KabanBoard;
