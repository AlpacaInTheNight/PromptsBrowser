import * as React from 'react';
import { JSX, useState, useEffect } from 'react';
import Database from 'client/Database';
import TagTooltip from 'client/components/ui/TagTooltip';
import { FilterMeta } from './type';
import promptsFilterStore, {setMeta, setCategory, setName, setTag} from './store';


export default function AdditionalSetup({type, onSubmit}: {
    type: string;
    onSubmit?: () => void;
}) {
    const iterate = promptsFilterStore(state => state.iterate);
    const filterMeta = promptsFilterStore(state => state.meta);
    const filterCategory = promptsFilterStore(state => state.category);
    const filterName = promptsFilterStore(state => state.name);
    const filterTag = promptsFilterStore(state => state.tag);

    if(type === "meta") {
        return (
            <select
                className="PBE_generalInput PBE_select PBE_filterMeta"
                value={filterMeta}
                onChange={e => setMeta(e.currentTarget.value as FilterMeta)}
            >
                <option value={FilterMeta.PREVIEW}>Have preview image</option>
                <option value={FilterMeta.PREVIEW_MODEL}>Have preview for the model</option>
                <option value={FilterMeta.CATEGORIES}>Have categories</option>
                <option value={FilterMeta.CATEGORIES3}>Have at least 3 categories</option>
                <option value={FilterMeta.TAGS}>Have tags</option>
                <option value={FilterMeta.TAGS3}>Have at least 3 tags</option>
                <option value={FilterMeta.COMMENT}>Have comment</option>
                <option value={FilterMeta.AUTOGEN}>Have autogen style</option>
                <option value={FilterMeta.PNG}>Is PNG</option>
                <option value={FilterMeta.JPG}>Is JPG</option>
            </select>
        )
    }

    if(type === "category") {
        const {data} = Database;
        const categories = data.categories;
        const JSXOptions: React.JSX.Element[] = [];

        for(const categoryItem of categories) {
            JSXOptions.push(
                <option value={categoryItem} key={categoryItem}>{categoryItem}</option>
            )
        }

        return (
            <select
                className="PBE_generalInput PBE_select PBE_filterCategory"
                value={filterCategory}
                onChange={e => setCategory(e.currentTarget.value)}
            >
                <option value="">All</option>
                <option value="__none">Uncategorised</option>
                {JSXOptions}
            </select>
        )
    }

    if(type === "name") {
        return (
            <input
                className="PBE_generalInput PBE_input PBE_filterName"
                value={filterName}
                onChange={e => setName(e.currentTarget.value)}
                onKeyDown={e => {
                    if(onSubmit && e.key === 'Enter') onSubmit();
                }}
            />
        )
    }

    if(type === "tag") {
        return (
            <TagTooltip
                iteration={iterate}
                tags={filterTag.split(",")}
                onUpdate={(tags) => {
                    setTag(tags.join(", "));
                }}
                onSubmit={onSubmit}
            />
        )
    }

    return (
        <div />
    );
}
