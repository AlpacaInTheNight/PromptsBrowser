import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import { AddStyleType } from "clientTypes/style";
import { ConfigTrackStyleMeta } from "clientTypes/state"
import ConfigManager from 'client/managers/Config'


export default function StyleSetup({isUpdate = false}: {
    isUpdate?: boolean;
}) {
    const [iterate, setIterate] = useState(0);
    const {saveStyleMeta = {} as ConfigTrackStyleMeta, updateStyleMeta = {} as ConfigTrackStyleMeta} = ConfigManager.getConfig();
    const targetMeta = isUpdate ? updateStyleMeta : saveStyleMeta;

    return (
        <fieldset className="PBE_fieldset PBE_styleCofig" data-iterate={iterate}>
            <legend>Addition Type:</legend>

            <select
                className="PBE_generalInput PBE_select PBE_addStyleTypeSelect"
                value={targetMeta.addType || AddStyleType.UniqueRoot}
                onChange={e => {
                    targetMeta.addType = e.currentTarget.value as AddStyleType;
                    ConfigManager.setConfig();
                    setIterate(iterate + 1);
                }}
            >
                <option value={AddStyleType.All}>All</option>
                <option value={AddStyleType.UniqueRoot}>Unique at root</option>
                <option value={AddStyleType.UniqueOnly}>Unique all</option>
            </select>
        </fieldset>
    )
}
