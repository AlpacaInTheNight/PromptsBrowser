import { create } from 'zustand'
import { CollectionFormat } from 'client/types/collection'


export type SetupWindowStore = {
    iterate: number;

    colName: string;
    colType: CollectionFormat;
    mode: "main" | "prompts" | "styles";
}

const setupWindowStore = create<SetupWindowStore>((set) => ({
    iterate: 0,

    colName: "",
    colType: CollectionFormat.SHORT,
    mode: "main",
}));

export const iterateStore = () => setupWindowStore.setState({iterate: setupWindowStore.getState().iterate + 1});

export const setMode = (mode: "main" | "prompts" | "styles") => setupWindowStore.setState({mode});
export const setColName = (colName: string) => setupWindowStore.setState({colName});
export const setColType = (colType: CollectionFormat) => setupWindowStore.setState({colType});

export default setupWindowStore;
