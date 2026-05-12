import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import Database from 'client/Database'
import { EMPTY_CARD_GRADIENT } from 'client/const'
import loadStyleStore from '../store';
import getStyles from './utils/getStyles';
import PromptItem from 'client/components/PromptItem';
import onThumbClick from './events/onThumbClick';


export default function ThumbsList() {
    const iterate = loadStyleStore(state => state.iterate);
    const selectedStyle = loadStyleStore(state => state.selectedStyle);
    const filterStyleCollection = loadStyleStore(state => state.filterStyleCollection);
    const filterStyleName = loadStyleStore(state => state.filterStyleName);

    const styles = getStyles();
    const JSXThumbnails: JSX.Element[] = [];

    for(const style of styles) {
        const {name, id, index, previewImage} = style;

        if(!name) continue;
        if(filterStyleCollection && filterStyleCollection !== id) continue;
        if(filterStyleName && !name.toLowerCase().includes(filterStyleName)) continue;

        const idKey = `${id}_${index}`;

        JSXThumbnails.push(
            <PromptItem
                key={idKey + "_" + iterate}
                id={name}
                prompt={{id: name}}
                src={previewImage ? Database.getStylePreviewURL(style) : EMPTY_CARD_GRADIENT}
                options={{
                    className: idKey === selectedStyle ? "PBE_selectedCurrentElement" : "",
                }}

                onClick={e => onThumbClick(e, idKey, name, id, index)}
            />
        );
    }

    return (
        <div
            className="PBE_dataBlock PBE_Scrollbar PBE_windowContent"
            data-iterate={iterate}
        >
            {JSXThumbnails}
        </div>
    )
}
