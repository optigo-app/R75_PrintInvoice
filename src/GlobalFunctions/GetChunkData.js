export const GetChunkData = (chunkSize, arr) => {
    let chunkData = [];
    for (let i = 0; i < arr?.length; i += chunkSize) {
        const chunks = arr?.slice(i, i + chunkSize);
        let len = chunkSize - (arr?.slice(i, i + chunkSize))?.length;
        chunkData?.push({ data: chunks, length: len });
    }
    return chunkData;
}

// export const extractWords = (str) => {
//     console.log(str);
//     const regex = /Customer INS :\s*(\S+).*?Wax\. INS :\s*(\S+).*?Finding INS :\s*(\S+)/;
//     const matches = str.match(regex);

//     if (matches) {
//         return {
//         customer: matches[1],
//         wax: matches[2],
//         finding: matches[3],
//         };
//     }

//     return null;
// };
export const extractWords = (str) => {
    
    let arr = str?.split("#");
    let obj = {
        customer: arr[0]?.split(":")[1],
        wax:arr[1]?.split(":")[1],
        finding:arr[2]?.split(":")[1]
    }


    return obj;



    // console.log(str);
    // // Updated regex
    // const regex = /Customer INS :\s*([\w\s]+?)Wax\. INS :\s*([\w\s]+?)Finding INS :\s*([\w\s]+)/;
    // const matches = str?.match(regex);
    // console.log(matches);
    // if (matches) {
    //     return {
    //         customer: matches[1].trim(),
    //         wax: matches[2].trim(),
    //         finding: matches[3].trim(),
    //     };
    // }

    // return null;
};
