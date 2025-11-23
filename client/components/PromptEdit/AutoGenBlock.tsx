import * as React from 'react'
import { JSX, useState, useEffect } from 'react'
import appStore from 'client/store'
import Database from 'client/Database';


export default function AutoGenBlock() {
    const [iterate, setIterate] = useState(0);
    const {editPrompt} = appStore.getState();
    const {data} = Database;
    const JSXCollections: JSX.Element[] = [];
    const JSXStyles: JSX.Element[] = [];
    const {autogen = {}} = editPrompt;

    for(const colId in data.styles) JSXCollections.push(<option key={colId} value={colId}>{colId}</option>);

    if(autogen.collection) {
        const targetCollection = data.styles[autogen.collection];
        if(targetCollection) {
            for(const styleItem of targetCollection) {
                JSXStyles.push(<option key={styleItem.name} value={styleItem.name}>{styleItem.name}</option>);
            }
        }
    }

    return (
        <div
            data-iterate={iterate}
            className="PBE_rowBlock"
            style={{
                height: "40px",
            }}
        >
            Autogen:
            <select
                id="PBE_autoGentCollection"
                className="PBE_generalInput"
                value={autogen.collection || "__none"}
                onChange={e => {
                    const value = e.currentTarget.value;
                    if(!editPrompt.autogen) editPrompt.autogen = {};
                    
                    if(!value || value === "__none") {
                        delete editPrompt.autogen;
                        setIterate(iterate + 1);
                        return;
                    }

                    editPrompt.autogen.collection = value;
                    const targetCollection = data.styles[value];
                    if(!targetCollection) return;
                    editPrompt.autogen.style = "";

                    for(const styleItem of targetCollection) {
                        editPrompt.autogen.style = styleItem.name;
                        break;
                    }

                    setIterate(iterate + 1);
                }}
            >
                <option value="__none">None</option>
                {JSXCollections}
            </select>

            <select
                id="PBE_autoGentStyle"
                className="PBE_generalInput"
                value={autogen.style || ""}
                onChange={e => {
                    if(!editPrompt.autogen) editPrompt.autogen = {};
                    editPrompt.autogen.style = e.currentTarget.value;
                    setIterate(iterate + 1);
                }}
            >
                {JSXStyles}
            </select>
        </div>
    )
}
