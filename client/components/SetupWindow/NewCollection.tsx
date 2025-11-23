import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import setupWindowStore, {setColType} from './store';
import { CollectionFormat } from 'client/types/collection';
import onChangeName from './events/onChangeName';


export default function NewCollection({isStyles = false}: {
    isStyles?: boolean;
}) {
    const colName = setupWindowStore(state => state.colName);
    const colType = setupWindowStore(state => state.colType);

    return (
        <>
            <div className="PBE_row PBE_setupWindowTopBlock">
                {isStyles ?
                    "New styles collection"
                    :
                    "New prompts collection"
                }
            </div>
        
            <div className="PBE_windowContent PBE_Scrollbar">

                <div
                    className="PBE_rowBlock"
                    style={{
                        maxWidth: "none",
                    }}
                >
                    <div>Collection name</div>

                    <input
                        maxLength={100}
                        className="PBE_generalInput PBE_input PBE_newCollectionName"
                        type="text"
                        value={colName}
                        onChange={onChangeName}
                    />
                </div>

                <div
                    className="PBE_rowBlock"
                    style={{
                        maxWidth: "none",
                    }}
                >
                    <div>Store format</div>

                    <select
                        className="PBE_generalInput PBE_select PBE_newCollectionFormat"
                        value={colType}
                        onChange={e => setColType(e.currentTarget.value as CollectionFormat)}
                    >
                        <option value={CollectionFormat.SHORT}>Short</option>
                        <option value={CollectionFormat.EXPANDED}>Expanded</option>
                    </select>
                </div>

            </div>

        </>
    )
}
