import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import promptToolsStore, {setShowAll, setReplaceMode, setSimByCategory, setSimByName, setSimByTags} from './store';
import ToggleButton from 'client/components/ui/ToggleButton';


export default function ConfigPanel() {
    const showAll = promptToolsStore(state => state.showAll);
    const replaceMode = promptToolsStore(state => state.replaceMode);
    const simByCategory = promptToolsStore(state => state.simByCategory);
    const simByName = promptToolsStore(state => state.simByName);
    const simByTags = promptToolsStore(state => state.simByTags);

    return (
        <div className="PBE_List PBE_toolsSetup">
            <fieldset className="PBE_fieldset">
                <legend>Setup</legend>

                <ToggleButton name="Show All" toggled={showAll} onChange={setShowAll} />
                <ToggleButton name="Replace mode" toggled={replaceMode} onChange={setReplaceMode} />
            </fieldset>

            <fieldset className="PBE_fieldset">
                <legend>Similarity by:</legend>

                <ToggleButton name="Tags" toggled={simByTags} onChange={setSimByTags} />
                <ToggleButton name="Category" toggled={simByCategory} onChange={setSimByCategory} />
                <ToggleButton name="Name" toggled={simByName} onChange={setSimByName} />
            </fieldset>
        </div>
    )
}
