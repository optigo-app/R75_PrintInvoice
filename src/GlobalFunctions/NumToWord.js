import { ToWords } from "to-words";

export const NumToWord = (TotalAmount) => {
    const toWords = new ToWords();
    const totalAmount = parseFloat(TotalAmount)?.toFixed(2);
    const amountStr = totalAmount?.toString();
    const decimalPart = amountStr?.split('.')[1];
    const paddedDecimalPart = decimalPart?.padEnd(2, '0'); // Pad the decimal part with zeros if necessary

    // Define an object to map numbers to words for the decimal part
    const decimalWordsMap = {
        '00': 'Zero',
        '01': 'One',
        '02': 'Two',
        '03': 'Three',
        '04': 'Four',
        '05': 'Five',
        '06': 'Six',
        '07': 'Seven',
        '08': 'Eight',
        '09': 'Nine',
        '10': 'Ten',
        '11': 'Eleven',
        '12': 'Twelve',
        '13': 'Thirteen',
        '14': 'Fourteen',
        '15': 'Fifteen',
        '16': 'Sixteen',
        '17': 'Seventeen',
        '18': 'Eighteen',
        '19': 'Nineteen',
        '20': 'Twenty',
        '30': 'Thirty',
        '40': 'Forty',
        '50': 'Fifty',
        '60': 'Sixty',
        '70': 'Seventy',
        '80': 'Eighty',
        '90': 'Ninety',
    };

    // Convert the decimal part to words using the decimalWordsMap
    const decimalWords = (decimalWordsMap[paddedDecimalPart] === undefined ? toWords?.convert(paddedDecimalPart) : decimalWordsMap[paddedDecimalPart]) ;
    
    // Construct the complete amount string with the converted decimal part
    const amountInWords = `${toWords?.convert(Math?.floor(totalAmount))} Point ${decimalWords}  `;
    // Render the amount in words
    return amountInWords;
}

export default NumToWord;

export function convertToUppercase(sentence) {
    return sentence?.toString()?.toUpperCase();
}



