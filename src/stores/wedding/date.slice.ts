import { StateCreator } from "zustand";

export interface DateSlice {
    eventDate: Date;

    eventYYYYMMDD: () => string;
    eventHHMM: () => string;

    setEventDate: (partialDate:string) => void;
    setEventTime: (eventTime:string) => void;
}

export const createDateSlice: StateCreator<DateSlice> = (set,get) => ({
    eventDate: new Date(),

    eventYYYYMMDD: () => {
        return get().eventDate.toISOString().split('T')[0]
    },
    eventHHMM: () => {
        const hours = get().eventDate.getHours().toString().padStart(2, '0');
        const minutes = get().eventDate.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`
    },

    setEventDate: (partialDate:string) => set((state) => {
        const date = new Date(partialDate);
        const month = date.getMonth();
        const year = date.getFullYear();
        const day = date.getDate() + 1;
        // investigar porque crear una fecha a partir de la fecha anterior del estado
        // si da el mismo resultado creando directamente con los parametros
        const newDate = new Date( state.eventDate );
        newDate.setFullYear(year, month, day);
        // const newDate = new Date( year, month, day );

        return {eventDate: newDate}
    }),


    setEventTime: (eventTime:string) => set((state) => {

        const hours = parseInt(eventTime.split(':')[0]);
        const minutes = parseInt(eventTime.split(':')[1]);

        const newDate = new Date( state.eventDate );
        newDate.setHours(hours, minutes);


        return {eventDate: newDate}
    })
})