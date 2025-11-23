import { create } from 'zustand'


export type PromptScribeStore = {
    iterate: number;

    newInAllCollections: boolean;
    selectedNewPrompts: string[];
}

const promptScribeStore = create<PromptScribeStore>((set) => ({
    iterate: 0,

    newInAllCollections: true,
    selectedNewPrompts: [],
}));

export const iterateStore = () => promptScribeStore.setState({iterate: promptScribeStore.getState().iterate + 1});

export const setNewInAllCollections = (newInAllCollections: boolean) => promptScribeStore.setState({newInAllCollections});
export const setSelectedNewPrompts = (selectedNewPrompts: string[]) => promptScribeStore.setState({selectedNewPrompts});

export default promptScribeStore;
