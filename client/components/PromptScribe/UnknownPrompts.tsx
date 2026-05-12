import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import Database from 'client/Database';
import previewStore from 'client/components/PreviewSave/store';
import promptScribeStore from './store';
import ActivePrompts from 'client/managers/ActivePrompts';
import PromptItem from 'client/components/PromptItem';
import { NEW_CARD_GRADIENT } from 'client/const';
import onTogglePrompt from './events/onTogglePrompt';
import onSelectAll from './events/onSelectAll';


export default function UnknownPrompts() {
    const {data} = Database;
    let database = data.united;
    const previewCollection = previewStore(state => state.previewCollection);
    const newInAllCollections = promptScribeStore(state => state.newInAllCollections);
    const selectedNewPrompts = promptScribeStore(state => state.selectedNewPrompts);
    const uniquePrompts = ActivePrompts.getUnique();

    useEffect(() => {
        onSelectAll();
    }, []);

    if(!newInAllCollections && previewCollection && data.original[previewCollection]) {
        database = data.original[previewCollection];
    }

    let unknownPromptsList = [];

    for(const item of uniquePrompts) {
        if(item.isSyntax) continue;
        let isKnown = false;

        for(const knownPrompt of database) {
            if(knownPrompt.id.toLowerCase() === item.id.toLowerCase()) {
                isKnown = true;
                break;
            }
        }

        if(!isKnown) {
            unknownPromptsList.push(item);
        }
    }

    const JSXUnknownPrompts: JSX.Element[] = [];

    for(let prompt of unknownPromptsList) {
        
        JSXUnknownPrompts.push(
            <PromptItem
                key={prompt.id}
                id={prompt.id}
                src={NEW_CARD_GRADIENT}
                prompt={prompt}
                options={{
                    className: selectedNewPrompts.includes(prompt.id) ? "PBE_selectedNewElement" : "",
                }}

                onClick={onTogglePrompt}
            />
        );
        
    }

    return (
        <div className="PBE_dataBlock PBE_Scrollbar PBE_windowContent">
            {JSXUnknownPrompts}
        </div>
    )
}
