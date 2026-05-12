import * as React from 'react';
import { JSX, useState, useEffect } from 'react';
import Database from 'client/Database';
import { setFilterCollection } from 'client/store';
import appStore from 'client/store';


export default function ShowCollections({value = ""}: {
    value?: string;
}) {
    const collectionsIteration = appStore(state => state.collectionsIteration);

    const JSXOptions: React.JSX.Element[] = [];

    for(const collectionId in Database.data.original) {
        JSXOptions.push(
            <option value={collectionId} key={collectionId}>{collectionId}</option>
        )
    }

    return (
        <select
            data-iterate={collectionsIteration}
            className="PBE_generalInput"
            value={value}
            onChange={e => setFilterCollection(e.currentTarget.value)}
        >
            <option value="">All collections</option>
            {JSXOptions}
        </select>
    )
}
