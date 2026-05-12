import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import appStore, {setShowPromptTools} from 'client/store'
import mount from './mount'
import ActivePrompts from 'client/managers/ActivePrompts'
import Database from 'client/Database'
import FiltersCurrent from './FiltersCurrent'
import FiltersPossible from './FiltersPossible'
import PromptsPossible from './PromptsPossible'
import PromptsCurrent from './PromptsCurrent'


export {mount}

export default function PromptTools({parent}: {
    parent: HTMLDivElement;
}) {
    const showPromptTools = appStore(state => state.showPromptTools);
    const index = appStore(state => state.editPromptIndex);
    const groupId = appStore(state => state.editPromptGroup);

    useEffect(() => {
        if(!showPromptTools) {
            parent.style.display = "none";
        } else {
            parent.style.display = "flex";
        }
    }, [showPromptTools]);

    if(!showPromptTools || index === false) return <div />;

    const targetPrompt = ActivePrompts.getPromptByIndex(index, groupId);

    if(!targetPrompt || !targetPrompt.id) return <div />;

    return (
        <>
            <div
                className="PBE_toolsBackImage"
                style={{
                    backgroundImage: Database.getPromptPreviewURL({prompt: targetPrompt.id}),
                }}
            />

            <FiltersCurrent />

            <PromptsCurrent />

            <FiltersPossible />

            <PromptsPossible index={index} groupId={groupId} />

            <div className="PBE_rowBlock PBE_rowBlock_wide" style={{zIndex: 1}}>
                <button
                    className="PBE_button"
                    onClick={() => setShowPromptTools(false)}
                >
                    Close
                </button>
            </div>
        </>
    );
}
