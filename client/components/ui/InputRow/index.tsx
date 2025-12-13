import * as React from 'react';
import { JSX, useState, useEffect } from 'react';


export default function InputRow({type, label, value, iterate, nonSpecified = false, onUpdate}: {
    iterate?: number;
    label: string;
    value: number | string;
    type: React.HTMLInputTypeAttribute;
    nonSpecified?: boolean;

    onUpdate: (value: string) => void;
}) {

    const style: React.CSSProperties = {
        height: "40px",
    }

    if(nonSpecified) {
        style.opacity = "0.5";
    }

    return (
        <div
            data-iterate={iterate}
            className="PBE_rowBlock"
            style={style}
        >
            <label>
                {label}:
            </label>

            <input
                className="PBE_generalInput"
                type={type}
                value={value}
                onChange={e => onUpdate(e.currentTarget.value)}
            />
        </div>
    );
}
