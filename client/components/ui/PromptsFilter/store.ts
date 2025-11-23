import { create } from 'zustand'
import Filter from "clientTypes/filter";
import { FilterAction, FilterType, FilterMeta } from './type';


export type PromptsFilterStore = {
    iterate: number;

    showAddFilter: boolean;
    action: FilterAction;
    type: FilterType;
    meta: FilterMeta;
    category: string;
    name: string;
    tag: string;

    promptsFilter: Filter[],
}

const promptsFilterStore = create<PromptsFilterStore>((set) => ({
    iterate: 0,
    
    showAddFilter: true,
    action: FilterAction.INCLUDE,
    type: FilterType.NAME,
    meta: FilterMeta.PREVIEW,
    category: "",
    name: "",
    tag: "",

    promptsFilter: [],
}));

export const iterateStore = () => promptsFilterStore.setState({iterate: promptsFilterStore.getState().iterate + 1});

export const setShowAddFilter = (showAddFilter: boolean) => promptsFilterStore.setState({showAddFilter});
export const setAction = (action: FilterAction) => promptsFilterStore.setState({action});
export const setType = (type: FilterType) => promptsFilterStore.setState({type});
export const setMeta = (meta: FilterMeta) => promptsFilterStore.setState({meta});
export const setCategory = (category: string) => promptsFilterStore.setState({category});
export const setName = (name: string) => promptsFilterStore.setState({name});
export const setTag = (tag: string) => promptsFilterStore.setState({tag});

export const setPromptsFilter = (promptsFilter: Filter[]) => promptsFilterStore.setState({promptsFilter});


export default promptsFilterStore;
