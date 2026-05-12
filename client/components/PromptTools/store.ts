import { create } from 'zustand'
import { FilterSimple } from "client/types/filter";


export type PromptToolsStore = {
    iterate: number;
    filtersCurrent: FilterSimple;
    filtersPossible: FilterSimple;

    showAll: boolean;
    replaceMode: boolean;

    simByTags: boolean;
    simByCategory: boolean;
    simByName: boolean;
}

const promptToolsStore = create<PromptToolsStore>((set) => ({
    iterate: 0,
    filtersCurrent: {},
    filtersPossible: {},

    showAll: false,
    replaceMode: true,

    simByTags: true,
    simByCategory: true,
    simByName: true,
}));

export const iterateStore = () => promptToolsStore.setState({iterate: promptToolsStore.getState().iterate + 1});

export const setFiltersCurrent = (filtersCurrent: FilterSimple) => promptToolsStore.setState({filtersCurrent});
export const setFiltersPossible = (filtersPossible: FilterSimple) => promptToolsStore.setState({filtersPossible});

export const setShowAll = (showAll: boolean) => promptToolsStore.setState({showAll});
export const setReplaceMode = (replaceMode: boolean) => promptToolsStore.setState({replaceMode});
export const setSimByTags = (simByTags: boolean) => promptToolsStore.setState({simByTags});
export const setSimByCategory = (simByCategory: boolean) => promptToolsStore.setState({simByCategory});
export const setSimByName = (simByName: boolean) => promptToolsStore.setState({simByName});

export default promptToolsStore;
