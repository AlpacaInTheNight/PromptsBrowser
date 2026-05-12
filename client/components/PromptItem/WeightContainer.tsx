import * as React from 'react'


export default function WeightContainer({weight, color}: {
    color: string;
    weight: number;
}) {
    return (
        <div
            className="PBE_promptElementWeight"
            style={{color}}
        >
            {weight}
        </div>
    )
}
