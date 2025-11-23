import * as React from 'react'
import Database from 'client/Database/index'
import appStore from 'client/store'
import { JSX, useState, useEffect } from 'react'
import onMovePrompt from './events/onMovePrompt'
import onCopyPrompt from './events/onCopyPrompt'


export default function CollectionAction() {
    const {data} = Database;
    const {united} = data;
    const editPrompt = appStore(state => state.editPrompt);
    const filesIteration = appStore(state => state.filesIteration);
    const targetItem = united.find(item => item.id === editPrompt.id);
    const [copyOrMoveTo, setCopyOrMoveTo] = useState("");
    
    let firstPossibleCollection: string | false = false;
    const JSXOptions: JSX.Element[] = [];

    for(const collectionId in data.original) {
        if(targetItem && targetItem?.collections.includes(collectionId)) continue;

        if(!firstPossibleCollection) firstPossibleCollection = collectionId;

        JSXOptions.push(
            <option key={collectionId} value={collectionId}>{collectionId}</option>
        );
    }

    useEffect(() => {
        if(firstPossibleCollection) setCopyOrMoveTo(firstPossibleCollection);
    }, [1]);

    if(!targetItem) return <div />;
    if(!firstPossibleCollection) return <div />;

    return (
        <div className="PBE_rowBlock" data-iteration={filesIteration} >
            <select
                className="PBE_generalInput"
                value={copyOrMoveTo}
                onChange={e => setCopyOrMoveTo(e.currentTarget.value)}
            >
                {JSXOptions}
            </select>

            <button
                className="PBE_button"
                onClick={() => onCopyPrompt({copyOrMoveTo})}
            >
                Copy
            </button>

            <button
                className="PBE_button"
                onClick={() => onMovePrompt({copyOrMoveTo})}
            >
                Move
            </button>
        </div>
    )
}
