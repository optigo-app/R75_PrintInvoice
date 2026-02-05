import { formatDate } from "./DateFormat";
import { extractWords } from "./GetChunkData";

export const organizeData = (rd, rd1) => {
    let newArr = [];

    rd?.forEach((e, i) => {
      let obj = {};
      obj.rd = { ...e };
      obj.rd.orderDatef = formatDate(obj?.rd?.OrderDate);
      obj.rd.promiseDatef = formatDate(obj?.rd?.promisedate);
      obj.rd.productInfoSeparate = extractWords(obj?.rd?.productinfo)
      let arrs = rd1?.filter((ele) => ele?.SerialJobno === e?.serialjobno);
      obj.rd1 = arrs;
      newArr?.push(obj);
    });
    return newArr;
  };


