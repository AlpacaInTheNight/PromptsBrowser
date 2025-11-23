import { create } from 'zustand'
import Filter from "clientTypes/filter";


export type CollectionToolsStore = {
    iterate: number;

    copyOrMoveTo: string;
    category: string;
    tags: string;
    autogenCol: string;
    autogenStyle: string;
    generateMode: string;

    autogenStatus: string;
    selectedPrompts: string[];
    promptsFilter: Filter[],
}

const collectionToolsStore = create<CollectionToolsStore>((set) => ({
    iterate: 0,

    copyOrMoveTo: "",
    category: "",
    tags: "",
    autogenCol: "",
    autogenStyle: "",
    generateMode: "prompt",

    autogenStatus: "",
    selectedPrompts: [],
    promptsFilter: [],
}));

export const iterateStore = () => collectionToolsStore.setState({iterate: collectionToolsStore.getState().iterate + 1});

export const setCopyOrMoveTo = (copyOrMoveTo: string) => collectionToolsStore.setState({copyOrMoveTo});
export const setCategory = (category: string) => collectionToolsStore.setState({category});
export const setTags = (tags: string) => collectionToolsStore.setState({tags});
export const setAutogenCol = (autogenCol: string) => collectionToolsStore.setState({autogenCol});
export const setAutogenStyle = (autogenStyle: string) => collectionToolsStore.setState({autogenStyle});
export const setGenerateMode = (generateMode: string) => collectionToolsStore.setState({generateMode});

export const setAutogenStatus = (autogenStatus: string) => collectionToolsStore.setState({autogenStatus});
export const setSelectedPrompts = (selectedPrompts: string[]) => collectionToolsStore.setState({selectedPrompts});
export const setPromptsFilter = (promptsFilter: Filter[]) => collectionToolsStore.setState({promptsFilter});

export default collectionToolsStore;
