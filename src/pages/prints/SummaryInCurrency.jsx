import React, { useEffect, useState } from 'react';
import {
    HeaderComponent,
    apiCall,
    handleImageError,
    isObjectEmpty,
    NumberWithCommas,
    handlePrint,
    checkMsg
} from "../../GlobalFunctions";
import style from '../../assets/css/prints/SummaryInCurrency.module.css';
import Loader from "../../components/Loader";
import { OrganizeDataPrint } from '../../GlobalFunctions/OrganizeDataPrint';
import lodash, { cloneDeep } from 'lodash';

const SummaryInCurrency = ({ urls, token, invoiceNo, printName, evn, ApiVer }) => {
    const [loader, setLoader] = useState(true);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({});
    const [headerData, setHeaderData] = useState({});
    const [checkBox, setCheckbox] = useState({
        image: true,
    });

    const loadData = (data) => {
        setHeaderData(data?.BillPrint_Json[0]);
        let datas = OrganizeDataPrint(
            data?.BillPrint_Json[0],
            data?.BillPrint_Json1,
            data?.BillPrint_Json2
        );
        let resultArr = [];
        datas?.resultArray?.forEach((e, i) => {
            let obj = cloneDeep(e);
            let diamonds = [];
            e?.diamonds?.forEach((ele, ind) => {
                let findDiamond = diamonds?.findIndex(elem => elem?.ShapeName === ele?.ShapeName && elem?.Colorname === ele?.Colorname && elem?.QualityName === ele?.QualityName && elem?.Rate === ele?.Rate);
                if (findDiamond === -1) {
                    diamonds?.push(ele);
                } else {
                    diamonds[findDiamond].Amount += ele?.Amount;
                    diamonds[findDiamond].Wt += ele?.Wt;
                    diamonds[findDiamond].Pcs += ele?.Pcs;
                }
            });
            obj.diamonds = diamonds;
            obj.metalAmounts = e?.metal?.reduce((acc, cObj) => cObj?.IsPrimaryMetal === 1 ? acc + cObj?.Amount : acc, 0);
            resultArr?.push(obj);
        });
        datas.resultArray = resultArr;
        setData(datas);

    };

    const handleChange = (e) => {
        const { name, checked } = e?.target;
        setCheckbox({ ...checkBox, [name]: checked });
    }
    const [isImageWorking, setIsImageWorking] = useState(true);
    const handleImageErrors = () => {
        setIsImageWorking(false);
    };
    useEffect(() => {
        const sendData = async () => {
            try {
                const data = await apiCall(token, invoiceNo, printName, urls, evn, ApiVer);
                if (data?.Status === "200") {
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
        };
        sendData();
    }, []);

    return loader ? (
        <Loader />
    ) : msg === "" ? (
        <div className={`container container-fluid max_width_container mt-1 ${style?.summaryInCurrency} pad_60_allPrint px-1`}>
            {/* buttons */}
            <div className={`d-flex justify-content-end align-items-center ${style?.print_sec_sum4} mb-4 ${style?.font_16}`} >
                <div className="form-check d-flex align-items-center pt-1">
                    <input className="border-dark me-2" type="checkbox" checked={checkBox?.image} onChange={e => handleChange(e)} name='image' />
                    <label className="">
                        With Image
                    </label>
                </div>
                <div className={`form-check ps-3 ${style?.printBtn}`}>
                    <input
                        type="button"
                        className="btn_white blue py-2 mt-2"
                        value="Print"
                        onClick={(e) => handlePrint(e)}
                    />
                </div>
            </div>
            {/* header */}
            <div className={`border d-flex justify-content-between p-2 ${style?.font_18}`}>
                <p>ESTIMATE# : <span className="fw-bold">{headerData?.InvoiceNo}</span></p>
                <div>
                    <p className='text-end pb-1'>DATE : <span className="fw-bold">{headerData?.EntryDate}</span></p>
                    {headerData?.HSN_No_Label !== "" && <p className='text-end pt-1'>{headerData?.HSN_No_Label} : <span className="fw-bold">{headerData?.HSN_No}</span></p>}
                </div>
            </div>
            <div className={`border-start border-end border-bottom d-flex justify-content-between p-2 ${style?.font_15}`}>
                <div className='d-flex'>
                    <div className='pe-2'>
                        <p className='fw-bold'>TO, </p>
                    </div>
                    <div>
                        <p className='fw-bold'>{headerData?.CustName}</p>
                        <p>{headerData?.customerstreet}</p>
                        <p>{headerData?.customerregion}</p>
                        <p>{headerData?.customercity}{headerData?.customerpincode}</p>
                        <p>Phno:-{headerData?.customermobileno}</p>
                    </div>
                </div>
                <div>
                    <p><span className="fw-bold">HKD {headerData?.MetalRate24K}</span></p>
                </div>
            </div>
            {/* table header */}
            <div className="border-start border-end border-bottom d-flex">
                <div className={`d-flex justify-content-center align-items-center fw-bold text-center p-1 ${style?.SR} border-end`}>SR#</div>
                <div className={`d-flex justify-content-center align-items-center fw-bold text-center p-1 ${style?.DESIGN} border-end`}>DESIGN</div>
                <div className={`d-flex justify-content-center align-items-center fw-bold text-center p-1 ${style?.PURITY} border-end`}>PURITY</div>
                <div className={`d-flex justify-content-center align-items-center fw-bold text-center p-1 ${style?.QLTY} border-end`}>QLTY</div>
                <div className={`d-flex justify-content-center align-items-center fw-bold text-center p-1 ${style?.DIAWT} border-end`}>DIA WT</div>
                <div className={`d-flex justify-content-center align-items-center fw-bold text-center p-1 ${style?.DIARATE} border-end`}>DIA RATE (IN HKD)</div>
                <div className={`d-flex justify-content-center align-items-center fw-bold text-center p-1 ${style?.DIAAMT} border-end`}>DIA AMT (IN HKD)</div>
                <div className={`d-flex justify-content-center align-items-center fw-bold text-center p-1 ${style?.GWT} border-end`}>G WT</div>
                <div className={`d-flex justify-content-center align-items-center fw-bold text-center p-1 ${style?.NWT} border-end`}>NWT</div>
                <div className={`d-flex justify-content-center align-items-center fw-bold text-center p-1 ${style?.MAKING} border-end`}>MAKING (IN HKD)</div>
                <div className={`d-flex justify-content-center align-items-center fw-bold text-center p-1 ${style?.CSAMT} border-end`}>CSAMT (IN HKD)</div>
                <div className={`d-flex justify-content-center align-items-center fw-bold text-center p-1 ${style?.GOLDFINE} border-end`}>GOLD FINE</div>
                <div className={`d-flex justify-content-center align-items-center fw-bold text-center p-1 ${style?.GOLDAMT} border-end`}>GOLD AMT (IN HKD)</div>
                <div className={`d-flex justify-content-center align-items-center fw-bold text-center p-1 ${style?.AMOUNT}`}>AMOUNT (IN HKD)</div>
            </div>
            {/* table body */}
            {data.resultArray.map((e, i) => {
                return <div className="no_break border-start border-end border-bottom d-flex" key={i}>
                    <div className={`text-center p-1 ${style?.SR} border-end`}>{i + 1}</div>
                    <div className={`fw-bold p-1 ${style?.DESIGN} border-end`}>
                        <p>{e?.designno} ({e?.BrandName})</p>
                        <p>{e?.SrJobno}</p>
                        {checkBox?.image && <img src={e?.DesignImage} alt="" className='imgWidth w-100' onError={handleImageError} />}
                    </div>
                    <div className={`p-1 ${style?.PURITY} border-end`}>{e?.MetalTypePurity}</div>
                    <div className={`p-1 ${style?.QLTY} border-end`}>
                        {
                            e?.diamonds.map((ele, ind) => {
                                return <p key={ind} className={`${style?.word_break}`}>{ele?.QualityName}</p>
                            })
                        }
                    </div>
                    <div className={`text-end p-1 ${style?.DIAWT} border-end`}>
                        {
                            e?.diamonds.map((ele, ind) => {
                                return <p key={ind} className={`${style?.word_break}`}>{NumberWithCommas(ele?.Wt, 3)}</p>
                            })
                        }</div>
                    <div className={`text-end p-1 ${style?.DIARATE} border-end`}>
                        {
                            e?.diamonds.map((ele, ind) => {
                                return <p key={ind} className={`${style?.word_break}`}>{NumberWithCommas(ele?.Rate, 2)}</p>
                            })
                        }
                    </div>
                    <div className={`text-end p-1 ${style?.DIAAMT} border-end`}>
                        {
                            e?.diamonds.map((ele, ind) => {
                                return <p key={ind} className={`${style?.word_break}`}>{NumberWithCommas(ele?.Amount, 2)}</p>
                            })
                        }
                    </div>
                    <div className={`text-end p-1 ${style?.GWT} border-end ${style?.word_break}`}>
                        {NumberWithCommas(e?.grosswt, 3)}
                    </div>
                    <div className={`text-end p-1 ${style?.NWT} border-end ${style?.word_break}`}>
                        {NumberWithCommas(e?.NetWt, 3)}
                    </div>
                    <div className={`text-end p-1 ${style?.MAKING} border-end ${style?.word_break}`}>
                        {NumberWithCommas(e?.MakingAmount + e?.TotalDiamondHandling + e?.totals?.diamonds?.SettingAmount + e?.totals?.colorstone?.SettingAmount + e?.OtherCharges + e?.MiscAmount, 2)}
                    </div>
                    <div className={`text-end p-1 ${style?.CSAMT} border-end ${style?.word_break}`}>{NumberWithCommas(e?.totals?.colorstone?.Amount, 2)}</div>
                    <div className={`text-end p-1 ${style?.GOLDFINE} border-end ${style?.word_break}`}>{NumberWithCommas(e?.convertednetwt, 2)}</div>
                    <div className={`text-end p-1 ${style?.GOLDAMT} border-end ${style?.word_break}`}>{NumberWithCommas(e?.metalAmounts / headerData?.CurrencyExchRate, 2)}</div>
                    <div className={`text-end p-1 ${style?.AMOUNT} ${style?.word_break}`}>{NumberWithCommas(e?.TotalAmount / headerData?.CurrencyExchRate, 2)}</div>
                </div>
            })}
            {/* table total */}
            <div className={`no_break border-start border-end border-bottom d-flex lightGrey ${style?.word_break}`}>
                <div className={`fw-bold p-1 ${style?.total} border-end`}>
                    <p className='fw-bold text-center'>Total</p>
                </div>
                <div className={`text-end fw-bold p-1 ${style?.DIAWT} border-end ${style?.word_break}`}>{NumberWithCommas(data?.mainTotal?.diamonds?.Wt, 3)}</div>
                <div className={`text-end fw-bold p-1 ${style?.DIARATE} border-end`}></div>
                <div className={`text-end fw-bold p-1 ${style?.DIAAMT} border-end ${style?.word_break}`}>{NumberWithCommas(data?.mainTotal?.diamonds?.Amount, 2)}</div>
                <div className={`text-end fw-bold p-1 ${style?.GWT} border-end ${style?.word_break}`}>{NumberWithCommas(data?.mainTotal?.grosswt, 3)}</div>
                <div className={`text-end fw-bold p-1 ${style?.NWT} border-end ${style?.word_break}`}>{NumberWithCommas(data?.mainTotal?.netwt, 3)}</div>
                <div className={`text-end fw-bold p-1 ${style?.MAKING} border-end ${style?.word_break}`}>{NumberWithCommas(data?.mainTotal?.total_Making_Amount
                    +data?.mainTotal?.diamonds?.SettingAmount+data?.mainTotal?.colorstone?.SettingAmount+data?.mainTotal?.total_otherCharge_Diamond_Handling, 2)}</div>
                <div className={`text-end fw-bold p-1 ${style?.CSAMT} border-end ${style?.word_break}`}>{NumberWithCommas(data?.mainTotal?.colorstone?.Amount, 2)}</div>
                <div className={`text-end fw-bold p-1 ${style?.GOLDFINE} border-end ${style?.word_break}`}>{NumberWithCommas(data?.mainTotal?.convertednetwt, 2)}</div>
                <div className={`text-end fw-bold p-1 ${style?.GOLDAMT} border-end ${style?.word_break}`}>{NumberWithCommas(data?.mainTotal?.MetalAmount, 2)}</div>
                <div className={`text-end fw-bold p-1 ${style?.AMOUNT} ${style?.word_break}`}>{NumberWithCommas(data?.mainTotal?.total_amount, 2)}</div>
            </div>
            {/* gold in 24 k */}
            <div className={`no_break my-1 d-flex justify-content-between p-1 lightGrey border ${style?.font_14}`}>
                <p>  Gold in 24K : <span className="fw-bold">{NumberWithCommas(data?.mainTotal?.convertednetwt, 3)}</span></p>
                <p className='fw-bold'>	TOTAL IN HKD :   {NumberWithCommas(data?.finalAmount, 2)}  </p>
            </div>
            {/* total currency */}
            <div className={`no_break my-1 text-end p-1 border ${style?.font_14}`}>
                <p className='fw-bold'>	TOTAL IN Hong Kong Dollar :    HK$ {NumberWithCommas(data?.finalAmount, 2)}    </p>
            </div>
        </div>
    ) : (
        <p className="text-danger fs-2 fw-bold mt-5 text-center w-50 mx-auto">
            {msg}
        </p>
    );
}

export default SummaryInCurrency