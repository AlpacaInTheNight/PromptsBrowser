import * as React from 'react';
import { JSX, useState, useEffect } from 'react';
import Database from 'client/Database';
import { setSortKnownPrompts } from 'client/store';


export default function ShowSorting({value = ""}: {
    value?: string;
}) {
    const JSXOptions: React.JSX.Element[] = [];

    for(const categoryItem of Database.data.categories) {
        JSXOptions.push(
            <option value={categoryItem} key={categoryItem}>{categoryItem}</option>
        )
    }

    for(const collectionId in Database.data.original) {
        JSXOptions.push(
            <option value={collectionId} key={collectionId}>{collectionId}</option>
        )
    }

    return (
        <select className="PBE_generalInput" value={value} onChange={e => setSortKnownPrompts(e.currentTarget.value)}>
            <option value="">Unsorted</option>
            <option value="reversed">Unsorted reversed</option>
            <option value="alph">Alphabetical</option>
            <option value="alphReversed">Alphabetical reversed</option>
        </select>
    )
}
