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
    if (!item.openingBalanceCommitment) return 0;
    const index = item.index - 1;
    const dada = parseFloat(table[index]?.salary?.replace(",", ""));

    const gaga =
        item["שכר "] * item.seniority * (1 - (item["אחוז סעיף 14"] || 0));

    return dada / gaga;
};
const getPartialYearSeniority = (item: Data) => {
    if (!item["תאריך עזיבה "]) return 1;
    const fixedDate = moment(item["תאריך עזיבה "]);
    return fixedDate.diff(currentDate) / 365.25;
};

// calc 1
const calcWorkerFlowCost = (item: Data) => {
    const fourteenPercent = item["אחוז סעיף 14"] || 0;
    const workerFlowCost =
        item["שכר "] *
        item.partialYearSeniority *
        (1 - fourteenPercent) *
        item.actuaryFactor;
    return workerFlowCost;
};

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
// יתרת סגירה -פיצויים של חלק א

const getBenefitsPaid = (item: Data) => {
    return (item["השלמה בצ'ק"] || 0) + (item["תשלום מהנכס"] || 1);
};

const getActuarialProfitsAndLoss = (item: Data) => {
    const index = item.index - 1;
    const compensation = parseFloat(table[index]?.salary?.replace(",", ""));

    const value =
        compensation -
        item.openingBalanceCommitment -
        item.workerFlowCost -
        item.discountRateCost +
        item.benefitsPaid;
    return value;
};
//calc2
const getDiscountRateCost = (item: Data) => {
    const discountRate = getDiscountRate(item);
    const value =
        item.openingBalanceCommitment *
        discountRate *
        item.workerFlowCost *
        item.benefitsPaid *
        (discountRate / 2);

    return value;
};

data.forEach((item) => {
    item.actuaryFactor = calcFactorActuary(item);
    item.partialYearSeniority = getPartialYearSeniority(item);
    item.workerFlowCost = calcWorkerFlowCost(item);
    item.benefitsPaid = getBenefitsPaid(item);
    item.discountRateCost = getDiscountRateCost(item);
    item.actuarialProfitAndLoss = getActuarialProfitsAndLoss(item);
});
