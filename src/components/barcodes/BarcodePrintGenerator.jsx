import React, { useRef, useEffect, useState } from 'react';
import JsBarcode from 'jsbarcode';
import style from "../../assets/css/barcodes/barcodePrint.module.css";

const BarcodePrintGenerator = ({ data }) => {
  const barcodeRef = useRef(null);
  const [imageSrc, setImageSrc] = useState('');
  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, data);
    }
  }, [data]);

  const canvasRef = useRef(null);
  useEffect(() => {
    const generateBarcode = () => {
      const canvas = canvasRef.current;

      if (canvas) {
        const ctx = canvas.getContext('2d');

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Generate barcode
        JsBarcode(canvas, data, {
          format: 'CODE128',
          displayValue: true,
          fontSize: 40,
        });

        // Get the data URL of the canvas
        const dataUrl = canvas.toDataURL('image/png');

        // Set the image source state
        setImageSrc(dataUrl);
      }
    };

    generateBarcode();
  }, []);

  return <>
   <canvas ref={canvasRef} className='d_none'></canvas>
  {imageSrc && <img src={imageSrc} alt="Barcode" className={`${style?.barcodeSticker} barcodeSticker`} loading="eager"  />}
  </>;
};

export default BarcodePrintGenerator;