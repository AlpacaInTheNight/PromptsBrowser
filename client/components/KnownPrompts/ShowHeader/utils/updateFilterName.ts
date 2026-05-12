import * as React from 'react'
import {setFilterName} from 'client/store'
import StaticStore from './staticStore';


export default function updateFilterName(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.currentTarget.value || "";

    clearTimeout(StaticStore.updateTimeout);

    StaticStore.updateTimeout = setTimeout(() => {
        if(value) setFilterName(value.toLowerCase());
        else setFilterName(undefined);
    }, 500);
}
