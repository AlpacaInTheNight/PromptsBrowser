import * as React from 'react';
import { JSX, useState, useEffect } from 'react';
import Database from 'client/Database';
import collectionToolsStore, { setCopyOrMoveTo } from '../store';
import appStore from 'client/store';
import onMoveSelected from '../events/onMoveSelected';


export default function Copy() {
    const {data} = Database;
    const filterCollection = appStore(state => state.filterCollection);
    let copyOrMoveTo = collectionToolsStore(state => state.copyOrMoveTo);
    const JSXCollections: JSX.Element[] = [];

    for(const collectionId in data.original) {
        if(collectionId === filterCollection) continue;
        if(!copyOrMoveTo) copyOrMoveTo = collectionId;

        JSXCollections.push(
            <option value={collectionId} key={collectionId}>{collectionId}</option>
        );
    }

    return (
        <fieldset className="PBE_fieldset">
            <legend>Collection</legend>

            <select
                className="PBE_generalInput PBE_select"
                value={copyOrMoveTo}
                onChange={e => setCopyOrMoveTo(e.currentTarget.value)}
            >
                {JSXCollections}
            </select>

            <button
                className="PBE_button"
                title="Move selected prompts to the target collection"
                onClick={e => onMoveSelected()}
            >
                Move
            </button>

            <button
                className="PBE_button"
                title="Copy selected prompts to the target collection"
                onClick={e => onMoveSelected(true)}
            >
                Copy
            </button>
        </fieldset>
    );
}
