import React from 'react'
import { useState } from 'react';
// import QRCode from 'qrcode.react';
import QRCode from "react-qr-code";
// import style from  "../assets/css/qrcodeforprint/qrcode.module.css";

const QrCodeForPrint = ({text}) => {
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
                     
                    <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={text}
                    viewBox={`0 0 256 256`}
                    />
                    :
                    <p>No QR code preview</p>
            }
        </>
    );


}

export default QrCodeForPrint;

{/* <QRCode 
                        id="myqr"
                        value={text} 
                        includeMargin={true}
                        // className="qrcodegenh3"
                        // style={{ height: "85px", width: "105px" }}
                    /> */}