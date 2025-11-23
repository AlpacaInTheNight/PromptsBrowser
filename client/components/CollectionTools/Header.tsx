import * as React from 'react';
import { JSX, useState, useEffect } from 'react';
import PromptsFilter from '../ui/PromptsFilter';
import CollectionToolsStore, {setPromptsFilter} from './store';


export default function Header() {

    return (
        <div className="PBE_collectionToolsHeader">
            <PromptsFilter onChange={setPromptsFilter} />
        </div>
    );
}
