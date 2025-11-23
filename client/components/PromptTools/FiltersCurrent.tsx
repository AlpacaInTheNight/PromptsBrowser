import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import PromptsSimpleFilter from '../ui/PromptsSimpleFilter';
import promptToolsStore, {iterateStore} from './store';


export default function FiltersCurrent() {
    const filtersCurrent = promptToolsStore(state => state.filtersCurrent);

    return (
        <div className="PBE_dataBlock PBE_toolsFilter">
            <PromptsSimpleFilter
                filters={filtersCurrent}
                onUpdate={iterateStore}
            />
        </div>
    )
}
