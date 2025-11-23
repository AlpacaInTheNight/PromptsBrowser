import { create } from 'zustand'
import { PossibleTag } from './type';


export const TagTooltipStaticStore: {
    onUpdate: ((tags: string[]) => void) | undefined;
} = {
    onUpdate: undefined,
}

export type TagTooltipStore = {
    iterate: number;
    selectedIndex: number;
    knownTags: string[];
    possibleTags: PossibleTag[];

    autocompliteBox: HTMLDivElement | undefined;
    inputElement: HTMLInputElement | undefined;
}

const tagTooltipStore = create<TagTooltipStore>((set) => ({
    iterate: 0,
    selectedIndex: 0,
    knownTags: [],
    possibleTags: [],

    autocompliteBox: undefined,
    inputElement: undefined,
}));

export const iterateStore = () => tagTooltipStore.setState({iterate: tagTooltipStore.getState().iterate + 1});

export const setSelectedIndex = (selectedIndex: number) => tagTooltipStore.setState({selectedIndex});
export const setKnownTags = (knownTags: string[]) => tagTooltipStore.setState({knownTags});
export const setAutocompliteBox = (autocompliteBox: HTMLDivElement | undefined) => tagTooltipStore.setState({autocompliteBox});
export const setInputElement = (inputElement: HTMLInputElement | undefined) => tagTooltipStore.setState({inputElement});

export const setPossibleTags = (possibleTags: PossibleTag[]) => tagTooltipStore.setState({ possibleTags });

export default tagTooltipStore;
