import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import '../App.css';

export function LoadingScreen() {
    return (
        <div className='centerItem'>
            <h1>
                <LoadingOutlined spin={true}/>
                Loading...
            </h1>
        </div>
    );
}