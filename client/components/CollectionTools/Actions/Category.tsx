import * as React from 'react';
import { JSX, useState, useEffect } from 'react';
import Database from 'client/Database';
import collectionToolsStore, { setCategory } from '../store';
import onAddCategory from '../events/onAddCategory';
import onRemoveCategory from '../events/onRemoveCategory';


export default function Category() {
    const {data} = Database;
    const categories = data.categories;
    const category = collectionToolsStore(state => state.category);

    useEffect(() => {
        const {category} = collectionToolsStore.getState();
        if(category) return;

        for(const categoryItem of categories) {
            setCategory(categoryItem);
            
            break;
        }

    }, []);

    const JSXCategories: JSX.Element[] = [];

    for(const categoryItem of categories) {
        JSXCategories.push(
            <option value={categoryItem} key={categoryItem}>{categoryItem}</option>
        );
    }

    return (
        <fieldset className="PBE_fieldset">
            <legend>Category</legend>

            <select
                className="PBE_generalInput PBE_select PBE_categoryAction"
                value={category}
                onChange={e => setCategory(e.currentTarget.value)}
            >
                {JSXCategories}
            </select>

            <button
                className="PBE_button"
                title="Add selected category to all selected prompts"
                onClick={onAddCategory}
            >
                Add
            </button>

            <button
                className="PBE_button PBE_buttonCancel"
                title="Remove selected category from all selected prompts"
                onClick={onRemoveCategory}
            >
                Remove
            </button>
        </fieldset>
    );
}
