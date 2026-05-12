import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import saveStyleStore, {setCollectionId, setStyleName} from './store';
import Database from 'client/Database';
import MetaCheckboxes from 'client/components/LoadStyle/Actions/MetaCheckboxes';
import StyleSetup from 'client/components/LoadStyle/Actions/StyleSetup';
import onSaveStyle from './events/onSaveStyle';


export default function AddStyle() {
    const {data} = Database;
    const JSXCollectionOptions: JSX.Element[] = [];
    const collectionId = saveStyleStore(state => state.collectionId);
    const styleName = saveStyleStore(state => state.styleName);

    useEffect(() => {
        if(!collectionId) for(const collectionId in data.styles) {
            setCollectionId(collectionId);

            break;
        }
    }, []);

    for(const collectionId in data.styles) {
        JSXCollectionOptions.push(
            <option value={collectionId} key={collectionId}>{collectionId}</option>
        );
    }

    return (
        <div className="PBE_row">

            <div className="PBE_List PBE_stylesSetup">
                <input
                    value={styleName}
                    onChange={e => setStyleName(e.currentTarget.value)}
                    maxLength={100}
                    className="PBE_generalInput PBE_newStyleName"
                    placeholder="Style name"
                    id="PBE_newStyleName"
                />

                <div className="PBE_row">
                    <select
                        value={collectionId}
                        onChange={e => setCollectionId(e.currentTarget.value)}
                        className="PBE_generalInput PBE_select"
                        style={{
                            height: "30px",
                            marginRight: "5px",
                        }}
                    >
                        {JSXCollectionOptions}
                    </select>

                    <button
                        className="PBE_button"
                        onClick={onSaveStyle}
                    >
                        Save as style
                    </button>
                </div>
            </div>

            <MetaCheckboxes />

            <StyleSetup />
        </div>
    );
}
