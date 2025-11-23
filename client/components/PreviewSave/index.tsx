import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import Database from 'client/Database';
import appStore from 'client/store';
import previewStore, {setPreviewCollection} from './store';
import useSetDefault from './hooks/useSetDefault';


export default function PreviewSave({tabName}: {
    tabName: string;
}) {
    const selectedPrompt = appStore(state => state.selectedPrompt);
    const previewCollection = previewStore(state => state.previewCollection);
    const {data} = Database;
    const {readonly} = Database.meta;

    useSetDefault(previewCollection, tabName);

    if(readonly || !selectedPrompt) return <div style={{display: "none"}}/>;

    const JSXOptions: JSX.Element[] = [];
    for(const collectionId in data.original) {
        JSXOptions.push(
            <option key={collectionId} value={collectionId}>{collectionId}</option>
        )
    }

    return (
        <>
            <select
                className="PBE_generalInput PBE_select PBE_savePromptSelect"
                onChange={e => setPreviewCollection(e.currentTarget.value)}
                value={previewCollection}
            >
                {JSXOptions}
            </select>

            <div
                className="PBE_actionButton PBE_savePromptPreview"
                title="Save the generated preview for the selected prompt"
                onClick={() => Database.savePromptPreview()}
            >
                Save preview
            </div>
        </>
    )
}
