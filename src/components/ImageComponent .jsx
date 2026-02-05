import React, { useState } from 'react';
import style from "../assets/css/headers/header1.module.css";

const useImageExists = (imageUrl) => {
    const [imageExists, setImageExists] = useState(true);

    const checkImageExists = (url) => {
        const img = new Image();
        img.src = url;
        img.onload = () => setImageExists(true);
        img.onerror = () => setImageExists(false);
    };

    checkImageExists(imageUrl);

    return imageExists;
};

const ImageComponent = ({ imageUrl, styles }) => {
    const imageExists = useImageExists(imageUrl);
    return (
        <div>
            {imageExists ? (
                <img src={imageUrl} alt="" className={`w-100 object-fit-contain`} style={styles} />
            ) : (
                <></>
            )}
        </div>
    );
};

export default ImageComponent;