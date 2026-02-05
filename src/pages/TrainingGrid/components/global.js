export const checkWord = (word) => {
    if(word === undefined || word === null || word === "undefined" || word === "null"){
        return ''
    }else{
        return word;
    }
}