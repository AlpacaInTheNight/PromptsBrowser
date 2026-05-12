import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import { ConfigTrackStyleMeta } from "clientTypes/state"
import ConfigManager from 'client/managers/Config'
import CheckBox from 'client/components/ui/CheckBox'


export default function MetaCheckboxes({isUpdate = false}: {
    isUpdate?: boolean;
}) {
    const [iterate, setIterate] = useState(0);
    const {saveStyleMeta = {} as ConfigTrackStyleMeta, updateStyleMeta = {} as ConfigTrackStyleMeta} = ConfigManager.getConfig();
    const targetMeta = isUpdate ? updateStyleMeta : saveStyleMeta;

    return (
        <fieldset className="PBE_fieldset PBE_styleMetaCheckboxes" data-iterate={iterate}>
            <legend>Save meta:</legend>

            <CheckBox
                name={"Seed"}
                checked={targetMeta.seed}

                onChange={checked => {
                    targetMeta.seed = checked;
                    ConfigManager.setConfig();
                    setIterate(iterate + 1);
                }}
            />

            <CheckBox
                name={"Positive"}
                checked={targetMeta.positive}

                onChange={checked => {
                    targetMeta.positive = checked;
                    ConfigManager.setConfig();
                    setIterate(iterate + 1);
                }}
            />

            <CheckBox
                name={"Negative"}
                checked={targetMeta.negative}

                onChange={checked => {
                    targetMeta.negative = checked;
                    ConfigManager.setConfig();
                    setIterate(iterate + 1);
                }}
            />

            <CheckBox
                name={"Size"}
                checked={targetMeta.size}

                onChange={checked => {
                    targetMeta.size = checked;
                    ConfigManager.setConfig();
                    setIterate(iterate + 1);
                }}
            />

            <CheckBox
                name={"Sampler"}
                checked={targetMeta.sampler}

                onChange={checked => {
                    targetMeta.sampler = checked;
                    ConfigManager.setConfig();
                    setIterate(iterate + 1);
                }}
            />

            <CheckBox
                name={"Quality"}
                checked={targetMeta.quality}

                onChange={checked => {
                    targetMeta.quality = checked;
                    ConfigManager.setConfig();
                    setIterate(iterate + 1);
                }}
            />
        </fieldset>
    )
}
