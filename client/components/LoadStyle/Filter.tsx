import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import Database from 'client/Database'
import loadStyleStore, {setIsSimpleView, setFilterStyleCollection, setFilterStyleName} from './store';


export default function Filter() {
    const {data} = Database;
    const isSimpleView = loadStyleStore(state => state.isSimpleView);
    const filterStyleCollection = loadStyleStore(state => state.filterStyleCollection);
    const filterStyleName = loadStyleStore(state => state.filterStyleName);

    const JSXStyles: JSX.Element[] = [];
    for(const collectionId in data.styles) {
        JSXStyles.push(
            <option key={collectionId} value={collectionId}>{collectionId}</option>
        );
    }

    return (
        <div className="PBE_row PBE_stylesFilter">
            <div
                title="Toggles simplified view mode"
                className={isSimpleView ? "PBE_toggleButton PBE_toggledButton" : "PBE_toggleButton"}
                style={{height: "16px"}}
                onClick={() => setIsSimpleView(!isSimpleView)}
            >
                Simple mode
            </div>

            <select
                value={filterStyleCollection}
                onChange={e => setFilterStyleCollection(e.currentTarget.value)}
                className="PBE_generalInput PBE_select"
            >
                <option value="">Any</option>
                {JSXStyles}
            </select>

            <input
                value={filterStyleName}
                placeholder="Search name"
                className="PBE_generalInput PBE_input"
                onChange={e => setFilterStyleName(e.currentTarget.value)}
            />
        </div>
    );
}
