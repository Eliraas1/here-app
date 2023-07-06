import * as XLSX from "xlsx";
import {
    table,
    read,
    data,
    getPX,
    getQ1,
    getQ2,
    getQ3,
    Data,
    discountRate,
} from "./part1";
import moment from "moment";
const currentDate = moment(new Date("1.1.2022"));

const parseStringToNumber = (item: string) => {
    return parseFloat(item.replace(",", ""));
};

const calcFactorActuary = (item: Data) => {
    if (item["תאריך עזיבה "]) return 1;
    if (!item.openingBalanceCommitment) return 0;
    const index = item.index - 1;
    const dada = 0;
    // const dada =parseFloat(table[index]?.salary?.replace(",", ""));
    const gaga =
        item["שכר "] * item.seniority * (1 - (item["אחוז סעיף 14"] || 0));

    return dada / gaga;
};
const getPartialYearSeniority = (item: Data) => {
    if (!item["תאריך עזיבה "]) return 1;
    const fixedDate = moment(item["תאריך עזיבה "]);
    fixedDate.set("year", 2022);
    return fixedDate.diff(currentDate, "day") / 365.25;
};

// calc 1
//עלות שירות שוטף
const calcWorkerFlowCost = (item: Data) => {
    const fourteenPercent = item["אחוז סעיף 14"] || 0;
    const workerFlowCost =
        item["שכר "] *
        item.partialYearSeniority *
        (1 - fourteenPercent) *
        item.actuaryFactor;

    return workerFlowCost;
};

//שיעור היוון
const getDiscountRate = (item: Data) => {
    const age = item.age;
    const w = item.W - age;
    let value = 0;
    for (let i = 1; i < w; i++) {
        value += getPX(i, item) ** i;
    }
    const fixedValue = Math.round(value);
    return discountRate[fixedValue];
};

// הטבות ששולמו = שווי נכס + הפקדות
// יתרת פתיחה -item.openingBalanceCommitment
// יתרת סגירה התחייבות-פיצויים של חלק א
// יתרת סגירה נכסים-item.assetsValue
// הפקדות לנכסי תוכנית - הפקדות

//הטבות ששולמו
const getBenefitsPaid = (item: Data) => {
    return (item["השלמה בצ'ק"] || 0) + (item["תשלום מהנכס"] || 0);
};

//calc2
// עלות היוון
const getDiscountRateCost = (item: Data) => {
    const discountRate = getDiscountRate(item);
    const value =
        item.openingBalanceCommitment * discountRate +
        (item.workerFlowCost - item.benefitsPaid) * (discountRate / 2);

    return value;
};

//calc 3
//הפסדים רווחים אקטואריים
const getActuarialProfitsAndLoss = (item: Data) => {
    const index = item.index - 1;
    const compensation = item.index === 143 ? 18188 : 0;
    // const compensation =
    //          parseFloat(table[index]?.salary?.replace(",", ""));

    const value =
        compensation -
        item.openingBalanceCommitment -
        item.workerFlowCost -
        item.discountRateCost +
        item.benefitsPaid;
    return value;
};

// ---------------- assets ----------------
//calc4
//תשואה צפויה על נכסי התכנית
const getExpectedAssetsReturn = (item: Data) => {
    //שיעון היוון תשואה צפויה
    const discountRate = getDiscountRate(item);
    const value =
        item.openingBalanceAssets * discountRate +
        ((item.הפקדות || 0) - item.benefitsPaid) * (discountRate / 2);

    return value;
};

// calc5
// רווחים הפסדים אקטואריים - נכסים
const getAssetsProfitsAndLoss = (item: Data) => {
    const assetsValueClosed = item["תאריך עזיבה "] ? 0 : item["שווי נכס"] || 0;

    const value =
        assetsValueClosed -
        item.openingBalanceAssets -
        item.expectedAssetsReturn -
        (item.הפקדות || 0) +
        item.benefitsPaid;

    return value;
};

const excelDataCommitment: any[] = [];
const excelDataAssets: any[] = [];

data.forEach((item) => {
    item.actuaryFactor = calcFactorActuary(item);
    item.partialYearSeniority = getPartialYearSeniority(item);
    item.workerFlowCost = calcWorkerFlowCost(item);
    item.benefitsPaid = getBenefitsPaid(item);
    item.discountRateCost = getDiscountRateCost(item);
    item.actuarialProfitAndLoss = getActuarialProfitsAndLoss(item);
    item.expectedAssetsReturn = getExpectedAssetsReturn(item);
    item.assetsProfitsAndLoss = getAssetsProfitsAndLoss(item);

    //excel assertion
    const index = item.index;
    const commitment = {
        "מספר עובד": index,
        "יתרת פתיחה": item.openingBalanceCommitment,
        "עלות שירות שוטף": item.workerFlowCost,
        "עלות היוון": item.discountRateCost,
        "הטבות ששולמו": item.benefitsPaid,
        "הפסד אקטוארי": item.actuarialProfitAndLoss,
        // "יתרת סגירה": 0,
        "יתרת סגירה": table[index - 1]?.salary,
        "פקטור אקטוארי": item.actuaryFactor,
    };
    const assets = {
        "מספר עובד": index,
        "יתרת פתיחה": item.openingBalanceAssets,
        "תשואה צפויה": item.expectedAssetsReturn,
        הפקדות: item.הפקדות,
        "הטבות ששולמו מהנכסים": item.benefitsPaid,
        "רווח אקטוארי": item.assetsProfitsAndLoss,
        "יתרת סגירה": item["תאריך עזיבה "] ? 0 : item["שווי נכס"],
    };
    excelDataCommitment.push(commitment);
    excelDataAssets.push(assets);
});

//TODO: EXCEL WITH DATA, table to assets, table to commitment
const createTables = (xlType: "commitment" | "assets") => {
    var filename = `part2_result_${xlType}.xlsx`;
    var ws_name = "results";
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(
        xlType === "assets" ? excelDataAssets : excelDataCommitment
    );
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    XLSX.writeFile(wb, filename);
};

createTables("assets");
createTables("commitment");
