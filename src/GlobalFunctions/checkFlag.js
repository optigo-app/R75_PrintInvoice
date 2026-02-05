import { cloneDeep } from "lodash";

export const checkFlag = (invoiceNo, printName, eventName) => {

    console.log(invoiceNo, printName, eventName);

        const globalFlagObject = {
            
            shortHeader:false,
            shipAddress:false,
            gold24KRate:false,
            categoryCount:false,
            declaration:false,
            groupJobs:false,
            diamondQuality:false,
            diamondColor:false,
            fineWt:false,
            Tunch:false,
            otherChargesBifurcation:false,
            bankDetails:false,
            signBlock:false,
            diamondSummary:false,
            makingRate:false,
            makingAmount:false,
            wastage:false,
            metalTypeWiseMerge:false,
            grossWt:false,
            netWt:false,
            discount:false,
            twoDecimalWt:false,
            jobWiseTotal:false,

        }

        console.log(printName);
        const obj = cloneDeep(globalFlagObject);
        switch(printName) {
            case 'detail print 10' : 
            return {...obj, Tunch:true, jobWiseTotal:true}
            case 'detail print 11' : 
            return {...obj,jobWiseTotal:true}
            case 'tax invoice' : 
            return {...obj, wastage:true}
            default : 
            console.log('hello');
            break;
        }
}