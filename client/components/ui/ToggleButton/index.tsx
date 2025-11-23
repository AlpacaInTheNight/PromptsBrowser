import * as React from 'react';
import { JSX, useState, useEffect } from 'react'


export default function ToggleButton({toggled, name, title, style, onChange}: {
    toggled: boolean;
    name: string;
    title?: string;
    style?: React.CSSProperties;
    onChange: (toggled: boolean) => void;
}) {
    let className = "PBE_toggleButton";
    if(toggled) className += " PBE_toggledButton";

    return (
        <div
            title={title}
            className={className}
            onClick={() => onChange(!toggled)}
            style={style}
        >
            {name}
        </div>
    )
}
