import { create } from 'zustand'
import {PromptHintItem} from './types'


export type TooltipStore = {
    isActive: boolean;

    start: number;
    end: number;
    word: string;
    hints: PromptHintItem[];
}

const tooltipStore = create<TooltipStore>((set) => ({
    isActive: false,

    start: 0,
    end: 0,
    word: "",
    selected: 0,
    hints: [],
}));

export const setStart = (start: number) => tooltipStore.setState({start});
export const setEnd = (end: number) => tooltipStore.setState({end});
export const setWord = (word: string) => tooltipStore.setState({word});
export const setHints = (hints: PromptHintItem[]) => tooltipStore.setState({hints});
export const setIsActive = (isActive: boolean) => tooltipStore.setState({isActive});

export default tooltipStore;

export {
    tooltipStore,
}
