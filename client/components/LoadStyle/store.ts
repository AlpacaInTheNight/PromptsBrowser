import { create } from 'zustand'


export type LoadStyleStore = {
    iterate: number;
    selectedCollection: string;
    selectedName: string;
    selectedIndex: number | undefined;
    selectedStyle: string;

    newName: string;

    isSimpleView: boolean;
    filterStyleCollection: string;
    filterStyleName: string;
}

const loadStyleStore = create<LoadStyleStore>((set) => ({
    iterate: 0,
    selectedCollection: "",
    selectedName: "",
    selectedIndex: undefined,
    selectedStyle: "",

    newName: "",

    isSimpleView: true,
    filterStyleCollection: "",
    filterStyleName: "",
}));

export const iterateStore = () => loadStyleStore.setState({iterate: loadStyleStore.getState().iterate + 1});

export const setSelectedStyle = (selectedStyle: string) => loadStyleStore.setState({selectedStyle});
export const setSelectedCollection = (selectedCollection: string) => loadStyleStore.setState({selectedCollection});
export const setSelectedName = (selectedName: string) => loadStyleStore.setState({selectedName});
export const setSelectedIndex = (selectedIndex?: number) => loadStyleStore.setState({selectedIndex});

export const setNewName = (newName: string) => loadStyleStore.setState({newName});

export const setIsSimpleView = (isSimpleView: boolean) => loadStyleStore.setState({isSimpleView});
export const setFilterStyleCollection = (filterStyleCollection: string) => loadStyleStore.setState({filterStyleCollection});
export const setFilterStyleName = (filterStyleName: string) => loadStyleStore.setState({filterStyleName});

export default loadStyleStore;
