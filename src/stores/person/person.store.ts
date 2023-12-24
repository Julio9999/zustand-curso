import { StateCreator, create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { firebaseStorage } from "../storages/firebaseStorage.store";
import { logger } from "../middlewares/logger.middleware";

interface PersonState {
    firstName: string;
    lastName: string;
}

interface Actions {
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
}


const StoreApi: StateCreator<PersonState & Actions, [["zustand/devtools", never]]> = (set) => ({

    firstName: '',
    lastName: '',

    setFirstName: (value: string) => set(({ firstName: value }), false, 'setFirstName'),
    setLastName: (value: string) => set(({ lastName: value }), false, 'setLastName')
})




export const usePersonStore = create<PersonState & Actions>()(
    logger
        (devtools
            (persist(
                StoreApi, {
                name: 'person-storage',
                // storage: firebaseStorage
            })))
)