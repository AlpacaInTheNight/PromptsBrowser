import * as React from 'react';
import { JSX, useState, useEffect } from 'react';
import Database from 'client/Database';
import TagTooltip from 'client/components/ui/TagTooltip';
import collectionToolsStore, {setTags} from '../store';
import onAddTags from '../events/onAddTags';
import onRemoveTags from '../events/onRemoveTags';


export default function Tags() {
    const {data} = Database;
    const [iterate, setIterate] = useState(0);
    const tags = collectionToolsStore(state => state.tags);

    const JSXStyleCollections: JSX.Element[] = [];

    for(const colId in data.styles) JSXStyleCollections.push(<option value={colId} key={colId}>{colId}</option>);

    return (
        <fieldset className="PBE_fieldset">
            <legend>Tags</legend>

            <TagTooltip
                iteration={iterate}
                tags={tags.split(",")}
                onUpdate={(tags) => {
                    setTags(tags.join(", "));
                }}
            />

            <button
                className="PBE_button"
                title="Add target tags to all selected prompts"
                onClick={e => {
                    onAddTags();
                    setTags("");
                    setIterate(iterate + 1);
                }}
            >
                Add
            </button>

            <button
                className="PBE_button PBE_buttonCancel"
                title="Remove target tags from all selected prompts"
                onClick={e => {
                    onRemoveTags();
                    setTags("");
                    setIterate(iterate + 1);
                }}
            >
                Remove
            </button>
        </fieldset>
    );
}
