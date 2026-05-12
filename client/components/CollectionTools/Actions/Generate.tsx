import * as React from 'react';
import { JSX, useState, useEffect } from 'react';
import Database from 'client/Database';
import collectionToolsStore, { setGenerateMode } from '../store';
import onGeneratePreviews from '../events/onGeneratePreviews';


export default function Generate() {
    const {data} = Database;
    const generateMode = collectionToolsStore(state => state.generateMode);

    const JSXStyleCollections: JSX.Element[] = [];

    for(const colId in data.styles) JSXStyleCollections.push(<option value={colId} key={colId}>{colId}</option>);

    return (
        <fieldset className="PBE_fieldset">
            <legend>Generate preview</legend>

            <select
                className="PBE_generalInput PBE_select"
                value={generateMode}
                onChange={e => setGenerateMode(e.currentTarget.value)}
            >
                <option value="prompt">Prompt only</option>
                <option value="current">With current prompts</option>
                <option value="autogen">With prompt autogen style</option>
                <option value="selected">With selected autogen style</option>
            </select>

            <button
                className="PBE_button"
                onClick={onGeneratePreviews}
            >
                Generate
            </button>
        </fieldset>
    );
}
