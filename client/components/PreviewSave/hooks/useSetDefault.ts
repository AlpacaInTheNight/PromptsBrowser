import { JSX, useState, useEffect } from 'react'
import Database from 'client/Database';
import {setPreviewCollection} from '../store';


export default function useSetDefault(previewCollection: string, tabName: string) {

    useEffect(() => {
        const {data} = Database;

        if(previewCollection && data.original[previewCollection]) return;

        for(const collectionId in data.original) {
            setPreviewCollection(collectionId);
            break;
        }

    }, [previewCollection, tabName]);

}
