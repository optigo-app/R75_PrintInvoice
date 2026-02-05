import React from 'react';
import { MagnifyingGlass } from 'react-loader-spinner';
const Loader2 = () => {
    return (
        <div className='loader_2 d-flex align-items-center justify-content-center'>
            <MagnifyingGlass
                visible={true}
                height="40"
                width="40"
                ariaLabel="MagnifyingGlass-loading"
                wrapperStyle={{}}
                wrapperClass="MagnifyingGlass-wrapper"
                glassColor='#c0efff'
                color='#e15b64'
            />
        </div>
    )
}

export default Loader2