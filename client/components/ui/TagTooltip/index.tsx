import * as React from 'react';
import { JSX, useState, useEffect, useRef } from 'react'
import setBoxPosition from './utils/setBoxPosition';
import tagTooltipStore, {setInputElement, TagTooltipStaticStore} from './store';
import processCarretPosition from './events/processCarretPosition';
import updateTagsList from './utils/updateTagsList';
import onChange from './events/onChange';
import onBlur from './events/onBlur';
import onHintWindowKey from './events/onHintWindowKey';


export default function TagTooltip({tags, iteration = 0, onUpdate, onSubmit}: {
    iteration?: number;
    tags: string[];

    onUpdate: (tags: string[]) => void;
    onSubmit?: () => void;
}) {
    const boxContainer = tagTooltipStore.getState().autocompliteBox;
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        updateTagsList();

        boxContainer.style.display = "none";
        return () => {boxContainer.style.display = "none"}
    }, []);

    useEffect(() => {
        inputRef.current.value = tags.join(", ");

    }, [iteration, inputRef]);

    return (
        <input
            ref={inputRef}
            className="PBE_generalInput PBE_input"
            type="text"
            defaultValue={tags.join(", ")}
            placeholder="tag1, tag2, tag3"
            onChange={e => {
                boxContainer.style.display = "flex";
                TagTooltipStaticStore.onUpdate = onUpdate;
                const value = (e.currentTarget as HTMLInputElement).value;

                onChange(value);
            }}
            onKeyDown={e => {
                if(e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 13) {
                    const block = onHintWindowKey(e);
            
                    if(block) {
                        e.stopPropagation();
                        e.preventDefault();
            
                        return false;
                    }
                }

                if(!onSubmit) return;

                const {autocompliteBox, possibleTags} = tagTooltipStore.getState();
                if(possibleTags.length && autocompliteBox.style.display !== "none") return;

                if(e.key === 'Enter') onSubmit();
            }}
            onKeyUp={processCarretPosition}
            onFocus={e => {
                TagTooltipStaticStore.onUpdate = onUpdate;
                setInputElement(e.currentTarget);
                processCarretPosition(e);
                boxContainer.style.display = "flex";
                setBoxPosition(inputRef.current);
            }}
            onBlur={onBlur}
        />
    )
}
