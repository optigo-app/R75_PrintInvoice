export const GetSeparateData = (data) => {
    let diamondArr = [];
    let colorStoneArr = [];
    let findingArr = [];
    let miscArr = [];
    let EmptyArr = [];
    let obj = {};
    let length = 0;
    let clr = {
        Shapename: "TOTAL",
        Sizename: "",
        ActualPcs: 0,
        ActualWeight: 0,
        MasterManagement_DiamondStoneTypeid: 4
        // heading: "COLOR STONE DETAIL"
    };
    let dia = {
        Shapename: "TOTAL",
        Sizename: "",
        ActualPcs: 0,
        ActualWeight: 0,
        MasterManagement_DiamondStoneTypeid: 3
        // heading: "DIAMOND DETAIL"
    };
    let misc = {
        Shapename: "TOTAL",
        Sizename: "",
        ActualPcs: 0,
        ActualWeight: 0,
        MasterManagement_DiamondStoneTypeid: 7
        // heading: "MISC DETAIL"
    };
    let f = {
        Shapename: "TOTAL",
        Sizename: "",
        ActualPcs: 0,
        ActualWeight: 0,
        MasterManagement_DiamondStoneTypeid: 5
        // heading: "FINDING DETAIL"
    };
    // eslint-disable-next-line array-callback-return
    data?.map((e) => {
        if (e?.MasterManagement_DiamondStoneTypeid === 0) {
            length++;
            EmptyArr.push(e);
        }
        if (e?.MasterManagement_DiamondStoneTypeid === 3) {
            dia.ActualPcs = dia.ActualPcs + e?.ActualPcs;
            dia.ActualWeight = dia.ActualWeight + e?.ActualWeight;
            diamondArr.push(e);
        }
        if (e?.MasterManagement_DiamondStoneTypeid === 4) {
            clr.ActualPcs = clr.ActualPcs + e?.ActualPcs;
            clr.ActualWeight = clr.ActualWeight + e?.ActualWeight;
            colorStoneArr.push(e);
        }
        if (e?.MasterManagement_DiamondStoneTypeid === 5) {
            f.ActualPcs = f.ActualPcs + e?.ActualPcs;
            f.ActualWeight = f.ActualWeight + e?.ActualWeight;
            findingArr.push(e);
        }
        if (e?.MasterManagement_DiamondStoneTypeid === 7) {
            misc.ActualPcs = misc.ActualPcs + e?.ActualPcs;
            misc.ActualWeight = misc.ActualWeight + e?.ActualWeight;
            miscArr.push(e);
        }
    });
    dia.ActualPcs = +(dia.ActualPcs?.toFixed(3));
    dia.ActualWeight = +(dia.ActualWeight?.toFixed(3));
    clr.ActualPcs = +(clr.ActualPcs?.toFixed(3));
    clr.ActualWeight = +(clr.ActualWeight?.toFixed(3));
    misc.ActualPcs = +(misc.ActualPcs?.toFixed(3));
    misc.ActualWeight = +(misc.ActualWeight?.toFixed(3));
    f.ActualPcs = +(f.ActualPcs?.toFixed(3));
    f.ActualWeight = +(f.ActualWeight?.toFixed(3));

    diamondArr.push(dia);
    colorStoneArr.push(clr);
    findingArr.push(f);
    miscArr.push(misc);

    obj = {
        diamondArr,
        colorStoneArr,
        findingArr,
        miscArr,
        EmptyArr,
        dia, clr, f, misc, length
    };
    return obj;
};