
export const formatDate = (inputDate) => {
    let inpDate = inputDate?.trim();
    if(inpDate === '01 Jan 1900'){
        return '';
    }else{
        let lastfourDigit = inpDate?.slice(7, 11);
        let last2Digit = lastfourDigit?.slice(2, 4);
        if(last2Digit === '00'){
            const date = new Date(inpDate);
            const day = String(date?.getDate())?.padStart(2, '0'); // Ensure two digits for the day
            const monthAbbreviation = date?.toLocaleString('default', { month: 'short' });
            const year = String(date?.getFullYear()); // Get the last two digits of the year   
            return `${day}${monthAbbreviation}${year}`;
        }else{
            const date = new Date(inpDate);
            const day = String(date?.getDate())?.padStart(2, '0'); // Ensure two digits for the day
            const monthAbbreviation = date?.toLocaleString('default', { month: 'short' });
            const year = String(date?.getFullYear())?.slice(-2); // Get the last two digits of the year   
            return `${day}${monthAbbreviation}${year}`;
        }
    }
}