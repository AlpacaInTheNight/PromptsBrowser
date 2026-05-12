import * as React from 'react'
import { JSX, useState, useEffect } from 'react'
import tagTooltipStore from './store'
import onClickHint from './events/onClickHint'


export default function AutocompliteBox() {
    const possibleTags = tagTooltipStore(state => state.possibleTags);
    const MAX_HINTS = 20;
    let currHints = 0;

    const JSXHints: JSX.Element[] = [];

    for(const tag of possibleTags) {
        if(currHints >= MAX_HINTS) break;
        const {value, wordStart, wordEnd} = tag;

        let className = "PBE_hintItem";
        if(currHints === 0) className += " PBE_hintItemSelected";

        JSXHints.push(
            <div
                key={value}
                className={className}
                data-index={currHints}
                data-start={wordStart + ""}
                data-end={wordEnd + ""}
                onClick={onClickHint}
            >
                {value}
            </div>
        );

        currHints++;
    }

    return (
        <>
            {JSXHints}
        </>
    )
}
