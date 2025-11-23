import * as React from 'react';
import { JSX, useState, useEffect } from 'react';
import Database from 'client/Database';
import Operations from './Operations';
import Copy from './Copy';
import Category from './Category';
import Tags from './Tags';
import Autogen from './Autogen';
import Generate from './Generate';


export default function Actions() {
    const {data} = Database;

    const showCopy = Object.keys(data.original).length > 1;

    return (
        <div className="PBE_collectionToolsActions PBE_row">

            <Operations />

            {(showCopy) && <Copy />}

            <Category />

            <Tags />

            <Autogen />

            <Generate />

        </div>
    );
}
