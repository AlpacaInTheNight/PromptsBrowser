import * as React from 'react'
import { JSX, useState, useEffect } from 'react'
import Database from 'client/Database'
import appStore from 'client/store'


function onAddCategory(value: string) {
    const {editPrompt} = appStore.getState();
    if(!editPrompt) return;

    if(editPrompt.category.includes(value)) return;
    editPrompt.category.push(value);
}

function getFirstNewCategory() {
    const {data} = Database;
    const categories = data.categories;
    const {editPrompt} = appStore.getState();

    const targetCategory = categories.find(item => {
        if(!editPrompt || !editPrompt.category?.length) return true;
        if(editPrompt.category.includes(item)) return false;
        return true;
    });

    return targetCategory || "";
}

export default function CategoriesBlock() {
    const {data} = Database;
    const categories = data.categories;
    const {editPrompt} = appStore.getState();

    const [iterate, setIterate] = useState(0);
    const [addCategory, setAddCategory] = useState(getFirstNewCategory());
    
    const JSXCategories: JSX.Element[] = [];
    const JSXOptions: JSX.Element[] = [];

    if(editPrompt) {
        for(const categoryItem of editPrompt.category) {
            const categoryElement = document.createElement("div");
            categoryElement.className = "PBE_promptEditInfoItem";
            categoryElement.innerText = categoryItem;

            JSXCategories.push(
                <div
                    key={categoryItem}
                    className="PBE_promptEditInfoItem"
                    onClick={e => {
                        if(!e.metaKey && !e.ctrlKey) return;

                        const target = e.currentTarget as HTMLElement;
                        const categoryId = target.innerText;

                        editPrompt.category = editPrompt.category.filter(item => item !== categoryId);
                        setIterate(iterate + 1);
                    }}
                >
                    {categoryItem}
                </div>
            );
        }

        categories.forEach(catItem => {
            if(editPrompt.category.includes(catItem)) return;

            JSXOptions.push(
                <option key={catItem} value={catItem}>{catItem}</option>
            );
        });
    }

    return (
        <>
            <div className="PBE_rowBlock" style={{marginBottom: "0"}}>
                <div>
                    Categories:
                </div>

                <div className="PBE_List PBE_Scrollbar PBE_tagsList">
                    {JSXCategories}
                </div>
            </div>

            <div className="PBE_rowBlock">
                <select
                    value={addCategory}
                    className="PBE_generalInput"
                    onChange={e => setAddCategory(e.currentTarget.value)}
                >
                    {JSXOptions}
                </select>

                <button
                    className="PBE_button"
                    onClick={() => {
                        onAddCategory(addCategory);
                        setAddCategory(getFirstNewCategory());
                        setIterate(iterate + 1);
                    }}
                >
                    Add category
                </button>
            </div>
        </>
    )
}
