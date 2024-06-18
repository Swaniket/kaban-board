import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import { TId, TTask } from "../types";

interface IProps {
  task: TTask;
  deleteTask: (taskId: TId) => void
}

function TaskCard({ task, deleteTask }: IProps) {
  const [mouseHovering, setMouseHovering] = useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setMouseHovering(true)}
      onMouseLeave={() => setMouseHovering(false)}
      className="bg-mainBackgroundColor p-2.5 h-[80px] min-h-[80px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
    >
      {task.content}
      {mouseHovering && (
        <button 
        onClick={() => deleteTask(task.id)}
        className="stroke-white absolute right-4 top-1/2-translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100">
          <TrashIcon />
        </button>
      )}
    </div>
  );
}

export default TaskCard;
