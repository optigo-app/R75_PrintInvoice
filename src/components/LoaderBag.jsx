import React from 'react'
import { css } from '@emotion/react';
import { BounceLoader, CircleLoader, ClipLoader, PropagateLoader, RingLoader } from 'react-spinners';

const Loader = () => {
    const override = css`
  display: block;
  margin: 0 auto;
  border-color: #36d7b7; // Customize the color as per your needs
`;
    return (
        <div style={{    position: "absolute", width: "100%", height: "100%", top: "50%", left: "50%"}}>
            <ClipLoader css={override} size={50} color={'#36d7b7'} loading={true} />
        </div>
    )
}


export default Loader