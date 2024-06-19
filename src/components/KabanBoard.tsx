import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { TColumn, TId, TTask } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function KabanBoard() {
  const [columns, setColumn] = useState<TColumn[]>([]);
  const [tasks, setTasks] = useState<TTask[]>([]);
  const [activeDragColumn, setActiveDragColumn] = useState<TColumn | null>(
    null
  );
  const [activeTask, setActiveTask] = useState<TTask | null>(null);

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

    const newTasks = tasks.filter((task) => task.columnId !== id);
    setTasks(newTasks);
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

    if (e.active.data.current?.type === "Task") {
      setActiveTask(e.active.data.current?.task);
      return;
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveDragColumn(null);
    setActiveTask(null);

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

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;
    if (!activeTask) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    // 1. Dropping a task over another task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeColumnId);
        const overIndex = tasks.findIndex((t) => t.id === overColumnId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";
    // 2. Dropping task over another column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeColumnId);

        tasks[activeIndex].columnId = overColumnId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  const createTask = (id: TId) => {
    const newTask: TTask = {
      id: generateId(),
      columnId: id,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: TId) => {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
  };

  const updateTask = (taskId: TId, value: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== taskId) return task;
      return { ...task, content: value };
    });
    setTasks(newTasks);
  };

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
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
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
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
                createTask={createTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeDragColumn.id
                )}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
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
