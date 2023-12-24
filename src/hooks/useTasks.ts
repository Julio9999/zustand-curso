import { useState, DragEvent } from "react";
import { useTaskStore } from "../stores";
import { TaskStatus } from "../interfaces";
import Swal from "sweetalert2";

interface Options {
    status: TaskStatus
}

export const useTask = ({ status }: Options) => {

    const isDragging = useTaskStore((state) => !!state.draggingTaskId);

    const [onDragOver, setOnDragOver] = useState(false)

    const onTaskDrop = useTaskStore((state) => state.onTaskDrop);

    const addTask = useTaskStore((state) => state.addTask);

    const handleAddTask = async () => {

        const { isConfirmed, value } = await Swal.fire({
            title: 'Nueva Tarea',
            input: 'text',
            inputLabel: 'Nombre de la tarea',
            inputPlaceholder: 'Ingrese el nombre de la tarea',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'Debe de ingresar un nombre para la tarea'
                }
            }
        })

        if (!isConfirmed) return;

        addTask(value, status)
    }



    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setOnDragOver(true)
    }

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        setOnDragOver(false)
        event.preventDefault()
    }

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setOnDragOver(false)
        onTaskDrop(status)
    }


    return {
        isDragging,
        onDragOver,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleAddTask
    }
}