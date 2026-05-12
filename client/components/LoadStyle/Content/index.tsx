import * as React from 'react';
import { JSX, useState, useEffect } from 'react'
import loadStyleStore from '../store';
import ThumbsList from './ThumbsList';
import DetailedList from './DetailedList';


export default function LoadStyleContent() {
    const isSimpleView = loadStyleStore(state => state.isSimpleView);

    if(isSimpleView) return <ThumbsList />;

    return <DetailedList />
}
