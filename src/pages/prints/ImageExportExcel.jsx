import React, { useEffect, useState } from 'react'
import { apiCall, checkMsg, isObjectEmpty } from '../../GlobalFunctions';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import Loader from '../../components/Loader';

const ImageExportExcel = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
  const [loader, setLoader] = useState(true);
  const [msg, setMsg] = useState("");
  const [isImageWorking, setIsImageWorking] = useState(true);
  const handleImageErrors = () => {
    setIsImageWorking(false);
  };
  const loadData = (data) => {
    let imagePaths = [];
    data?.BillPrint_Json1.forEach((e, i) => {
      if (e?.DesignImage !== "") {
        imagePaths.push({src: e?.DesignImage, jobNo: e?.SrJobno});
      }
    });
    imagePaths.length > 0 ? downloadImagesZip(imagePaths) : setMsg("There is no Design Images")
  }

  const downloadImagesZip = async (imagePaths) => {
    const zip = new JSZip();

    // Fetch and add each image to the zip file
    await Promise.all(
      imagePaths.map(async (imageUrl, index) => {
        try {
          const response = await fetch(imageUrl?.src);
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${imageUrl?.src}`);
          }
          const imageBlob = await response.blob();
          zip.file(`image_${imageUrl?.jobNo}.jpg`, imageBlob);
        } catch (error) {
          console.error(error);
        }
      })
    );
    // Generate the zip file
    const content = await zip.generateAsync({ type: 'blob' });

    // Create a Blob object and trigger download
    const blob = new Blob([content]);
    saveAs(blob, 'images.zip');
  };

  useEffect(() => {
    const sendData = async () => {
      try {
        const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
        if (data?.Status === '200') {
          let isEmpty = isObjectEmpty(data?.Data);
          if (!isEmpty) {
            loadData(data?.Data);
            setLoader(false);
          } else {
            setLoader(false);
            setMsg("Data Not Found");
          }
        } else {
          setLoader(false);
          // setMsg(data?.Message);
          const err = checkMsg(data?.Message);
                    console.log(data?.Message);
                    setMsg(err);
        }
      } catch (error) {
        console.error(error);
      }
    }
    sendData();
  }, []);
  return (
    <>{loader ? <Loader /> : msg === "" ?
      "" : <p className='text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto'>{msg}</p>}</>
  )
}

export default ImageExportExcel