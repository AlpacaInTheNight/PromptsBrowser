import * as React from 'react';
import { JSX, useState, useEffect } from 'react';
import Database from 'client/Database';
import { setFilterCategory } from 'client/store';


export default function ShowCategories({value = ""}: {
    value?: string;
}) {
    const JSXOptions: React.JSX.Element[] = [];

    for(const categoryItem of Database.data.categories) {
        JSXOptions.push(
            <option value={categoryItem} key={categoryItem}>{categoryItem}</option>
        )
    }

    return (
        <select className="PBE_generalInput" value={value} onChange={e => setFilterCategory(e.currentTarget.value)}>
            <option value="">All categories</option>
            <option value="__none">Uncategorised</option>
            {JSXOptions}
        </select>
    )
}
