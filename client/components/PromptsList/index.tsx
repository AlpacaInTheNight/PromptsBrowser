import * as React from 'react'
import appStore from 'client/store'
import { PromptEntity } from 'clientTypes/prompt'
import { FilterSimple } from 'clientTypes/filter'
import getCards from './getCards'


export default function PromptsList(props: {
    iteration?: number;
    prompts: PromptEntity[];
    allowMove?: boolean;
    noWrap?: boolean;
    focusOn?: {index: number; groupId: number | false; };

    filterSimple?: FilterSimple;

    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onDblClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onWheel?: (e: React.WheelEvent<HTMLDivElement>) => void;
}) {
    const filesIteration = appStore(state => state.filesIteration);
    const filterCollection = appStore(state => state.filterCollection);

    const cards = getCards({...props, filesIteration, filterCollection});

    return (
        <>
            {cards}
        </>
    )
}
