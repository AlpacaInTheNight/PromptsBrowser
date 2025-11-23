import { create } from 'zustand'
import {PromptHintItem} from './types'


type TooltipStore = {
    start: number;
    end: number;
    word: string;
    selected: number;
    hints: PromptHintItem[];
}

const tooltipStore = create<TooltipStore>((set) => ({
    start: 0,
    end: 0,
    word: "",
    selected: 0,
    hints: [],
}));

const setStart = (start: number) => tooltipStore.setState({start});
const setEnd = (end: number) => tooltipStore.setState({end});
const setWord = (word: string) => tooltipStore.setState({word});
const setSelected = (selected: number) => tooltipStore.setState({selected});
const setHints = (hints: PromptHintItem[]) => tooltipStore.setState({hints});

export default tooltipStore;

export {
    TooltipStore,
    tooltipStore,

    setWord,
    setSelected,
    setHints,
    setStart,
    setEnd,
}
