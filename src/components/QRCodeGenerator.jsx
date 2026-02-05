import React, { useState } from 'react';
// import { Fab, TextareaAutosize, Grid } from '@material-ui/core';
// import {  GetApp } from '@material-ui/icons';
import QRcode from 'qrcode.react';

function QRCodeGenerator({ text }) {
    const [qr, setQr] = useState('lintangwisesa');
    const handleChange = (event) => {
        setQr(event.target.value);
    };
    const downloadQR = () => {
        const canvas = document.getElementById("myqr");
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "myqr.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };


    return (
        <>
            {

                    qr ?
                    <QRcode 
                        id="myqr"
                        value={text} 
                        // size={90}
                        includeMargin={true}
                        className='qrcodegen'
                        // style={{ height: "85px", width: "105px" }}
                    /> :
                    <p>No QR code preview</p>
            }
        </>
    );
}

export default QRCodeGenerator;
