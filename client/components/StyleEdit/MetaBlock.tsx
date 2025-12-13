import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import appStore from 'client/store'
import InputRow from 'client/components/ui/InputRow'


export default function MetaBlock() {
    const [iterate, setIterate] = useState(0);
    const {editStyle} = appStore.getState();

    return (
        <>
            <InputRow
                type="number"
                label="Width"
                iterate={iterate}
                value={editStyle.width || 0}
                nonSpecified={editStyle.width === undefined}
                onUpdate={value => {
                    editStyle.width = Number(value);
                    setIterate(iterate + 1);
                }}
            />

            <InputRow
                type="number"
                label="Height"
                iterate={iterate}
                value={editStyle.height || 0}
                nonSpecified={editStyle.height === undefined}
                onUpdate={value => {
                    editStyle.height = Number(value);
                    setIterate(iterate + 1);
                }}
            />

            <InputRow
                type="number"
                label="CFG"
                iterate={iterate}
                value={editStyle.cfg || 0}
                nonSpecified={editStyle.cfg === undefined}
                onUpdate={value => {
                    let cfg = Number(value);
                    if(cfg <= 0) cfg = 1;
                    if(cfg > 30) cfg = 30;

                    editStyle.cfg = cfg;
                    setIterate(iterate + 1);
                }}
            />

            <InputRow
                type="number"
                label="Steps"
                iterate={iterate}
                value={editStyle.steps || 0}
                nonSpecified={editStyle.steps === undefined}
                onUpdate={value => {
                    let steps = Number(value);
                    if(steps <= 0) steps = 1;
                    if(steps > 150) steps = 150;

                    editStyle.steps = steps;
                    setIterate(iterate + 1);
                }}
            />

            <InputRow
                type="number"
                label="Seed"
                iterate={iterate}
                value={editStyle.seed || 0}
                nonSpecified={editStyle.seed === undefined}
                onUpdate={seed => {
                    editStyle.seed = Number(seed);
                    setIterate(iterate + 1);
                }}
            />

        </>
    );
}
