import * as React from 'react';
import { JSX, useState, useEffect } from 'react'


export default function CheckBox({checked, name, title, reverse = false, onChange}: {
    name: string;
    title?: string;
    checked: boolean;

    reverse?: boolean;
    onChange: (checked: boolean) => void;
}) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
        <div>
            <input
                ref={inputRef}
                type="checkbox"
                checked={checked}
                onChange={e => {
                    if(inputRef.current) onChange(inputRef.current.checked);
                }}
            />

            <label
                title={title}
                onClick={e => {
                    if(inputRef.current) onChange(!inputRef.current.checked);
                }}
            >
                {name}
            </label>
        </div>
    )
}
