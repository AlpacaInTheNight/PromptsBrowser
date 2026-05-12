import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import PromptsSimpleFilter from '../ui/PromptsSimpleFilter';
import promptToolsStore, {iterateStore} from './store';


export default function FiltersPossible() {
    const filtersPossible = promptToolsStore(state => state.filtersPossible);

    return (
        <div className="PBE_dataBlock PBE_toolsFilter">
            <PromptsSimpleFilter
                filters={filtersPossible}
                onUpdate={iterateStore}
            />
        </div>
    )
}
