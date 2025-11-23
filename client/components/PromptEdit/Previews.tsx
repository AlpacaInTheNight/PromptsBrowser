import * as React from 'react'
import { JSX, useState, useEffect } from 'react'
import Database from 'client/Database'
import Prompt from 'client/types/prompt'
import PromptItem from 'client/components/PromptItem/index'


export default function ShowPreviews({prompt}: {
    prompt: Prompt;
}) {
    const {data} = Database;
    const {unitedList} = data;
    const targetItem = unitedList[prompt.id];
    if(!targetItem) return;
    const {knownPreviews = {}, knownModelPreviews = {}} = targetItem;
    const JSXPromptPreviews: JSX.Element[] = [];

    for(let collectionId in knownModelPreviews) {
        const collectionPreviews = knownModelPreviews[collectionId];

        for(let modelId in collectionPreviews) {
            const id = `${collectionId} - ${modelId}`;
            let url: string = Database.getPromptPreviewURL({prompt: prompt.id, collectionId, model: modelId});

            JSXPromptPreviews.push(
                <PromptItem
                    key={id}
                    id={id}
                    prompt={{id}}
                    src={url}
                />
            );
        }
    }

    for(let collectionId in knownPreviews) {
        const id = `${collectionId}`;
        let url: string = Database.getPromptPreviewURL({prompt: prompt.id, collectionId, model: false});

        JSXPromptPreviews.push(
            <PromptItem
                key={id}
                id={id}
                prompt={{id}}
                src={url}
            />
        );
    }

    return (
        <div
            className="PBE_dataBlock PBE_Scrollbar"
            style={{maxWidth: "500px"}}
        >
            {JSXPromptPreviews}
        </div>
    )
}
