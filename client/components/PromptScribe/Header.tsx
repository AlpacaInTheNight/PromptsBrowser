import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import Database from 'client/Database';
import previewStore, {setPreviewCollection} from 'client/components/PreviewSave/store';
import ToggleButton from 'client/components/ui/ToggleButton';
import promptScribeStore, {setNewInAllCollections} from './store';
import onToggleAll from './events/onToggleAll';
import onSelectAll from './events/onSelectAll';
import onAddNewPrompts from './events/onAddNewPrompts';


export default function Header() {
    const {data} = Database;
    const previewCollection = previewStore(state => state.previewCollection);
    const newInAllCollections = promptScribeStore(state => state.newInAllCollections);

    const JSXCollections: JSX.Element[] = [];

    for(const collectionId in data.original) {
        JSXCollections.push(
            <option value={collectionId} key={collectionId}>{collectionId}</option>
        )
    }

    return (
        <div className="PBE_newPromptsHeader">
            <button
                className="PBE_button"
                style={{
                    marginRight: "10px",
                }}
                onClick={onToggleAll}
            >
                Toggle all
            </button>

            <ToggleButton
                name="All collections"
                title="Toggle if only unknown in all collections should be shown or only in the current collection"
                toggled={newInAllCollections}
                onChange={toggled => {
                    setNewInAllCollections(toggled);
                    onSelectAll();
                }}
                style={{
                    height: "24px",
                }}
            />

            <select
                className="PBE_generalInput PBE_select"
                style={{
                    height: "30px",
                }}
                onChange={e => {
                    setPreviewCollection(e.currentTarget.value);
                    onSelectAll();
                }}
                value={previewCollection}
            >
                {JSXCollections}
            </select>

            <button
                className="PBE_button"
                style={{
                    marginLeft: "10px",
                }}
                onClick={onAddNewPrompts}
            >
                Add new prompts
            </button>
        </div>
    )
}
