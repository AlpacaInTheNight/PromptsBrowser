import * as React from 'react'
import { PromptEntity } from 'clientTypes/prompt'
import Database from 'client/Database'
import { FilterSimple } from 'clientTypes/filter'
import PromptItem from 'client/components/PromptItem/index'
import GroupItem from 'client/components/PromptItem/GroupItem'
import sortPrompts from './utils/sortPrompts'
import { checkFilter } from '../ui/PromptsSimpleFilter'
import appStore from 'client/store'


export default function getCards(props: {
    prompts: PromptEntity[];
    allowMove?: boolean;
    noWrap?: boolean;
    focusOn?: {index: number; groupId: number | false; };
    filterSimple?: FilterSimple;

    filesIteration?: number;
    filterCollection?: string;

    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onDblClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onWheel?: (e: React.WheelEvent<HTMLDivElement>) => void;
}) {
    const {prompts, focusOn, filesIteration, filterCollection, allowMove = false, noWrap = false} = props;
    const {filterSimple} = props;
    const {onClick, onDblClick, onWheel} = props;
    const {editPromptGroup, editPromptIndex} = appStore.getState();
    const JSXCards: React.JSX.Element[] = [];

    if(filterSimple?.sorting) sortPrompts(prompts, filterSimple.sorting);

    for(let index = 0; index < prompts.length; index++) {
        const promptItem = prompts[index];
        const useIndex = promptItem.index !== undefined ? promptItem.index : index;

        if("groupId" in promptItem) {
            let groupCards: React.JSX.Element[]

            if(!promptItem.folded) groupCards = getCards({...props, prompts: promptItem.prompts});

            JSXCards.push(
                <GroupItem
                    key={"group_" + promptItem.groupId}
                    index={useIndex}
                    group={promptItem}
                    noWrap={noWrap}
                    allowMove={allowMove}
                    onClick={onClick}
                    onWheel={onWheel}
                >
                    {groupCards}
                </GroupItem>
            );

            continue;
        }

        //check filters
        if(filterSimple && !checkFilter(promptItem.id, filterSimple)) continue;

        const {id, parentGroup = false, isSyntax = false} = promptItem;
        let isShadowed: boolean = false;
        if(focusOn) {
            isShadowed = true;
            if(useIndex === focusOn.index && parentGroup === focusOn.groupId) isShadowed = false;
        }

        let isSelected: boolean = false;
        if(editPromptGroup === parentGroup && editPromptIndex === useIndex) isSelected = true;

        const imageSrc = Database.getPromptPreviewURL({prompt: promptItem.id, filesIteration, collectionId: filterCollection});

        let key = `${index}_${promptItem.id}`;
        if(promptItem.parentGroup !== false) key += `_${promptItem.parentGroup}`;

        JSXCards.push(
            <PromptItem
                key={key}
                id={promptItem.id}
                src={imageSrc}
                prompt={promptItem}
                options={{
                    index: useIndex,
                    parentGroup,
                    isShadowed,
                    allowMove: isSyntax ? false : allowMove,
                    className: isSelected ? "PBE_selectedCurrentElement" : "",
                }}

                onClick={isSyntax ? undefined : onClick}
                onDblClick={isSyntax ? undefined : onDblClick}
                onWheel={isSyntax ? undefined : onWheel}
            />
        );
    }

    return JSXCards;
}
