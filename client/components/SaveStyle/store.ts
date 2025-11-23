import { create } from 'zustand'


export type SaveStyleStore = {
    iterate: number;

    styleName: string;
    collectionId: string;
}

const saveStyleStore = create<SaveStyleStore>((set) => ({
    iterate: 0,

    styleName: "",
    collectionId: "",
}));

export const iterateStore = () => saveStyleStore.setState({iterate: saveStyleStore.getState().iterate + 1});
export const setStyleName = (styleName: string) => saveStyleStore.setState({styleName});
export const setCollectionId = (collectionId: string) => saveStyleStore.setState({collectionId});

export default saveStyleStore;
