import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import { FilterSimple } from "client/types/filter"
import Database from "client/Database/index"
import checkFilter from './checkFilter'
import TagTooltip from 'client/components/ui/TagTooltip';

export {checkFilter}


export default function PromptsSimpleFilter({filters = {}, onUpdate}: {
    filters: FilterSimple;
    onUpdate: () => void;
}) {
    const [iterate, setIterate] = useState(0);
    const {data} = Database;
    const {categories, original} = data;
    const {collection = "", category = "", tags = [], name = "", sorting = "", sortingOptions} = filters;

    const JSXCollectionOptions: JSX.Element[] = [];
    for(const collectionId in original) {
        JSXCollectionOptions.push(
            <option value={collectionId} key={collectionId}>{collectionId}</option>
        );
    }

    const JSXCategoriesOptions: JSX.Element[] = [];
    for(const categoryId of categories) {
        JSXCategoriesOptions.push(
            <option value={categoryId} key={categoryId}>{categoryId}</option>
        );
    }

    const JSXSortingOptions: JSX.Element[] = [];
    if(sortingOptions) {
        for(const sortOption of sortingOptions) {
            const {id, name} = sortOption;
            JSXCollectionOptions.push(
                <option value={id} key={id}>{name}</option>
            );
        }
    }

    return (
        <div className="PBE_filtersContainer">

            <select
                className="PBE_generalInput PBE_select"
                value={collection}
                onChange={e => {
                    filters.collection = e.currentTarget.value;
                    setIterate(iterate + 1);
                    onUpdate();
                }}
            >
                <option value="">All collections</option>
                {JSXCollectionOptions}
            </select>

            <select
                className="PBE_generalInput PBE_select"
                value={category}
                onChange={e => {
                    filters.category = e.currentTarget.value;
                    setIterate(iterate + 1);
                    onUpdate();
                }}
            >
                <option value="">All categories</option>
                <option value="__none">Uncategorised</option>
                {JSXCategoriesOptions}
            </select>

            <TagTooltip
                tags={tags}
                onUpdate={newTags => {
                    filters.tags = newTags || [];
                    setIterate(iterate + 1);
                    onUpdate();
                }}
            />

            <input
                className="PBE_generalInput PBE_input"
                value={name}
                type="text"
                placeholder='by name'
                onChange={e => {
                    filters.name = e.currentTarget.value.toLowerCase();
                    setIterate(iterate + 1);
                    onUpdate();
                }}
            />

            {sortingOptions &&
                <select
                    className="PBE_generalInput PBE_select"
                    value={sorting}
                    onChange={e => {
                        filters.sorting = e.currentTarget.value;
                        setIterate(iterate + 1);
                        onUpdate();
                    }}
                >
                    {JSXSortingOptions}
                </select>
            }

        </div>
    )
}