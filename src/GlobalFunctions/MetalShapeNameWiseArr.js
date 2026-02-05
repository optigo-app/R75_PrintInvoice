import { cloneDeep } from "lodash";

export const MetalShapeNameWiseArr = (json2) => {
  const j2 = cloneDeep(json2);
  const arr = [];

  j2?.forEach((e) => {
    if ( e?.MasterManagement_DiamondStoneTypeid === 4 && e?.IsPrimaryMetal === 1 && e?.ShapeName?.toLowerCase() !== "gold" ) {
      arr.push(e);
    }
  });

  const arr2 = arr.map((e) => {
    const el = cloneDeep(e);
    el.metalfinewt = (Number(el?.SizeName) * el?.Wt) / 100;
    return el;
  });

  const arr1 = [];

  arr2?.forEach((a) => {
    let obj = cloneDeep(a);
    let findrec = arr1.findIndex((al) => al?.ShapeName === obj?.ShapeName);
    if (findrec === -1) {
      arr1.push(obj);
    } else {
      arr1[findrec].Wt += obj?.Wt;
      arr1[findrec].metalfinewt += obj?.metalfinewt;
      arr1[findrec].Amount += obj?.Amount;
      arr1[findrec].FineWt += obj?.FineWt;
    }
  });

  return arr1;
};
