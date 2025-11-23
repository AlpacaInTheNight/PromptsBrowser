import * as React from 'react'
import {PromptHintItem} from './types'
import onClickHint from './events/onClickHint';


export default function ShowHints({hints = [], selected}: {
    hints: PromptHintItem[];
    selected?: number;
}) {
    const JSXHints: React.JSX.Element[] = [];

    for(let hintItem of hints) {
        const {name, index = 0, isStyle, collection} = hintItem;
        let className = "PBE_hintItem";
        if(index === selected) className += " PBE_hintItemSelected";

        JSXHints.push(
            <div
                className={className}
                key={isStyle ? "__style_" + name : name}
                onClick={onClickHint}
                data-id={name}
                data-collection={collection}
                data-isstyle={isStyle ? "true" : ""}
            >
                {isStyle ? "Style: " + name : name}
            </div>
        );
    }

    return JSXHints;
}
