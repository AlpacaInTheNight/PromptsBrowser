import * as React from 'react'
import { JSX, useState, useEffect } from 'react'
import appStore, {setEditPrompt, setEditTargetCollection} from 'client/store'
import Database from 'client/Database'


export default function CollectionSelector() {
    const {data} = Database;
    const {united} = data;
    const editPrompt = appStore(state => state.editPrompt);
    const editTargetCollection = appStore(state => state.editTargetCollection);
    const targetItem = united.find(item => item.id === editPrompt.id);
    const JSXOptions: JSX.Element[] = [];
    if(!targetItem || !targetItem.collections) return <div />;

    if(targetItem.collections.length === 1) {
        return (
            <div className="PBE_promptEditSingleCollection">
                {targetItem.collections[0]}
            </div>
        );
    }

    for(const collectionItem of targetItem.collections) {
        JSXOptions.push(
            <option key={collectionItem} value={collectionItem}>{collectionItem}</option>
        );
    }

    return (
        <select
            className="PBE_generalInput"
            value={editTargetCollection}
            onChange={e => {
                const value = e.currentTarget.value;
                setEditTargetCollection(value);

                const {united, original} = Database.data;
                if(!targetItem) return;

                let collection = original[value];
                if(!collection) return false;

                const originalItem = collection.find(item => item.id === targetItem.id);
                if(!originalItem) return false;

                setEditPrompt(originalItem);
            }}
        >
            {JSXOptions}
        </select>
    )
}
