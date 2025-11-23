import * as React from 'react';
import { JSX, useState, useEffect } from 'react';
import Database from 'client/Database';
import collectionToolsStore, { setAutogenStyle } from '../store';
import onChangeAutogenCollection from '../events/onChangeAutogenCollection';
import onAssignAutogenStyle from '../events/onAssignAutogenStyle';


export default function Autogen() {
    const {data} = Database;
    const autogenCol = collectionToolsStore(state => state.autogenCol);
    const autogenStyle = collectionToolsStore(state => state.autogenStyle);

    const JSXStyleCollections: JSX.Element[] = [];
    const JSXStyleItems: JSX.Element[] = [];
    for(const colId in data.styles) JSXStyleCollections.push(<option value={colId} key={colId}>{colId}</option>);

    if(autogenCol) {
        const targetCollection = data.styles[autogenCol];
        if(targetCollection) {
            for(const styleItem of targetCollection)
                JSXStyleItems.push(<option value={styleItem.name} key={styleItem.name}>{styleItem.name}</option>);
        }
    }

    return (
        <fieldset className="PBE_fieldset">
            <legend>Autogenerate style</legend>

            <select
                className="PBE_generalInput PBE_select"
                value={autogenCol}
                onChange={onChangeAutogenCollection}
            >
                <option value={""}>None</option>
                {JSXStyleCollections}
            </select>

            <select
                className="PBE_generalInput PBE_select"
                value={autogenStyle}
                onChange={e => setAutogenStyle(e.currentTarget.value)}
            >
                <option value={""}>None</option>
                {JSXStyleItems}
            </select>

            <button
                className="PBE_button"
                title=""
                onClick={onAssignAutogenStyle}
            >
                Assign
            </button>
        </fieldset>
    );
}
