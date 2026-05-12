import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import Database from 'client/Database'
import ActivePrompts from 'client/managers/ActivePrompts'
import PromptItem from 'client/components/PromptItem'
import appStore from 'client/store'
import promptToolsStore from './store';
import onSelectNew from './events/onSelectNew';
import { PossiblePrompts } from './type';
import sortPrompts from './utils/sortPrompts';
import getPossible from './utils/getPossible';


export default function PromptsPossible({index, groupId}: {
    index: number;
    groupId: number | false;
}) {
    const filesIteration = appStore(state => state.filesIteration);
    const filterCollection = appStore(state => state.filterCollection);
    const selectedPrompt = appStore(state => state.selectedPrompt);
    const iterate = promptToolsStore(state => state.iterate);
    const filtersPossible = promptToolsStore(state => state.filtersPossible);

    const showAll = promptToolsStore(state => state.showAll);
    const simByCategory = promptToolsStore(state => state.simByCategory);
    const simByName = promptToolsStore(state => state.simByName);
    const simByTags = promptToolsStore(state => state.simByTags);

    const {sorting = "sim"} = filtersPossible;
    const uniquePrompts = ActivePrompts.getUniqueIds();

    const targetPrompt = ActivePrompts.getPromptByIndex(index, groupId);
    if(!targetPrompt || !targetPrompt.id) return;

    const possiblePrompts: PossiblePrompts[] = [];
    const addedIds: string[] = [];

    getPossible({
        targetPrompt, possiblePrompts, filtersPossible,
        showAll, simByTags, simByCategory, simByName,
    });

    sortPrompts({sorting, possiblePrompts});

    const JSXPossiblePrompts: JSX.Element[] = [];

    possiblePrompts.forEach((promptItem, index) => {
        if(addedIds.includes(promptItem.id)) return;
        const isShadowed = uniquePrompts.includes(promptItem.id);
        addedIds.push(promptItem.id);

        const imageSrc = Database.getPromptPreviewURL({prompt: promptItem.id, filesIteration, collectionId: filterCollection});
        let key = `${index}_${promptItem.id}`;

        JSXPossiblePrompts.push(
            <PromptItem
                key={key}
                id={promptItem.id}
                src={imageSrc}
                prompt={promptItem}
                options={{
                    isShadowed,
                }}
                onClick={onSelectNew}
            />
        );
    });

    return (
        <div className="PBE_dataBlock PBE_Scrollbar PBE_windowContent" data-iterate={iterate} data-selected={selectedPrompt}>
            {JSXPossiblePrompts}
        </div>
    )
}
