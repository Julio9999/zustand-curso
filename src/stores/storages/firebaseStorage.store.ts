import { StateStorage, createJSONStorage } from "zustand/middleware";

const firebaseUrl = "https://zustand-storage-989c3-default-rtdb.firebaseio.com/zustand";


const storageApi: StateStorage = {

    getItem: async function (name: string): Promise<string | null> {
        try {
            const data = await fetch(`${ firebaseUrl  }/${name}.json`).then(res => res.json())
            return JSON.stringify( data );
        } catch (error) {
            throw error;
        }
    },
    setItem: async function (name: string, value: string): Promise<void> {
        try {
            const data = await fetch(`${ firebaseUrl  }/${name}.json`, {
                method: 'PUT',
                body: value
            }).then(res => res.json())
            return data;
        } catch (error) {
            throw error;
        }
    },
    removeItem: function (name: string): void | Promise<void> {
        console.log('removeItem', name)
    }
}

export const firebaseStorage = createJSONStorage(() => storageApi)
