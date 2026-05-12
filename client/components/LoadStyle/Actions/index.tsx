import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import Database from 'client/Database'
import loadStyleStore from '../store'
import MetaCheckboxes from './MetaCheckboxes';
import StyleSetup from './StyleSetup';
import StyleName from './StyleName';
import ActionButtons from './ActionButtons';
import EditButtons from './EditButtons';
import SystemButtons from './SystemButtons';


export default function Actions() {
    const {readonly = false} = Database.meta;
    const isSimpleView = loadStyleStore(state => state.isSimpleView);

    if(!isSimpleView) {
        if(!readonly) {
            return (
                <div className="PBE_collectionToolsActions PBE_row">
                    <StyleName />
                    <MetaCheckboxes isUpdate={true} />
                    <StyleSetup isUpdate={true} />
                </div>
            )
        }

        return <div style={{display: "none"}} />;
    }

    return (
        <div className="PBE_collectionToolsActions PBE_row">
            <ActionButtons />

            {readonly === false && <>
                
                <EditButtons />
                <StyleName />
                <MetaCheckboxes isUpdate={true} />
                <StyleSetup isUpdate={true} />
                <SystemButtons />

            </>}
        </div>
    )
}
