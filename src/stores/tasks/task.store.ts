import { StateCreator, create } from "zustand";
import type { Task, TaskStatus } from "../../interfaces";
import { devtools, persist } from "zustand/middleware";
import { v4 as uuid4 } from "uuid";
import { immer } from "zustand/middleware/immer";
// import { produce } from "immer";

interface TaskState {
    draggingTaskId?: string
    tasks: Record<string, Task>
    getTaskByStatus: (status: TaskStatus) => Task[]
    setDraggingTaskId: (taskId: string) => void;
    removeDraggingTaskId: () => void;
    changeTaskStatus: (taskId: string, status: TaskStatus) => void;
    onTaskDrop: (status: TaskStatus) => void;
    addTask: (title: string, status: TaskStatus) => void
    getTotalTasks: () => number;
}

const storeApi: StateCreator<TaskState, [["zustand/immer", never]]> = (set, get) => ({
    draggingTaskId: undefined,
    tasks: {
        'ABC-1': { id: 'ABC-1', title: 'Task 1', status: 'open' },
        'ABC-2': { id: 'ABC-2', title: 'Task 2', status: 'in-progress' },
        'ABC-3': { id: 'ABC-3', title: 'Task 3', status: 'open' },
        'ABC-4': { id: 'ABC-4', title: 'Task 4', status: 'open' }
    },

    getTaskByStatus: (status: TaskStatus) => {
        const value = get()
        const tasks = Object.values(value.tasks).filter((task) => {
            if (task.status == status) {
                return task;
            }
        })
        return tasks;
    },
    setDraggingTaskId: (taskId: string) => {
        set({ draggingTaskId: taskId })
    },

    removeDraggingTaskId: () => {
        set({ draggingTaskId: undefined })
    },

    changeTaskStatus: (taskId: string, status: TaskStatus) => {

        const task = structuredClone(get().tasks[taskId])
        task.status = status

        set(state => {
            state.tasks[taskId] = task
        })

        // set(() => ({
        //     tasks: {
        //         [taskId]: task
        //     }
        // }))



    },

    onTaskDrop: (status: TaskStatus) => {
        const taskId = get().draggingTaskId;
        if (!taskId) return;

        get().changeTaskStatus(taskId, status);
        get().removeDraggingTaskId();
    },

    addTask(title: string, status: TaskStatus) {

        const newTask = {
            id: uuid4(),
            title,
            status
        }

        set(state => { state.tasks[newTask.id] = newTask })

        //Requiere npm i immer
        // set(produce((state: TaskState) => {
        //     state.tasks[newTask.id] = newTask
        // }))

        // set((state) => ({
        //      tasks: {
        //           ...state.tasks,
        //           [newTask.id]: newTask
        //       }
        // }))
    },
    getTotalTasks: () => {
        const totalTasks = Object.keys(get().tasks).length
        return totalTasks;
    }
})


export const useTaskStore = create<TaskState>()(
    devtools(
        persist(
            immer(
                storeApi
            ),
            { name: "task-store" })
    )
)